import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models, auth
import logging

logging.basicConfig(level=logging.INFO)

def sync_users():
    db = SessionLocal()
    try:
        requested_users = [
            {
                "email": "std.global.2026@aiml.edu",
                "password": "Std@Edu2026",
                "role": models.UserRole.STUDENT,
                "full_name": "Global Student Demo",
                "profile_data": {
                    "roll_number": "737626AIML001",
                    "department": "AIML",
                    "year": 1
                }
            },
            {
                "email": "staff.global.2026@cse.edu",
                "password": "Stf@Edu2026",
                "role": models.UserRole.FACULTY,
                "full_name": "Global Staff Demo",
                "profile_data": {
                    "staff_id": "STF-CSE-GLOBAL",
                    "department": "CSE",
                    "designation": "Professor"
                }
            },
            {
                "email": "adminkhariz@gmail.com",
                "password": "Sudharaajan2302",
                "role": models.UserRole.ADMIN,
                "full_name": "Admin Khariz",
                "profile_data": {}
            }
        ]

        for u_info in requested_users:
            u = db.query(models.User).filter(models.User.email == u_info["email"]).first()
            if not u:
                logging.info(f"Creating user: {u_info['email']}")
                u = models.User(
                    email=u_info["email"],
                    hashed_password=auth.get_password_hash(u_info["password"]),
                    role=u_info["role"],
                    full_name=u_info["full_name"],
                    is_active=True
                )
                db.add(u)
                db.flush()
            else:
                logging.info(f"Updating user: {u_info['email']}")
                u.hashed_password = auth.get_password_hash(u_info["password"])
                u.role = u_info["role"]
                u.full_name = u_info["full_name"]
                u.is_active = True
            
            # Sync profiles
            if u_info["role"] == models.UserRole.STUDENT:
                profile = db.query(models.Student).filter(models.Student.user_id == u.id).first()
                if not profile:
                    profile = models.Student(user_id=u.id, **u_info["profile_data"])
                    db.add(profile)
                else:
                    for key, value in u_info["profile_data"].items():
                        setattr(profile, key, value)
            
            elif u_info["role"] == models.UserRole.FACULTY:
                profile = db.query(models.Staff).filter(models.Staff.user_id == u.id).first()
                if not profile:
                    profile = models.Staff(user_id=u.id, **u_info["profile_data"])
                    db.add(profile)
                else:
                    for key, value in u_info["profile_data"].items():
                        setattr(profile, key, value)

        db.commit()
        logging.info("Users synchronized successfully.")

    except Exception as e:
        db.rollback()
        logging.error(f"Error during synchronization: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    sync_users()
