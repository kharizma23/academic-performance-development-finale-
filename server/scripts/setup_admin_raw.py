import sqlite3
import os
import hashlib
from passlib.context import CryptContext

# Use the same crypt context as auth.py
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def force_admin_raw():
    db_path = "student_platform_v2.db"
    if not os.path.exists(db_path):
        print("Database not found!")
        return
        
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    email = "adminkhariz@gmail.com"
    pwd = "Sudharaajan2302"
    hashed = pwd_context.hash(pwd)
    
    # Check if user exists
    c.execute("SELECT id FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    
    if row:
        print(f"Updating existing user {email}...")
        c.execute("UPDATE users SET hashed_password = ?, role = 'admin' WHERE id = ?", (hashed, row[0]))
    else:
        print(f"Creating new admin user {email}...")
        import uuid
        uid = str(uuid.uuid4())
        c.execute("INSERT INTO users (id, email, hashed_password, role, is_active, full_name) VALUES (?, ?, ?, 'admin', 1, 'Admin Khariz')", 
                  (uid, email, hashed))
        
    conn.commit()
    conn.close()
    print("Admin Sync COMPLETE via Raw SQLite Bridge!")

if __name__ == "__main__":
    force_admin_raw()
