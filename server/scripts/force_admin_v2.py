import sqlite3

db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
new_pass = 'KhArIz@2302'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check column names first to avoid errors
    cursor.execute("PRAGMA table_info(users)")
    cols = [row[1] for row in cursor.fetchall()]
    
    # Construct the INSERT dynamically
    data = {
        'id': 1,
        'email': new_email,
        'institutional_email': new_email,
        'plain_password': new_pass,
        'role': 'admin',
        'is_active': 1
    }
    
    # Map 'hashed_password' if 'password' column exists
    if 'password' in cols: data['password'] = new_pass
    if 'hashed_password' in cols: data['hashed_password'] = new_pass
    
    placeholders = ', '.join(['?'] * len(data))
    columns = ', '.join(data.keys())
    values = tuple(data.values())
    
    query = f"INSERT OR REPLACE INTO users ({columns}) VALUES ({placeholders})"
    cursor.execute(query, values)
    
    conn.commit()
    print(f"🔥 MASTER ADMIN CREATED/UPDATED: {new_email}")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
