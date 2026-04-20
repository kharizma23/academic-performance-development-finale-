from app import database, models
from sqlalchemy import text
import logging

def apply_indexes():
    engine = database.engine
    with engine.connect() as conn:
        print("Applying optimizations to performance layer...")
        # Academic Records Indexes
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_academic_records_student_id ON academic_records (student_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_academic_records_subject ON academic_records (subject)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_academic_records_semester ON academic_records (semester)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_academic_records_grade ON academic_records (grade)"))
        
        # Students Indexes
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_students_v2_user_id ON students_v2 (user_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_students_v2_department ON students_v2 (department)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_students_v2_year ON students_v2 (year)"))
        
        # Staff Indexes
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_staff_v2_user_id ON staff_v2 (user_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_staff_v2_department ON staff_v2 (department)"))
        
        conn.commit()
        print("Indexes successfully deployed!")

if __name__ == "__main__":
    apply_indexes()
