
import random
import logging
from app.database import SessionLocal
from app import models

logging.basicConfig(level=logging.INFO)

def diversify():
    db = SessionLocal()
    try:
        departments = ["CSE", "IT", "ECE", "EEE", "MECH", "AIML", "DS", "CS", "AIDS", "MT", "BT", "EIE", "BME", "AGRI"]
        logging.info("Starting diversification of student counts per department...")
        
        for dept in departments:
            # Randomly decide how many students to remove to create variance (0 to 40)
            reduction = random.randint(5, 50)
            
            # Get students for this department
            students = db.query(models.Student).filter(models.Student.department == dept).limit(reduction).all()
            
            if students:
                for s in students:
                    # Delete their academic records, AI scores, and user accounts first
                    db.query(models.AcademicRecord).filter(models.AcademicRecord.student_id == s.id).delete()
                    db.query(models.AIScore).filter(models.AIScore.student_id == s.id).delete()
                    db.query(models.Todo).filter(models.Todo.student_id == s.id).delete()
                    db.query(models.StudyPlan).filter(models.StudyPlan.student_id == s.id).delete()
                    
                    user_id = s.user_id
                    db.delete(s)
                    db.flush()
                    db.query(models.User).filter(models.User.id == user_id).delete()
                
                logging.info(f"Reduced {dept} by {len(students)} students.")
        
        db.commit()
        logging.info("Diversification complete. Department strengths are now varied.")
        
    except Exception as e:
        db.rollback()
        logging.error(f"Error during diversification: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    diversify()
