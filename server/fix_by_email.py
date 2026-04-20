
from app.database import SessionLocal
from app import models, auth as auth_utils
import logging

logging.basicConfig(level=logging.INFO)

def fix_by_email():
    db = SessionLocal()
    try:
        email = "manoj.b.cs26.011@gmail.com"
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            logging.error(f"User with email {email} NOT found!")
            # Try institutional email
            user = db.query(models.User).filter(models.User.institutional_email == email).first()
            if not user:
                logging.error(f"User with institutional_email {email} NOT found!")
                return
        
        password = "MANOJ@011!"
        user.plain_password = password
        user.hashed_password = auth_utils.get_password_hash(password)
        db.commit()
        logging.info(f"SUCCESS: {user.full_name} is now login READY!")
        logging.info(f"Login: {email}, Pass: {password}")
    except Exception as e:
        db.rollback()
        logging.error(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_by_email()
