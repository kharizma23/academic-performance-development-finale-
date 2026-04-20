from app.database import SessionLocal
from app import models
db = SessionLocal()
count = db.query(models.Student).count()
print(f"Total students: {count}")
db.close()
