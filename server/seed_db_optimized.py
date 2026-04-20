import random
import logging
import uuid
import sys
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal, engine
from app import models, auth as auth_utils

logging.basicConfig(level=logging.INFO)

def generate_random_name():
    first_names = ["Arjun", "Kavya", "Rahul", "Ananya", "Vikram", "Meera", "Sanjay", "Deepika", "Rohan", "Sneha", "Karthik", "Divya", "Vijay", "Anita", "Suraj", "Lakshmi", "Manoj", "Harini", "Diya", "Rohit", "Pooja", "Aditya", "Shruti", "Varun", "Anjali", "Siddharth", "Riya", "Abhishek", "Shreya", "Aryan"]
    last_names = ["Sharma", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Gupta", "Verma", "Jain", "Das", "Nair", "Iyer", "Menon", "Bhat", "Desai"]
    return random.choice(first_names), random.choice(last_names)

def seed_db():
    logging.info("Initiating Failsafe Master Seeding...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    used_emails = set()
    used_rolls = set()

    try:
        pass_hash = auth_utils.get_password_hash("password123")
        admin_pass = auth_utils.get_password_hash("Sudharaajan2302")
        
        # 1. Admin Failsafe Deletion/Creation
        admin_email = "adminkhariz@gmail.com"
        db.query(models.User).filter(models.User.email == admin_email).delete()
        db.commit()
        
        admin = models.User(
            email=admin_email,
            full_name="Kharizma Admin",
            hashed_password=admin_pass,
            role=models.UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        used_emails.add(admin_email)
        
        departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIML", "DS", "CS", "AIDS", "MT", "BT", "EIE", "BME", "AGRI", "FD", "FT"]
        
        used_staff_ids = set()
        # 2. Staff (Per Department Failsafe) - Commitment per department
        for dept in departments:
            logging.info(f"Seeding Faculty Nodes for {dept}...")
            for _ in range(16):
                fname, lname = generate_random_name()
                while True:
                    email = f"staff.{fname.lower()}.{lname.lower()}{random.randint(100,999999)}@gmail.com"
                    if email not in used_emails: break
                used_emails.add(email)
                
                u = models.User(email=email, full_name=f"{fname} {lname}", institutional_email=email, hashed_password=pass_hash, role=models.UserRole.FACULTY)
                db.add(u)
                db.flush()
                
                while True:
                    staff_id = f"STF{random.randint(10000,99999)}"
                    if staff_id not in used_staff_ids: break
                used_staff_ids.add(staff_id)
                
                p = models.Staff(
                    user_id=u.id, 
                    staff_id=staff_id, 
                    department=dept, 
                    designation="Professor", 
                    primary_skill="AI/ML",
                    consistency_score=round(random.uniform(0.75, 0.98), 2),
                    student_feedback_rating=round(random.uniform(3.8, 4.9), 1)
                )
                db.add(p)
            db.commit() # Commit staff per department for robustness

        # 3. Students (Per Year per Dept Failsafe)
        years = [1, 2, 3, 4]
        batch_map = {1: "25", 2: "24", 3: "23", 4: "22"}
        
        for dept in departments:
            # Generate unique student count for this dept (approx 510 total students per dept)
            # 127 * 4 = 508. Let's vary per dept.
            dept_year_size = random.randint(124, 131)
            
            for year in years:
                batch_year = batch_map[year]
                logging.info(f"Seeding {dept_year_size} Students: {dept} Year {year}")
                
                for i in range(1, dept_year_size + 1):
                    fname, lname = generate_random_name()
                    while True:
                        email = f"std.{fname.lower()}.{lname.lower()}{random.randint(1000,99999999)}@gmail.com"
                        if email not in used_emails: break
                    used_emails.add(email)
                    
                    roll = f"7376{batch_year}{dept}{year}{i:03d}"
                    sid = str(uuid.uuid4())
                    
                    u = models.User(id=str(uuid.uuid4()), email=email, full_name=f"{fname} {lname}", institutional_email=email, hashed_password=pass_hash, role=models.UserRole.STUDENT)
                    db.add(u)
                    db.flush()
                    
                    s = models.Student(
                        id=sid,
                        user_id=u.id,
                        roll_number=roll,
                        department=dept,
                        year=year,
                        current_cgpa=round(random.uniform(6.2, 9.8), 2),
                        academic_dna_score=round(random.uniform(65, 95), 1),
                        growth_index=round(random.uniform(1.5, 4.9), 2),
                        risk_level=random.choice(["Low", "Low", "Low", "Medium"]),
                        career_readiness_score=round(random.uniform(70, 98), 1),
                        xp_points=random.randint(800, 6000),
                        streak_count=random.randint(2, 50)
                    )
                    db.add(s)
                    
                    # Core minimum academic/ai data for reliability
                    db.add(models.AcademicRecord(student_id=sid, semester=1, subject="Applied Mathematics", internal_marks=22, external_marks=55, grade="A+", attendance_percentage=random.uniform(85, 99)))
                    db.add(models.AIScore(
                        student_id=sid, 
                        consistency_index=round(random.uniform(0.75, 0.98), 2), 
                        cgpa_prediction=round(s.current_cgpa + random.uniform(-0.4, 0.4), 2), 
                        risk_probability=round(random.uniform(0.01, 0.25), 2), 
                        skill_gap_score=round(100 - s.academic_dna_score, 1)
                    ))
                
                try:
                    db.commit() # Commit per year per department
                except IntegrityError:
                    db.rollback()
                    logging.warning(f"Batch conflict in {dept} Year {year}, skipping segment.")

        logging.info("ALL DEPARTMENTS SYNCHRONIZED.")
    except Exception as e:
        db.rollback()
        logging.error(f"FATAL: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
