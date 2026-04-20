import sys
import os
from sqlalchemy.orm import Session

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import models, auth as auth_utils, database

def sync_requested_users():
    db = database.SessionLocal()
    try:
        users_to_add = [
            {
                "full_name": "Gita Sinha",
                "email": "std.gita.sinha730@aiml.edu",
                "password": "Git@1234",
                "role": models.UserRole.STUDENT,
                "dept": "AIML",
                "year": 1
            },
            {
                "full_name": "Anita Kulkarni",
                "email": "std.anita.kulkarni@ece.edu",
                "password": "Ani@1234",
                "role": models.UserRole.STUDENT,
                "dept": "ECE",
                "year": 1
            },
            {
                "full_name": "Saurav J",
                "email": "saurav.j.ai26.009@gmail.com",
                "password": "Sau@Edu2026",
                "role": models.UserRole.STUDENT,
                "dept": "AI",
                "year": 1
            },
            {
                "full_name": "Nitin Deshmukh",
                "email": "std.nitin.deshmukh.4838403@civil.edu",
                "password": "Nit@Edu2026",
                "role": models.UserRole.STUDENT,
                "dept": "CIVIL",
                "year": 2
            },
            {
                "full_name": "Priyanka Singh",
                "email": "priyanka.s.cse26.004@gmail.com",
                "password": "Pri@Edu2026",
                "role": models.UserRole.STUDENT,
                "dept": "CSE",
                "year": 1
            },
            # Additional requested accounts
            {
                "full_name": "Global Student",
                "email": "std.global.2026@aiml.edu",
                "password": "Std@Edu2026",
                "role": models.UserRole.STUDENT,
                "dept": "AIML",
                "year": 3
            },
            {
                "full_name": "Global Staff",
                "email": "staff.global.2026@cse.edu",
                "password": "Stf@Edu2026",
                "role": models.UserRole.FACULTY,
                "dept": "CSE",
                "designation": "Associate Professor"
            }
        ]

        for user_data in users_to_add:
            print(f"Processing {user_data['full_name']} ({user_data['email']})...")
            
            # Check if user exists by either email or institutional email
            user = db.query(models.User).filter(
                (models.User.email == user_data['email']) | 
                (models.User.institutional_email == user_data['email'])
            ).first()
            if not user:
                user = models.User(
                    email=user_data['email'],
                    full_name=user_data['full_name'],
                    institutional_email=user_data['email'],
                    hashed_password=auth_utils.get_password_hash(user_data['password']),
                    plain_password=user_data['password'],
                    role=user_data['role'],
                    is_active=True
                )
                db.add(user)
                db.flush()
                print(f"Created User: {user_data['full_name']}")
            else:
                user.hashed_password = auth_utils.get_password_hash(user_data['password'])
                user.plain_password = user_data['password']
                user.role = user_data['role']
                print(f"Updated User: {user_data['full_name']}")

            if user_data['role'] == models.UserRole.STUDENT:
                student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
                if not student:
                    student = models.Student(
                        user_id=user.id,
                        department=user_data['dept'],
                        year=user_data['year'],
                        roll_number=f"REQ{user_data['dept']}{user.id[:4]}",
                        current_cgpa=8.5,
                        risk_level="Low"
                    )
                    db.add(student)
                    print(f"Created Student Profile for {user_data['full_name']}")
                else:
                    student.department = user_data['dept']
                    student.year = user_data['year']
                    print(f"Updated Student Profile for {user_data['full_name']}")
            
            elif user_data['role'] == models.UserRole.FACULTY:
                staff = db.query(models.Staff).filter(models.Staff.user_id == user.id).first()
                if not staff:
                    staff = models.Staff(
                        user_id=user.id,
                        department=user_data['dept'],
                        designation=user_data.get('designation', 'Professor'),
                        staff_id=f"STF{user_data['dept']}{user.id[:4]}"
                    )
                    db.add(staff)
                    print(f"Created Staff Profile for {user_data['full_name']}")
                else:
                    staff.department = user_data['dept']
                    staff.designation = user_data.get('designation', 'Professor')
                    print(f"Updated Staff Profile for {user_data['full_name']}")

        db.commit()
        print("Successfully synced all requested users.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sync_requested_users()
