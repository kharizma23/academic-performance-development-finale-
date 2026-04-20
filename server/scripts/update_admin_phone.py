import sys
import os

# Ensure the app directory is in the path
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import User

db = SessionLocal()
try:
    user = db.query(User).filter(User.institutional_email == 'admin@platform.edu').first()
    if user:
        user.phone_number = '8220495551'
        db.commit()
        print(f"✅ SUCCESSFULLY LINKED PHONE: {user.phone_number} to {user.institutional_email}")
    else:
        print("❌ Admin user not found.")
finally:
    db.close()
