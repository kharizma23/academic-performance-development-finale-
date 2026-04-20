import sqlite3
import bcrypt

def update_all_students(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get all students with their roll_number for unique email generation
        cursor.execute("""
            SELECT u.id, u.full_name, u.email, s.roll_number 
            FROM users u
            LEFT JOIN students_v2 s ON s.user_id = u.id
            WHERE u.role = 'STUDENT'
        """)
        students = cursor.fetchall()

        if not students:
            # Try without join (old db)
            cursor.execute("SELECT id, full_name, email, NULL FROM users WHERE role = 'STUDENT'")
            students = cursor.fetchall()

        if not students:
            print(f"No students found in {db_path}")
            conn.close()
            return

        print(f"Processing {len(students)} students in {db_path}...")

        # First clear all institutional emails to avoid UNIQUE conflicts
        cursor.execute("UPDATE users SET institutional_email = NULL WHERE role = 'STUDENT'")
        conn.commit()

        updated = 0
        seen_emails = {}
        
        for user_id, full_name, email, roll_number in students:
            first_name = full_name.split(' ')[0] if full_name else "Student"

            # Use roll number suffix for unique email, e.g. pooja.7376cs018@gmail.com
            if roll_number:
                # e.g. roll: 7376264CSE018  -> use last part
                suffix = roll_number.replace("-", "").replace(" ", "").lower()[-6:]
            else:
                suffix = str(updated).zfill(4)

            inst_email = f"{first_name.lower()}.{suffix}@gmail.com"

            # Ensure uniqueness
            base = inst_email
            counter = 1
            while inst_email in seen_emails:
                inst_email = f"{first_name.lower()}.{suffix}{counter}@gmail.com"
                counter += 1
            seen_emails[inst_email] = True

            # Generate plain password: FIRSTNAME@123
            plain_pass = f"{first_name.upper()}@123"

            # Hash using bcrypt directly
            hashed = bcrypt.hashpw(plain_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Update both the login email AND institutional_email and plain_password
            cursor.execute("""
                UPDATE users
                SET email = ?,
                    institutional_email = ?,
                    plain_password = ?,
                    hashed_password = ?,
                    is_active = 1
                WHERE id = ?
            """, (inst_email, inst_email, plain_pass, hashed, user_id))
            updated += 1

            if updated % 200 == 0:
                conn.commit()
                print(f"  -> {updated}/{len(students)} done...")

        conn.commit()
        print(f"Done! Updated {updated} students in {db_path}")
        conn.close()

    except Exception as e:
        print(f"Error in {db_path}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_all_students("student_platform_v2.db")
    update_all_students("student_platform.db")
