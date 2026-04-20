import sqlite3
import os

db_path = "student_platform_final.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(students_v2)")
    columns = cursor.fetchall()
    print("Columns in students_v2:")
    for col in columns:
        print(col[1])
    conn.close()
else:
    print(f"File {db_path} not found.")
