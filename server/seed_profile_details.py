import sqlite3
import random

db_path = "student_platform_final.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Update Students joining with users to get name
cursor.execute("""
    SELECT s.id, u.full_name 
    FROM students_v2 s
    JOIN users u ON s.user_id = u.id
""")
students = cursor.fetchall()

sections = ['A', 'B', 'C', 'D']
for s_id, s_name in students:
    section = random.choice(sections)
    # Generate random scores
    coding = round(random.uniform(60, 95), 1)
    aptitude = round(random.uniform(55, 92), 1)
    comm = round(random.uniform(70, 98), 1)
    att = round(random.uniform(75, 99), 1)
    
    # Generate parent names based on student name
    name_parts = s_name.split() if s_name else ["Student"]
    first_name = name_parts[0]
    father = f"{first_name}'s Father"
    mother = f"{first_name}'s Mother"
    
    cursor.execute("""
        UPDATE students_v2 SET 
        section = ?, 
        coding_score = ?, 
        aptitude_score = ?, 
        communication_score = ?, 
        attendance_percentage = ?,
        father_name = ?,
        mother_name = ?,
        is_first_login = 0 
        WHERE id = ?
    """, (section, coding, aptitude, comm, att, father, mother, s_id))

conn.commit()
conn.close()
print("Surgical profile data seeding complete.")
