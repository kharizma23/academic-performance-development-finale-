from app.database import SessionLocal
from app import models

db = SessionLocal()
try:
    print("Surgically nullifying 3rd-year-only institutional nodes...")
    db.query(models.Student).delete()
    print("Neural Students Nullified. Please restart your server to trigger the full quadrant (Year 1-4) synthesis.")
    db.commit()
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
