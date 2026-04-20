
from app.database import SessionLocal
from app import models, auth as auth_utils
import logging

logging.basicConfig(level=logging.INFO)

def fix_manoj():
    db = SessionLocal()
    try:
        # TARGET ID from the screenshot URL
        student_id = "bd7e2ae3-f5db-4aa9-bcf2-0e1c6807e554"
        student = db.query(models.Student).filter(models.Student.id == student_id).first()
        if not student:
            logging.error("Manoj NOT found in DB!")
            return
            
        user = db.query(models.User).filter(models.User.id == student.user_id).first()
        if not user:
            logging.error("Manoj USER NOT found in DB!")
            return
        
        # Values from the user's dashboard screenshot
        email = "manoj.b.cs26.011@gmail.com"
        password = "MANOJ@011!"
        hashed = auth_utils.get_password_hash(password)
        
        user.email = email
        user.institutional_email = email
        user.plain_password = password
        user.hashed_password = hashed
        
        db.commit()
        logging.info(f"SUCCESS: Manoj's login {email} is now ACTIVE with password {password}")
        
    except Exception as e:
        db.rollback()
        logging.error(f"Failed to fix Manoj: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_manoj()
