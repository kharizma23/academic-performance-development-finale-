import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def reset_admin():
    email = "adminkhariz@gmail.com"
    pwd = "Sudharaajan2302"
    hashed = pwd_context.hash(pwd)
    
    for db_name in ["student_platform_v2.db", "student_platform.db"]:
        try:
            conn = sqlite3.connect(db_name)
            c = conn.cursor()
            c.execute("UPDATE users SET hashed_password = ?, is_active = 1 WHERE email = ?", (hashed, email))
            if c.rowcount == 0:
                # If admin row doesn't exist, create it
                c.execute("INSERT INTO users (id, email, hashed_password, role, full_name, is_active) VALUES (?, ?, ?, ?, ?, ?)",
                          ("admin-id-123", email, hashed, "ADMIN", "Admin Khariz", 1))
            conn.commit()
            print(f"Admin reset successful in {db_name}")
            conn.close()
        except Exception as e:
            print(f"Error in {db_name}: {e}")

if __name__ == "__main__":
    reset_admin()
