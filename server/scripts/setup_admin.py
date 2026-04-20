from app import database, models, auth
import sys
import os
sys.path.append(os.getcwd())

def force_admin():
    db = database.SessionLocal()
    email = "adminkhariz@gmail.com"
    pwd = "Sudharaajan2302"
    
    # Check if exists
    u = db.query(models.User).filter(models.User.email == email).first()
    if u:
        print(f"User {email} already exists. Updating password...")
        u.hashed_password = auth.get_password_hash(pwd)
        u.role = models.UserRole.ADMIN
    else:
        print(f"Creating new Admin user: {email}...")
        u = models.User(
            email=email,
            hashed_password=auth.get_password_hash(pwd),
            role=models.UserRole.ADMIN,
            full_name="Admin Khariz"
        )
        db.add(u)
    
    db.commit()
    print(f"Admin Access Granted to {email} successfully!")

if __name__ == "__main__":
    force_admin()
