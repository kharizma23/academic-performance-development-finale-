
from app import database, models
db = database.SessionLocal()
users = db.query(models.User).all()
print("ID | Email | Role")
for u in users:
    print(f"{u.id} | {u.email} | {u.role}")

students = db.query(models.Student).all()
print("\nStudent Profiles linked:")
for s in students:
    print(f"UID: {s.user_id} | Roll: {s.roll_number}")
db.close()
