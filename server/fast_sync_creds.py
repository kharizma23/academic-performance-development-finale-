import sqlite3
import bcrypt

# Pre-generate ONE hash for "Student@123" — much faster than hashing each student
COMMON_PLAIN_PASSWORD = "Student@123"
COMMON_HASH = bcrypt.hashpw(COMMON_PLAIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(f"Using common password: {COMMON_PLAIN_PASSWORD}")
print(f"Hash generated. Updating databases...")

def update_all_students(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get all students with roll number
        cursor.execute("""
            SELECT u.id, u.full_name, s.roll_number 
            FROM users u
            LEFT JOIN students_v2 s ON s.user_id = u.id
            WHERE u.role = 'STUDENT'
        """)
        students = cursor.fetchall()

        if not students:
            print(f"No students found in {db_path}")
            conn.close()
            return

        print(f"Processing {len(students)} students in {db_path}...")

        # Clear all institutional emails first to avoid UNIQUE conflict
        cursor.execute("UPDATE users SET institutional_email = NULL WHERE role = 'STUDENT'")
        conn.commit()

        seen_emails = set()
        batch = []

        for user_id, full_name, roll_number in students:
            first_name = (full_name.split(' ')[0] if full_name else "student").lower()

            # Use roll_number suffix for unique email
            if roll_number:
                suffix = roll_number.replace("-", "").replace(" ", "").lower()[-6:]
            else:
                suffix = user_id[:6]

            inst_email = f"{first_name}.{suffix}@gmail.com"

            # Deduplicate
            original = inst_email
            ctr = 1
            while inst_email in seen_emails:
                inst_email = f"{first_name}.{suffix}{ctr}@gmail.com"
                ctr += 1
            seen_emails.add(inst_email)

            batch.append((inst_email, inst_email, COMMON_PLAIN_PASSWORD, COMMON_HASH, user_id))

        # Bulk update in one transaction
        cursor.executemany("""
            UPDATE users
            SET email = ?,
                institutional_email = ?,
                plain_password = ?,
                hashed_password = ?,
                is_active = 1
            WHERE id = ?
        """, batch)

        conn.commit()
        print(f"Done! Updated {len(batch)} students in {db_path}")
        conn.close()

    except Exception as e:
        print(f"Error in {db_path}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_all_students("student_platform_v2.db")
    update_all_students("student_platform.db")
