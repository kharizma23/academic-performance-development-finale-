
from app.database import SessionLocal
from app import models

db = SessionLocal()
students = db.query(models.Student).limit(50).all()
for s in students:
    print(f"ID: {s.id} | NAME: {s.user.full_name if s.user else 'NO_USER'}")
db.close()
