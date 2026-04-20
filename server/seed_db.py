import random
import logging
from app.database import SessionLocal, engine
from app import models, auth as auth_utils

logging.basicConfig(level=logging.INFO)

def generate_random_name():
    first_names = [
        "Ashwin", "Priya", "Rahul", "Ananya", "Sanjay", "Deepika", "Vikram", "Meera", "Arjun", "Kavya", 
        "Rohan", "Sneha", "Karthik", "Divya", "Vijay", "Anita", "Suraj", "Lakshmi", "Manoj", "Harini", 
        "Sharmila", "Kavitha", "Rajesh", "Suresh", "Aarav", "Diya", "Rohit", "Pooja", "Sameer", "Neha",
        "Aditya", "Shruti", "Nihar", "Isha", "Varun", "Anjali", "Siddharth", "Riya", "Abhishek", "Shreya",
        "Aryan", "Zara", "Harsh", "Seema", "Nikhil", "Tejas", "Pradeep", "Vaida", "Sandeep", "Ruhi",
        "Akash", "Sakshi", "Bhavna", "Mohit", "Sakshi", "Yash", "Drishti", "Pranav", "Nisha", "Vivek",
        "Maya", "Ravi", "Gita", "Saurav", "Manvi", "Ishaan", "Kriti", "Dhruv", "Usha", "Tanay",
        "Swara", "Arpit", "Chaitra", "Nitin", "Pooja", "Aman", "Jaya", "Sarthak", "Kaveri", "Pavan"
    ]
    last_names = [
        "N", "G", "S", "R", "K", "M", "A", "V", "P", "D", "C", "B", "T", "J", "H", "L", "W", "Z", "Y", "X",
        "Sharma", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Gupta", "Verma", "Jain", "Das",
        "Nair", "Iyer", "Menon", "Bhat", "Desai", "Malhotra", "Chopra", "Sinha", "Roy", "Dey"
    ]
    return random.choice(first_names), random.choice(last_names)

def seed_db():
    # Ensure tables are dropped and recreated for a clean start
    logging.info("Recreating all tables for expanded metadata...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Pre-hash common passwords for faster seeding
        logging.info("Pre-computing password hashes...")
        common_hashes = {
            "admin23": auth_utils.get_password_hash("admin23"),
            "password123": auth_utils.get_password_hash("password123"),
            "default": auth_utils.get_password_hash("student123")
        }
        
        # 1. Seed Admin User
        logging.info("Creating admin user...")
        admin_email = "admin@gmail.com"
        admin_user = models.User(
            email=admin_email,
            full_name="Admin Administrator",
            hashed_password=common_hashes["admin23"],
            role=models.UserRole.ADMIN,
            is_active=True
        )
        db.add(admin_user)
        db.commit()

        departments = ["AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME", "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"]
        common_hashed_pw = auth_utils.get_password_hash("password123")
        used_emails = {admin_email} # Initialize with admin email

        # 2. Seed Staff (10-15 per department)
        logging.info("Starting seeding of 150+ staff members...")
        designations = ["Assistant Professor", "Associate Professor", "Professor", "Head of Department"]
        colleges = ["IIT Madras", "NIT Trichy", "PSG Tech", "Anna University", "BITS Pilani", "MIT", "Stanford"]
        skills_map = {
            "AIML": ["TensorFlow", "PyTorch", "NLP", "Computer Vision", "Reinforcement Learning"],
            "CSE": ["Data Structures", "Algorithms", "Cloud Computing", "Cyber Security", "Distributed Systems"],
            "ECE": ["VLSI", "Embedded Systems", "Signal Processing", "Communication Systems", "IoT"],
            "EEE": ["Power Systems", "Control Systems", "Renewable Energy", "Electrical Machines", "Smart Grids"],
            "MECH": ["Thermodynamics", "Robotics", "CAD/CAM", "Manufacturing", "Automobile Engineering"],
            "IT": ["Web Development", "Database Management", "Agile", "DevOps", "Cyber Security"]
        }
        # Fallback skills for other depts
        default_skills = ["Research Methodology", "Project Management", "Technical Writing", "Academic Leadership"]

        for dept in departments:
            logging.info(f"Seeding Staff for {dept}...")
            # Randomly pick between 20 and 30 staff per department for 8600 students
            staff_count = random.randint(20, 30)
            for i in range(staff_count):
                first_name, last_initial = generate_random_name()
                full_name = f"{first_name} {last_initial}"
                
                # Staff Email Logic: {Name}{Dept}{ID}@gmail.com
                random_id = random.randint(100, 999)
                inst_email = f"{first_name}{dept}{random_id}@gmail.com".lower()
                primary_email = f"staff.{dept.lower()}{random_id}@gmail.com"
                
                while primary_email in used_emails or inst_email in used_emails:
                    random_id = random.randint(100, 999)
                    inst_email = f"{first_name}{dept}{random_id}@gmail.com".lower()
                    primary_email = f"staff.{dept.lower()}{random_id}@gmail.com"
                
                used_emails.add(primary_email)
                used_emails.add(inst_email)
                
                user = models.User(
                    email=primary_email,
                    full_name=full_name,
                    institutional_email=inst_email,
                    hashed_password=common_hashed_pw,
                    role=models.UserRole.FACULTY,
                    is_active=True
                )
                db.add(user)
                try:
                    db.flush()
                except Exception as e:
                    logging.warning(f"Failed to flush staff {full_name}: {e}")
                    db.rollback()
                    continue

                staff = models.Staff(
                    user_id=user.id,
                    staff_id=f"STF{dept}{random_id}",
                    department=dept,
                    designation=random.choice(designations),
                    be_degree="B.E. " + (dept if dept in ["ECE", "EEE", "CSE", "MECH", "CIVIL"] else "Engineering"),
                    be_college=random.choice(colleges),
                    me_degree="M.E. " + (dept if dept in ["ECE", "EEE", "CSE", "MECH", "CIVIL"] else "Specialization"),
                    me_college=random.choice(colleges),
                    primary_skill=random.choice(skills_map.get(dept, default_skills)),
                    projects_completed=random.randint(5, 25),
                    publications_count=random.randint(3, 15),
                    consistency_score=random.uniform(0.75, 0.98),
                    student_feedback_rating=round(random.uniform(3.8, 4.9), 1),
                    personal_email=f"{first_name.lower()}{random_id}@gmail.com",
                    personal_phone=f"+91{random.randint(7000000000, 9999999999)}"
                )
                db.add(staff)
            db.commit()

        # 3. Seed Students (8600 students - 143 per year per department)
        logging.info("Starting seeding of 8600 students with optimized data generation...")
        years = [1, 2, 3, 4]
        batch_map = {1: "25", 2: "24", 3: "23", 4: "22"}
        blood_groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

        for dept in departments:
            logging.info(f"Seeding Students for {dept}...")
            for year in years:
                batch = batch_map[year]
                for i in range(1, 144):
                    first_name, last_initial = generate_random_name()
                    full_name = f"{first_name} {last_initial}"
                    
                    random_roll = f"{i:03d}"
                    roll_number = f"7376{batch}{dept}{year}{random_roll}"
                    # Enhanced unique email with better collision avoidance
                    unique_suffix = f"{random.randint(100000, 999999)}"
                    inst_email = f"{first_name.lower()}.{last_initial.lower()}{unique_suffix}@gmail.com"
                    
                    # Retry if email collision
                    attempts = 0
                    while inst_email in used_emails and attempts < 5:
                        unique_suffix = f"{random.randint(100000, 999999)}"
                        inst_email = f"{first_name.lower()}.{last_initial.lower()}{unique_suffix}@gmail.com"
                        attempts += 1
                    
                    used_emails.add(inst_email)
                    
                    unique_password = f"{first_name}#{roll_number[-4:]}!"
                    
                    user = models.User(
                        email=inst_email, # Now using institutional email as primary login
                        full_name=full_name,
                        institutional_email=inst_email,
                        hashed_password=auth_utils.get_password_hash(unique_password),
                        plain_password=unique_password,
                        role=models.UserRole.STUDENT,
                        is_active=True
                    )
                    db.add(user)
                    db.flush() 

                    # Enhanced student metrics with realistic variations
                    risk_choice = random.choices(["Low", "Medium", "High"], weights=[0.70, 0.20, 0.10])[0]
                    cgpa_val = round(random.uniform(6.5, 9.5), 2)
                    
                    # Correlation: Higher CGPA = Lower risk
                    if cgpa_val >= 8.5:
                        risk_choice = random.choices(["Low", "Medium"], weights=[0.85, 0.15])[0]
                    elif cgpa_val >= 8.0:
                        risk_choice = random.choices(["Low", "Medium", "High"], weights=[0.75, 0.20, 0.05])[0]
                    
                    student = models.Student(
                        user_id=user.id,
                        roll_number=roll_number,
                        department=dept,
                        year=year,
                        dob=f"{2007 - year}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
                        blood_group=random.choice(blood_groups),
                        parent_phone=f"+91{random.randint(6000000000, 9999999999)}",
                        personal_phone=f"+91{random.randint(6000000000, 9999999999)}",
                        personal_email=f"{first_name.lower()}{unique_suffix}@outlook.com",
                        current_cgpa=cgpa_val,
                        academic_dna_score=round(random.uniform(70, 95), 2),
                        growth_index=round(random.uniform(0.5, 5.0), 2),
                        risk_level=risk_choice,
                        career_readiness_score=round(random.uniform(60, 90), 2)
                    )
                    db.add(student)
                    db.flush()
                    
                    for sem in range(1, 6):
                        # Realistic subject variations per department
                        subjects = {
                            "CSE": ["Data Structures", "DBMS", "OS", "Network Security", "Cloud Computing"],
                            "AIML": ["ML Algorithms", "NLP", "Computer Vision", "Deep Learning", "Reinforcement Learning"],
                            "EEE": ["Power Systems", "Control Systems", "Microprocessors", "Electrical Machines", "Power Electronics"],
                            "ECE": ["VLSI Design", "Digital Signal Processing", "Communication Systems", "Embedded Systems", "Antenna Design"],
                            "MECH": ["Thermodynamics", "Strength of Materials", "Fluid Mechanics", "Machine Design", "Mechanical Vibrations"],
                        }
                        subject_list = subjects.get(dept, [f"Subject {sem}.{i}" for i in range(1, 6)])
                        
                        record = models.AcademicRecord(
                            student_id=student.id,
                            semester=sem,
                            subject=random.choice(subject_list),
                            internal_marks=round(random.uniform(15, 20), 1),
                            external_marks=round(random.uniform(50, 80), 1),
                            grade=random.choice(["O", "A+", "A", "B+", "B"]),
                            attendance_percentage=round(random.uniform(75, 100), 1)
                        )
                        db.add(record)
                        
                    prob_map = {
                        "Low": random.uniform(0.01, 0.2), 
                        "Medium": random.uniform(0.3, 0.6), 
                        "High": random.uniform(0.7, 0.95)
                    }
                    risk_prob = prob_map.get(student.risk_level, 0.1)

                    ai_score = models.AIScore(
                        student_id=student.id,
                        consistency_index=round(random.uniform(0.7, 0.95), 3),
                        performance_volatility=round(random.uniform(0.05, 0.15), 3),
                        cgpa_prediction=round(student.current_cgpa + random.uniform(-0.3, 0.4), 2),
                        risk_probability=round(risk_prob, 2),
                        skill_gap_score=round(random.uniform(60, 85), 2)
                    )
                    db.add(ai_score)

                db.commit()
        logging.info("Successfully seeded all staff and students.")
    except Exception as e:
        db.rollback()
        logging.error(f"Error during seeding: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
