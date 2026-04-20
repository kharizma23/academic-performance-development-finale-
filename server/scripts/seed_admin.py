from app.database import SessionLocal, engine, Base
from app.models import User
import sys
import os

# Ensure tables are created
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    admin = db.query(User).filter(User.institutional_email == 'admin@platform.edu').first()
    if not admin:
        admin = User(
            email='admin@platform.edu',
            institutional_email='admin@platform.edu',
            full_name='Platform Admin',
            role='admin',
            phone_number='8220495551',
            plain_password='admin' # Default password
        )
        db.add(admin)
        db.commit()
        print("✅ SEEDED ADMIN WITH PHONE: 8220495551")
    else:
        admin.phone_number = '8220495551'
        db.commit()
        print("✅ UPDATED ADMIN WITH PHONE: 8220495551")
finally:
    db.close()
