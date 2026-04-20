import sqlite3
import os

db_path = "student_platform_final.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column(table, column, type_):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type_}")
        print(f"Added {column} to {table}")
    except sqlite3.OperationalError:
        print(f"Column {column} already exists in {table}")

# User updates
add_column("users", "avatar_url", "TEXT")

# Student updates
add_column("students_v2", "section", "TEXT")
add_column("students_v2", "father_name", "TEXT")
add_column("students_v2", "mother_name", "TEXT")
add_column("students_v2", "alternate_email", "TEXT")
add_column("students_v2", "coding_score", "REAL DEFAULT 0.0")
add_column("students_v2", "aptitude_score", "REAL DEFAULT 0.0")
add_column("students_v2", "communication_score", "REAL DEFAULT 0.0")
add_column("students_v2", "attendance_percentage", "REAL DEFAULT 0.0")
add_column("students_v2", "resume_url", "TEXT")
add_column("students_v2", "certificates", "TEXT")
add_column("students_v2", "notifications_test", "BOOLEAN DEFAULT 1")
add_column("students_v2", "notifications_placement", "BOOLEAN DEFAULT 1")
add_column("students_v2", "notifications_ai", "BOOLEAN DEFAULT 1")
add_column("students_v2", "last_login", "TIMESTAMP")
add_column("students_v2", "login_device", "TEXT")
add_column("students_v2", "is_first_login", "BOOLEAN DEFAULT 1")

conn.commit()
conn.close()
print("Surgical schema alignment complete.")
