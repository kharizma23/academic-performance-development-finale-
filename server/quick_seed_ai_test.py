import random
import uuid
from app.database import SessionLocal
from app import models, auth as auth_utils

def quick_seed():
    db = SessionLocal()
    try:
        # Pre-compute hash
        hashed_pw = auth_utils.get_password_hash("password123")
        
        departments = ["CSE", "ECE", "IT"]
        
        for i in range(30):
            dept = random.choice(departments)
            full_name = f"Student {i}"
            email = f"student{i}@gmail.com"
            
            user = models.User(
                id=str(uuid.uuid4()),
                email=email,
                full_name=full_name,
                hashed_password=hashed_pw,
                role=models.UserRole.STUDENT,
                is_active=True
            )
            db.add(user)
            db.flush()
            
            cgpa = round(random.uniform(7.5, 9.8), 2)
            readiness = round(random.uniform(70, 95), 1)
            
            student = models.Student(
                id=str(uuid.uuid4()),
                user_id=user.id,
                roll_number=f"737622{dept}{i:03d}",
                department=dept,
                year=random.choice([3, 4]),
                current_cgpa=cgpa,
                career_readiness_score=readiness,
                risk_level="Low" if cgpa > 8.5 else "Medium"
            )
            db.add(student)
            
            # Add academic record for DBMS if it's one of the first 5
            if i < 5:
                record = models.AcademicRecord(
                    id=str(uuid.uuid4()),
                    student_id=student.id,
                    semester=5,
                    subject="DBMS",
                    internal_marks=random.uniform(18, 25),
                    attendance_percentage=random.uniform(85, 95)
                )
                db.add(record)

        db.commit()
        print("Quick seed completed! 30 students added.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    quick_seed()
