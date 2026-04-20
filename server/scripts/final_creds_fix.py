import sqlite3

db_path = "student_platform.db"

new_email = 'adminkhariz@gmail.com'
new_pass = 'KhArIz@2302'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if user with role 'admin' exists
    cursor.execute("SELECT id FROM users WHERE role = 'admin'")
    admin_row = cursor.fetchone()
    
    if admin_row:
        # Update existing admin
        cursor.execute("UPDATE users SET email = ?, institutional_email = ?, plain_password = ? WHERE id = ?", (new_email, new_email, new_pass, admin_row[0]))
        print(f"🔥 MASTER UPDATED: {new_email} (ID: {admin_row[0]})")
    else:
        # Create it safely by just adding the default one
        print("❌ Admin user not found! Please login normally first or wait.")
    
    conn.commit()
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
