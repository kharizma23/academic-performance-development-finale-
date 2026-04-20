import random
import logging
import uuid
import time
import json
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models, auth as auth_utils

logging.basicConfig(level=logging.INFO)

# --- CONFIGURATION & POOLS ---
DEPARTMENTS = ["AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME", "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"]

# Expanded name pools to ensure uniqueness
FIRST_NAMES_MALE = ["Arjun", "Rahul", "Vikram", "Sanjay", "Rohan", "Karthik", "Vijay", "Suraj", "Manoj", "Rohit", "Aditya", "Varun", "Siddharth", "Abhishek", "Aryan", "Harsh", "Nikhil", "Tejas", "Pradeep", "Sandeep", "Akash", "Mohit", "Yash", "Pranav", "Vivek", "Ravi", "Saurav", "Ishaan", "Dhruv", "Tanay", "Arpit", "Nitin", "Aman", "Sarthak", "Pavan", "Kiran", "Lokesh", "Prasanna", "Vignesh", "Dinesh", "Ganesh", "Suresh", "Ramesh", "Sridhar", "Venkatesh", "Balamurugan", "Durai", "Elango", "Govind", "Jeeva"]
FIRST_NAMES_FEMALE = ["Ananya", "Deepika", "Meera", "Kavya", "Sneha", "Divya", "Anita", "Lakshmi", "Harini", "Sharmila", "Kavitha", "Diya", "Pooja", "Shruti", "Isha", "Anjali", "Riya", "Shreya", "Zara", "Seema", "Ruhi", "Sakshi", "Bhavna", "Drishti", "Nisha", "Maya", "Gita", "Manvi", "Kriti", "Swara", "Chaitra", "Jaya", "Kaveri", "Banu", "Chitra", "Hema", "Indira", "Kala", "Latha", "Mala", "Nila", "Oviya", "Priya", "Radhika", "Sudha", "Uma", "Vani", "Yamini", "Zoya", "Meena"]
LAST_NAMES = ["Sharma", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Gupta", "Verma", "Jain", "Das", "Nair", "Iyer", "Menon", "Bhat", "Desai", "Malhotra", "Chopra", "Sinha", "Roy", "Dey", "Chatterjee", "Mukherjee", "Banerjee", "Kulkarni", "Deshmukh", "Joshi", "Prabhu", "Ahuja", "Mehta", "Aggarwal", "Shetty", "Pillai", "Naidu", "Gounder", "Thevar", "Chettiar", "Varghese", "Kurian", "Modi", "Shah"]

used_emails = set()
used_names = set()

def generate_unique_name():
    gender = random.choice(["M", "F"])
    pool = FIRST_NAMES_MALE if gender == "M" else FIRST_NAMES_FEMALE
    
    attempts = 0
    while attempts < 1000:
        fn = random.choice(pool)
        ln = random.choice(LAST_NAMES)
        full_name = f"{fn} {ln}"
        if full_name not in used_names:
            used_names.add(full_name)
            return full_name, gender
        attempts += 1
    
    # Fallback with random number if pools exhausted
    fn = random.choice(pool)
    ln = random.choice(LAST_NAMES)
    full_name = f"{fn} {ln} {random.randint(1, 9999)}"
    return full_name, gender

# --- DEPARTMENT PROFILES ---
# Values will differ for each department as requested
DEPT_PROFILES = {
    "CSE": {"cgpa_mean": 8.2, "cgpa_std": 0.8, "readiness_mean": 85, "dna_mean": 82, "top_skills": ["DSA", "System Design", "Fullstack"]},
    "AIML": {"cgpa_mean": 8.5, "cgpa_std": 0.6, "readiness_mean": 88, "dna_mean": 88, "top_skills": ["TensorFlow", "PyTorch", "NLP"]},
    "ECE": {"cgpa_mean": 7.9, "cgpa_std": 0.9, "readiness_mean": 78, "dna_mean": 75, "top_skills": ["VLSI", "Embedded", "Signals"]},
    "MECH": {"cgpa_mean": 7.5, "cgpa_std": 1.0, "readiness_mean": 72, "dna_mean": 70, "top_skills": ["Robotics", "CAD", "Thermodynamics"]},
    "IT": {"cgpa_mean": 8.0, "cgpa_std": 0.7, "readiness_mean": 82, "dna_mean": 80, "top_skills": ["Cloud", "DevOps", "Database"]},
    "EEE": {"cgpa_mean": 7.7, "cgpa_std": 0.9, "readiness_mean": 75, "dna_mean": 72, "top_skills": ["Power Systems", "Control", "Electrical"]},
    "AIDS": {"cgpa_mean": 8.4, "cgpa_std": 0.7, "readiness_mean": 87, "dna_mean": 86, "top_skills": ["Data Science", "Big Data", "MLOps"]},
}
# Default profile for other depts
DEFAULT_PROFILE = {"cgpa_mean": 7.6, "cgpa_std": 1.0, "readiness_mean": 70, "dna_mean": 70, "top_skills": ["Core Fundamentals", "Soft Skills"]}

def get_profile(dept):
    return DEPT_PROFILES.get(dept, DEFAULT_PROFILE)

def seed_institutional_data():
    logging.info("Initiating Professional Institutional Seeding...")
    
    # Surgical Cleanup Node
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    pass_hash = auth_utils.get_password_hash("password123")
    
    # 1. ADMIN USER
    admin = models.User(
        email="admin@gmail.com",
        full_name="Institutional Administrator",
        hashed_password=auth_utils.get_password_hash("admin23"),
        role=models.UserRole.ADMIN,
        is_active=True
    )
    db.add(admin)
    db.commit()
    
    # 2. FACULTY NODES (10 per department = 150 total)
    logging.info("Generating 150 Unique Faculty Nodes...")
    faculty_list = []
    for dept in DEPARTMENTS:
        profile = get_profile(dept)
        for i in range(10):
            name, gender = generate_unique_name()
            email = f"staff.{name.lower().replace(' ', '.')}{random.randint(10,99)}@{dept.lower()}.edu"
            
            user = models.User(
                email=email, full_name=name, 
                role=models.UserRole.FACULTY, hashed_password=pass_hash,
                is_active=True
            )
            db.add(user)
            db.flush()
            
            staff = models.Staff(
                user_id=user.id, staff_id=f"STF{dept}{1000+i}", 
                department=dept, designation="Professor" if i < 2 else "Assistant Professor",
                primary_skill=random.choice(profile["top_skills"]),
                consistency_score=round(random.uniform(0.7, 0.98), 2),
                student_feedback_rating=round(random.uniform(3.5, 4.9), 1)
            )
            db.add(staff)
    db.commit()
    
    # 3. STUDENT NODES (~500 total for testing, or more if needed)
    # The request mentioned "values also should be differ for each departments"
    logging.info("Generating Unique Student Nodes with Departmental Variance...")
    for dept in DEPARTMENTS:
        profile = get_profile(dept)
        for year in [1, 2, 3, 4]:
            batch = {1: "26", 2: "25", 3: "24", 4: "23"}[year]
            count = 145 # High-density scaling: 145 * 4 * 15 = 8,700 nodes
            
            for i in range(count):
                name, gender = generate_unique_name()
                email = f"std.{name.lower().replace(' ', '.')}{random.randint(100,999)}@{dept.lower()}.edu"
                
                user = models.User(
                    email=email, full_name=name, 
                    role=models.UserRole.STUDENT, hashed_password=pass_hash,
                    is_active=True
                )
                db.add(user)
                db.flush()
                
                # Department-specific value generation
                cgpa = round(random.gauss(profile["cgpa_mean"], profile["cgpa_std"]), 2)
                cgpa = max(5.0, min(10.0, cgpa))
                
                readiness = round(random.gauss(profile["readiness_mean"], 5), 1)
                readiness = max(40, min(100, readiness))
                
                dna = round(random.gauss(profile["dna_mean"], 5), 1)
                dna = max(40, min(100, dna))
                
                roll_suffix = f"{i+1:03d}"
                roll = f"7376{batch}{dept}{year}{roll_suffix}"
                
                student = models.Student(
                    user_id=user.id, roll_number=roll,
                    department=dept, year=year, current_cgpa=cgpa,
                    gender="Male" if gender == "M" else "Female",
                    academic_dna_score=dna,
                    growth_index=round(random.uniform(1.0, 4.5), 2),
                    career_readiness_score=readiness,
                    risk_level="Low" if cgpa > 8.0 else ("Medium" if cgpa > 6.0 else "High")
                )
                db.add(student)
                db.flush()
                
                # Feedback from random faculty in same dept
                dept_staff = db.query(models.Staff).filter(models.Staff.department == dept).all()
                if dept_staff:
                    faculty = random.choice(dept_staff)
                    feedback = models.Feedback(
                        faculty_id=faculty.user_id,
                        student_id=student.id,
                        overall_rating=round(random.uniform(4, 10), 1),
                        detailed_remarks=f"Excellent progress in {profile['top_skills'][0]}." if cgpa > 8 else "Needs improvement."
                    )
                    db.add(feedback)
                
                # Academic Records
                for sem in range(1, year * 2):
                    record = models.AcademicRecord(
                        student_id=student.id,
                        semester=sem,
                        subject=random.choice(profile["top_skills"]),
                        internal_marks=round(random.uniform(12, 20), 1),
                        external_marks=round(random.uniform(40, 80), 1),
                        attendance_percentage=round(random.uniform(70, 99), 1)
                    )
                    db.add(record)
                
                # Interventions for higher risk
                if student.risk_level != "Low":
                    intervention = models.Intervention(
                        student_id=student.id,
                        issue=f"Low performance in {dept} core modules." if student.risk_level == "High" else "Moderate risk detected.",
                        risk_level=student.risk_level.upper(),
                        assigned_action="Mentor Support" if student.risk_level == "Medium" else "Bridge Program",
                        priority="Urgent" if student.risk_level == "High" else "Normal"
                    )
                    db.add(intervention)

    db.commit()
    logging.info("Institutional Synchronization Complete. All nodes are unique and department-calibrated.")

if __name__ == "__main__":
    seed_institutional_data()
