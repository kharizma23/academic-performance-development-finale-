import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import models, database, auth_utils
from sqlalchemy.orm import Session

def seed_authorized_identities():
    db = database.SessionLocal()
    try:
        # 1. PREPARE THE REGISTRY
        print("Initializing Institutional Registry Synchronization...")
        
        # Define authorized student nodes
        students_data = [
            {"name": "Gita Sinha", "email": "std.gita.sinha730@aiml.edu", "pass": "Git@1234", "dept": "AIML", "year": 1},
            {"name": "Anita Kulkarni", "email": "std.anita.kulkarni@ece.edu", "pass": "Ani@1234", "dept": "ECE", "year": 1},
            {"name": "Saurav J", "email": "saurav.j.ai26.009@gmail.com", "pass": "Sau@Edu2026", "dept": "AI", "year": 1},
            {"name": "Nitin Deshmukh", "email": "std.nitin.deshmukh.4838403@civil.edu", "pass": "Nit@Edu2026", "dept": "CIVIL", "year": 2},
            {"name": "Priyanka Singh", "email": "priyanka.s.cse26.004@gmail.com", "pass": "Pri@Edu2026", "dept": "CSE", "year": 1},
        ]

        # Define authorized staff nodes
        staff_data = [
            {"name": "System Administrator", "email": "admin.platform@gmail.com", "pass": "Admin@1234", "role": models.UserRole.ADMIN, "dept": "ADMIN"},
            {"name": "Senior Faculty Member", "email": "faculty.platform@gmail.com", "pass": "Staff@1234", "role": models.UserRole.FACULTY, "dept": "AIML"}
        ]

        # 2. SEED STUDENTS
        for s in students_data:
            email_lower = s["email"].lower()
            # Check if user exists
            user = db.query(models.User).filter(models.User.email == email_lower).first()
            if not user:
                user = models.User(
                    email=email_lower,
                    full_name=s["name"],
                    role=models.UserRole.STUDENT,
                    hashed_password=auth_utils.get_password_hash(s["pass"])
                )
                db.add(user)
                db.flush()
                print(f"Created Student Identity: {s['name']} <{email_lower}>")
            else:
                user.hashed_password = auth_utils.get_password_hash(s["pass"])
                print(f"Updated Student Token: {s['name']}")

            # Ensure profile exists
            profile = db.query(models.Student).filter(models.Student.user_id == user.id).first()
            if not profile:
                profile = models.Student(
                    user_id=user.id,
                    roll_number=f"2026-{s['dept']}-{user.id}",
                    department=s["dept"],
                    year=s["year"],
                    current_cgpa=8.5,
                    attendance_percentage=90.0,
                    risk_level="Low"
                )
                db.add(profile)
                print(f"  -> Profile Node Synced for {s['name']}")
        
        # 3. SEED STAFF
        for st in staff_data:
            email_lower = st["email"].lower()
            user = db.query(models.User).filter(models.User.email == email_lower).first()
            if not user:
                user = models.User(
                    email=email_lower,
                    full_name=st["name"],
                    role=st["role"],
                    hashed_password=auth_utils.get_password_hash(st["pass"])
                )
                db.add(user)
                db.flush()
                print(f"Created Staff Identity: {st['name']} ({st['role']})")
            else:
                user.hashed_password = auth_utils.get_password_hash(st["pass"])
                print(f"Updated Staff Token: {st['name']}")

            if st["role"] == models.UserRole.FACULTY:
                staff_prof = db.query(models.Staff).filter(models.Staff.user_id == user.id).first()
                if not staff_prof:
                    staff_prof = models.Staff(
                        user_id=user.id,
                        staff_id=f"STF-26-{user.id}",
                        department=st["dept"],
                        designation="Professor"
                    )
                    db.add(staff_prof)
                    print(f"  -> Faculty Node Synced for {st['name']}")

        db.commit()
        print("\nInstitutional Synchrony Achieved. All authorized tokens are live.")

    except Exception as e:
        db.rollback()
        print(f"Synchronization Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_authorized_identities()
