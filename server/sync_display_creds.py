
import random
from app.database import SessionLocal, engine
from app import models, auth as auth_utils
import logging
import time

logging.basicConfig(level=logging.INFO)

def sync_all():
    db = SessionLocal()
    try:
        # Get Manoj specifically first
        target_student_id = "bd7e2ae3-f5db-4aa9-bcf2-0e1c6807e554"
        logging.info(f"Targeting student {target_student_id} first...")
        
        # 1. Join Students and Users to get data efficient
        query = db.query(models.Student, models.User).join(models.User, models.Student.user_id == models.User.id)
        all_data = query.all()
        total = len(all_data)
        logging.info(f"Syncing {total} records...")
        
        processed = 0
        batch_size = 100
        
        for student, user in all_data:
            seed = int(student.id.encode().hex()[:8], 16)
            import random
            random.seed(seed)
            
            name_parts = user.full_name.strip().split()
            first_name = name_parts[0].lower()
            last_initial = name_parts[-1][0].lower() if len(name_parts) > 1 else "x"
            dept_code = student.department.lower()
            batch = {1: "26", 2: "25", 3: "24", 4: "23"}.get(student.year, "23")
            
            roll_suffix = student.roll_number[-3:] if student.roll_number else f"{random.randint(100, 999)}"
            short_dept = dept_code[:2] if len(dept_code) > 2 else dept_code
            
            new_email = f"{first_name}.{last_initial}.{short_dept}{batch}.{roll_suffix}@gmail.com"
            new_plain_password = f"{name_parts[0].upper()}@{roll_suffix}!"
            
            # Sync
            user.email = new_email
            user.institutional_email = new_email
            user.plain_password = new_plain_password
            user.hashed_password = auth_utils.get_password_hash(new_plain_password)
            
            current_year_digit = "4"
            student.roll_number = f"7376{batch}{current_year_digit}{student.department.upper()}{roll_suffix}"
            
            processed += 1
            if processed % batch_size == 0 or student.id == target_student_id:
                db.commit()
                logging.info(f"Progress: {processed}/{total}")
                if student.id == target_student_id:
                    logging.info("Core target synchronized successfully!")
                
        db.commit()
        logging.info("Full sync finalized.")
        
    except Exception as e:
        db.rollback()
        logging.error(f"Sync failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sync_all()
