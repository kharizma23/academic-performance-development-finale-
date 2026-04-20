import sys
import os
import sqlite3

# Direct SQLite connection to avoid SQLAlchemy schema mismatch
db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
new_pass = 'KhArIz@2302'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if table has institutional_email or email
    cursor.execute("PRAGMA table_info(users)")
    cols = [row[1] for row in cursor.fetchall()]
    
    set_clauses = [
        "email = ?",
        "institutional_email = ?",
        "plain_password = ?"
    ]
    vals = [new_email, new_email, new_pass]
    
    # Check for 'password' column (for hashed pass)
    if 'password' in cols:
        set_clauses.append("password = ?")
        # We use plain for now since we don't know the exact hash method used by previous dev
        vals.append(new_pass) 
    
    query = f"UPDATE users SET {', '.join(set_clauses)} WHERE role = 'admin'"
    cursor.execute(query, vals)
    
    if cursor.rowcount == 0:
        # Create it if it doesn't exist
        cursor.execute("INSERT INTO users (email, institutional_email, plain_password, role, is_active) VALUES (?, ?, ?, 'admin', 1)", (new_email, new_email, new_pass))
    
    conn.commit()
    print(f"🔥 MASTER CREDENTIALS UPDATED: {new_email}")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
