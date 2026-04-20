import sqlite3
import os

def get_admin():
    db_path = "student_platform_final.db"
    if not os.path.exists(db_path):
        print(f"File {db_path} not found.")
        return
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # The model uses UserRole enum which usually maps to strings in sqlite
        cursor.execute("SELECT email, role FROM users WHERE role='admin'")
        admins = cursor.fetchall()
        print(f"Admins: {admins}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_admin()
