
from app.database import SessionLocal
from app import models, auth as auth_utils
import logging

logging.basicConfig(level=logging.INFO)

def fix_manoj_by_name():
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.full_name.ilike("%Manoj Bhat%")).first()
        if not user:
            logging.error("No Manoj user found!")
            return
            
        student = db.query(models.Student).filter(models.Student.user_id == user.id).first()
        if not student:
            logging.error("No Manoj student profile found!")
            return
            
        # These are the ones shown in the user's dashboard!
        # The user was trying: manoj.b.cs26.011@gmail.com
        email = "manoj.b.cs26.011@gmail.com"
        password = "MANOJ@011!"
        
        user.email = email
        user.institutional_email = email
        user.plain_password = password
        user.hashed_password = auth_utils.get_password_hash(password)
        
        db.commit()
        logging.info(f"SUCCESS: {user.full_name} ({user.id}) now has login {email} / {password}")

    except Exception as e:
        db.rollback()
        logging.error(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_manoj_by_name()
