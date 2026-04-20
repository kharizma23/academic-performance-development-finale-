import sqlite3
import urllib.parse
import os
import sys

# Ensure we can import app modules
sys.path.append(os.getcwd())

from app.auth import get_password_hash

db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
alt_email = 'kharizadmin@gmail.com'
new_pass = 'Sudharaajan2302'
hashed_pass = get_password_hash(new_pass)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Update both primary and alternate email to ensure success
    for email in [new_email, alt_email]:
        cursor.execute("INSERT OR REPLACE INTO users (id, email, institutional_email, hashed_password, plain_password, role, is_active) VALUES (?, ?, ?, ?, ?, 'ADMIN', 1)", 
                       (email, email, email, hashed_pass, new_pass))
    
    # Also fix ALL existing users to use UPPERCASE roles to prevent LookupError
    cursor.execute("UPDATE users SET role = 'ADMIN' WHERE role = 'admin'")
    cursor.execute("UPDATE users SET role = 'STUDENT' WHERE role = 'student'")
    cursor.execute("UPDATE users SET role = 'FACULTY' WHERE role = 'faculty'")
    
    conn.commit()
    print(f"🔥 MASTER ADMIN RE-SYNCED WITH UPPERCASE ROLES AND PASSWORD")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
