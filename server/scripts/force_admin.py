import sqlite3

db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
new_pass = 'KhArIz@2302'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Try to insert by providing an ID (e.g., 999) to bypass auto-increment issues if any
    cursor.execute("INSERT OR REPLACE INTO users (id, email, institutional_email, plain_password, role, is_active) VALUES (1, ?, ?, ?, 'admin', 1)", (new_email, new_email, new_pass))
    
    conn.commit()
    print(f"🔥 MASTER ADMIN CREATED/UPDATED: {new_email}")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
