import sqlite3
import os

def check_admin():
    db_path = "student_platform_final.db"
    if not os.path.exists(db_path):
        print(f"File {db_path} not found.")
        return
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # Querying with different potential role names
        cursor.execute("SELECT email, role FROM users")
        all_users = cursor.fetchall()
        print(f"Total Users: {len(all_users)}")
        
        # Filtering in Python for exact case sensitivity
        admins = [u for u in all_users if u[1].lower() == 'admin']
        print(f"Admins: {admins}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_admin()
