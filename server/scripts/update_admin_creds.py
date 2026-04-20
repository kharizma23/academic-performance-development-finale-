from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash # Assuming this exists based on common patterns
import sys
import os

# Ensure we can import app
sys.path.append(os.getcwd())

db = SessionLocal()
try:
    # Find existing admin or create a new one
    admin = db.query(User).filter(User.role == 'admin').first()
    
    new_email = 'adminkhariz@gmail.com'
    new_pass = 'KhArIz@2302'
    
    # Try to hash if the function is available, otherwise just use plain
    hashed_pass = new_pass
    try:
        from app.auth import pwd_context
        hashed_pass = pwd_context.hash(new_pass)
    except:
        pass

    if admin:
        admin.email = new_email
        admin.institutional_email = new_email
        admin.password = hashed_pass
        admin.plain_password = new_pass
        db.commit()
        print(f"✅ UPDATED ADMIN CREDENTIALS: {new_email}")
    else:
        # Create new admin
        admin = User(
            email=new_email,
            institutional_email=new_email,
            full_name='Master Admin',
            role='admin',
            password=hashed_pass,
            plain_password=new_pass,
            is_active=True
        )
        db.add(admin)
        db.commit()
        print(f"✅ CREATED NEW ADMIN: {new_email}")
finally:
    db.close()
