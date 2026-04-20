from sqlalchemy import create_engine, text
engine = create_engine("sqlite:///server/student_platform_final.db")
with engine.connect() as conn:
    # Check users
    try:
        users = conn.execute(text("SELECT id, email, role FROM users LIMIT 5")).fetchall()
        print("USERS:", users)
    except Exception as e:
        print("Users table error:", e)

    # Check students
    try:
        students = conn.execute(text("SELECT id, user_id, roll_number FROM students_v2 LIMIT 5")).fetchall()
        print("STUDENTS:", students)
    except Exception as e:
        print("Students table error:", e)
