import sys
import os

# Ensure we can import app modules
sys.path.append(os.getcwd())

from app.auth import get_password_hash
import sqlite3

db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
alt_email = 'kharizadmin@gmail.com'
new_pass = 'KhArIz@2302'
hashed_pass = get_password_hash(new_pass)

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Update both primary and alternate email to ensure success
    for email in [new_email, alt_email]:
        cursor.execute("INSERT OR REPLACE INTO users (id, email, institutional_email, hashed_password, plain_password, role, is_active) VALUES (1, ?, ?, ?, ?, 'admin', 1)", (email, email, hashed_pass, new_pass))
    
    conn.commit()
    print(f"🔥 MASTER ADMIN RE-SYNCED WITH HASHED CRYPTO")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
