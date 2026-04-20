from app.database import SessionLocal
from app.models import Subject, Staff, AcademicRecord, Student
import uuid
import random

def seed_subjects():
    db = SessionLocal()
    try:
        # 1. Clear existing academic records to avoid 'only one subject' issue
        # db.query(AcademicRecord).delete()
        
        # 2. Get some faculty to assign
        staff_ids = [s.id for s in db.query(Staff).all()]
        if not staff_ids:
            print("No staff found. Please seed staff first.")
            return

        subjects_data = [
            {"code": "CS101", "name": "Computer Programming", "dept": "CSE", "sem": 1},
            {"code": "CS201", "name": "Data Structures", "dept": "CSE", "sem": 3},
            {"code": "AI301", "name": "Neural Networks", "dept": "AIML", "sem": 5},
            {"code": "IT401", "name": "Cyber Security", "dept": "IT", "sem": 7},
            {"code": "EC102", "name": "Digital Electronics", "dept": "ECE", "sem": 2},
            {"code": "MA101", "name": "Engineering Mathematics", "dept": "Common", "sem": 1},
            {"code": "PH101", "name": "Engineering Physics", "dept": "Common", "sem": 1},
            {"code": "ME202", "name": "Thermodynamics", "dept": "MECH", "sem": 4},
        ]

        # Add to Subject table
        formal_subs = []
        for s in subjects_data:
            existing = db.query(Subject).filter(Subject.code == s["code"]).first()
            if not existing:
                new_sub = Subject(
                    id=str(uuid.uuid4()),
                    code=s["code"],
                    name=s["name"],
                    department=s["dept"],
                    semester=s["sem"],
                    faculty_id=random.choice(staff_ids)
                )
                db.add(new_sub)
                formal_subs.append(new_sub)
            else:
                formal_subs.append(existing)
        db.commit()

        # 3. Seed academic records for all students
        students = db.query(Student).all()
        print(f"Seeding academic records for {len(students)} students...")
        
        # To speed up, we'll do 5 subjects per student
        for student in students:
            try:
                # Randomly pick 3-6 subjects for this student
                for sub in random.sample(formal_subs, min(len(formal_subs), random.randint(3, 6))):
                    # Check if record exists
                    existing_record = db.query(AcademicRecord).filter(
                        AcademicRecord.student_id == student.id,
                        AcademicRecord.subject == sub.name
                    ).first()
                    
                    if not existing_record:
                        internal = random.uniform(30, 50) 
                        external = random.uniform(10, 50) 
                        total = internal + external
                        
                        record = AcademicRecord(
                            id=str(uuid.uuid4()),
                            student_id=student.id,
                            semester=sub.semester,
                            subject=sub.name,
                            subject_id=sub.id,
                            internal_marks=round(internal, 1),
                            external_marks=round(external, 1),
                            attendance_percentage=random.uniform(70, 100),
                            grade="A" if total > 90 else "B" if total > 75 else "C" if total > 60 else "D" if total > 50 else "F"
                        )
                        db.add(record)
                
                if len(db.new) > 200: 
                    db.commit()
            except Exception as e:
                db.rollback()
                print(f"Skipping student: {e}")
                continue
        db.commit()
        print("Subject Intelligence Data Seeded Successfully!")

    except Exception as e:
        print(f"Error seeding subjects: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_subjects()
