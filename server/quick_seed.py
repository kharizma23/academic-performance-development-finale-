import random
import logging
from app.database import SessionLocal, engine
from app import models, auth as auth_utils

logging.basicConfig(level=logging.INFO)

names = ["Ashwin", "Priya", "Rahul", "Ananya", "Sanjay", "Deepika", "Vikram", "Meera","Arjun", "Kavya", "Rohan", "Sneha", "Karthik", "Divya"]
lasts = ["N", "G", "S", "R", "K", "M", "A", "V", "P", "D", "Sharma", "Patel", "Singh", "Kumar"]
blood = ["A+", "B+", "O+", "AB+"]
depts = ["AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME", "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"]

def seed():
    logging.info("Recreating database...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    admin_hash = auth_utils.get_password_hash("admin23")
    student_hash = auth_utils.get_password_hash("student@123")
    
    # Admin
    admin = models.User(email="admin@gmail.com", full_name="Admin", hashed_password=admin_hash, role=models.UserRole.ADMIN, is_active=True)
    db.add(admin)
    db.commit()
    
    used = {"admin@gmail.com"}
    total = 0
    
    for dept in depts:
        for year in [1,2,3,4]:
            batch = str(26-year)
            batch_users = []
            
            for i in range(1, 144):
                fname = random.choice(names)
                lname = random.choice(lasts)
                uid = f"{random.randint(100000, 999999)}"
                email = f"{fname}{lname}{uid}@gmail.com".lower()
                
                if email not in used:
                    used.add(email)
                    roll = f"7376{batch}{dept}{year}{i:03d}"
                    
                    user = models.User(
                        email=email,
                        full_name=f"{fname} {lname}",
                        institutional_email=email,
                        hashed_password=student_hash,
                        plain_password=f"{fname}#{roll[-4:]}!",
                        role=models.UserRole.STUDENT,
                        is_active=True
                    )
                    batch_users.append(user)
            
            db.add_all(batch_users)
            db.flush()
            
            cgpa_base = random.uniform(7.5, 8.5)
            for idx, user in enumerate(batch_users):
                cgpa = round(cgpa_base + random.uniform(-0.5, 0.5), 2)
                risk = "Low" if cgpa >= 8.0 else ("Medium" if cgpa >= 7.5 else "High")
                
                student = models.Student(
                    user_id=user.id,
                    roll_number=f"7376{batch}{dept}{year}{idx+1:03d}",
                    department=dept,
                    year=year,
                    dob=f"{2007-year}-{random.randint(1,12):02d}-01",
                    blood_group=random.choice(blood),
                    parent_phone=f"+91{random.randint(6000000000, 9999999999)}",
                    personal_phone=f"+91{random.randint(6000000000, 9999999999)}",
                    personal_email=f"{user.full_name.lower().replace(' ', '')}{random.randint(10, 99)}@gmail.com",
                    current_cgpa=cgpa,
                    academic_dna_score=round(70 + cgpa * 3, 2),
                    growth_index=round(random.uniform(1, 4), 2),
                    risk_level=risk,
                    career_readiness_score=round(65 + cgpa * 4, 2)
                )
                db.add(student)
                db.flush()  # Flush here to get student.id
                
                # Academic records
                for sem in range(1, 6):
                    record = models.AcademicRecord(
                        student_id=student.id,
                        semester=sem,
                        subject=f"Subject-{sem}",
                        internal_marks=round(random.uniform(15, 20), 1),
                        external_marks=round(cgpa * 10 + random.uniform(-5, 5), 1),
                        grade=random.choice(["O", "A+", "A", "B+"]),
                        attendance_percentage=round(80 + random.uniform(-5, 15), 1)
                    )
                    db.add(record)
                
                # AI Score
                risk_prob = 0.1 if risk == "Low" else (0.5 if risk == "Medium" else 0.8)
                ai = models.AIScore(
                    student_id=student.id,
                    consistency_index=round(0.8 + random.uniform(-0.1, 0.15), 3),
                    performance_volatility=round(random.uniform(0.05, 0.15), 3),
                    cgpa_prediction=round(cgpa + random.uniform(-0.2, 0.2), 2),
                    risk_probability=round(risk_prob + random.uniform(-0.1, 0.1), 2),
                    skill_gap_score=round(70 - cgpa * 2, 2)
                )
                db.add(ai)
            
            db.commit()
            total += len(batch_users)
            logging.info(f"✓ {dept} Year-{year}: {len(batch_users)} students (Total: {total})")
    
    logging.info(f"✅ Database seeded! Total students: {total} (Target: 8580)")
    db.close()

if __name__ == "__main__":
    seed()
