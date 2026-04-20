import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_student_credentials(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all students
        cursor.execute("SELECT id, full_name, email FROM users WHERE role = 'STUDENT'")
        students = cursor.fetchall()
        
        print(f"Processing {len(students)} students in {db_path}...")
        
        for user_id, full_name, email in students:
            # 1. Generate Institutional Email: first_name.cs26@gmail.com (as seen in screenshot)
            # Or just use the existing logic if it exists, but we want to be sure.
            # Usually it's lowercase_name.something
            first_name = full_name.split(' ')[0].lower() if full_name else "student"
            inst_email = f"{first_name}.cs26@gmail.com"
            
            # 2. Generate Plain Password: NAME@123
            plain_pass = f"{full_name.split(' ')[0].upper()}@123" if full_name else "STUDENT@123"
            
            # 3. Generate Hashed Password
            # Use current bcrypt hash for "Sudharaajan2302" if that's what was requested earlier, 
            # OR the new plain_pass. Let's use the new plain_pass to match the UI!
            hashed_pass = pwd_context.hash(plain_pass)
            
            # 4. Update the user record
            cursor.execute("""
                UPDATE users 
                SET institutional_email = ?, plain_password = ?, hashed_password = ?, is_active = 1 
                WHERE id = ?
            """, (inst_email, plain_pass, hashed_pass, user_id))
            
        conn.commit()
        print(f"Successfully updated {db_path}")
        conn.close()
    except Exception as e:
        print(f"Error updating {db_path}: {e}")

if __name__ == "__main__":
    update_student_credentials("student_platform_v2.db")
    update_student_credentials("student_platform.db")
