import sqlite3
import bcrypt

# Pre-generate ONE hash for "Student@123"
COMMON_PLAIN_PASSWORD = "Student@123"
COMMON_HASH = bcrypt.hashpw(COMMON_PLAIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def update_db(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check table name (students or students_v2)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('students', 'students_v2')")
        table_result = cursor.fetchone()
        if not table_result:
            print(f"No student table found in {db_path}")
            return
        
        student_table = table_result[0]
        print(f"Using table {student_table} in {db_path}")

        # Get all students
        cursor.execute(f"""
            SELECT u.id, u.full_name, s.roll_number 
            FROM users u
            LEFT JOIN {student_table} s ON s.user_id = u.id
            WHERE u.role = 'STUDENT'
        """)
        students = cursor.fetchall()
        
        if not students:
            print(f"No student users found in {db_path}")
            return

        # Clear institutional emails to avoid unique constraint issues
        cursor.execute("UPDATE users SET institutional_email = NULL WHERE role = 'STUDENT'")
        conn.commit()

        seen_emails = set()
        batch = []
        for user_id, full_name, roll_number in students:
            fn = (full_name.split(' ')[0] if full_name else "student").lower()
            suffix = roll_number.replace("-", "").replace(" ", "").lower()[-6:] if roll_number else user_id[:6]
            
            email = f"{fn}.{suffix}@gmail.com"
            while email in seen_emails:
                email = f"{fn}.{suffix}{len(seen_emails)}@gmail.com"
            seen_emails.add(email)
            
            batch.append((email, email, COMMON_PLAIN_PASSWORD, COMMON_HASH, user_id))

        cursor.executemany("""
            UPDATE users 
            SET email = ?, institutional_email = ?, plain_password = ?, hashed_password = ?, is_active = 1 
            WHERE id = ?
        """, batch)
        
        conn.commit()
        print(f"Updated {len(batch)} students in {db_path}")
        conn.close()
    except Exception as e:
        print(f"Error updating {db_path}: {e}")

if __name__ == "__main__":
    update_db("student_platform_v2.db")
    update_db("student_platform.db")
