
from app.database import SessionLocal
from app import models, auth as auth_utils
import logging

logging.basicConfig(level=logging.INFO)

def set_first_student_as_manoj():
    db = SessionLocal()
    try:
        student = db.query(models.Student).first()
        if not student:
            logging.error("No students found!")
            return
            
        user = student.user
        if not user:
            logging.error("No user found for first student!")
            return
            
        # These are the ones the user expects!
        email = "manoj.b.cs26.011@gmail.com"
        password = "MANOJ@011!"
        
        user.full_name = "Manoj Bhat"
        user.email = email
        user.institutional_email = email
        user.plain_password = password
        user.hashed_password = auth_utils.get_password_hash(password)
        
        db.commit()
        logging.info(f"SUCCESS: {user.full_name} is now the primary test login.")
        logging.info(f"Email: {email}, Password: {password}")

    except Exception as e:
        db.rollback()
        logging.error(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    set_first_student_as_manoj()
