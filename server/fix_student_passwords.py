import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_passwords(db_name):
    try:
        conn = sqlite3.connect(db_name)
        c = conn.cursor()
        hashed = pwd_context.hash("Sudharaajan2302")
        c.execute('UPDATE users SET hashed_password = ? WHERE role = "STUDENT"', (hashed,))
        print(f"Updated {c.rowcount} students in {db_name}")
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error updating {db_name}: {e}")

update_passwords("student_platform_v2.db")
update_passwords("student_platform.db")
