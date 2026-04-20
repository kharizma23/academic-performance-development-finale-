import sqlite3

db_path = "student_platform_final.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

female_indicators = ["a", "i", "ee", "mi", "ya", "ni", "ra", "ka", "ha", "ly", "dy"]

# Get all students
cursor.execute("""
    SELECT s.id, u.full_name 
    FROM students_v2 s
    JOIN users u ON s.user_id = u.id
""")
students = cursor.fetchall()

print(f"Synchronizing gender nodes for {len(students)} records...")

for i, (s_id, s_name) in enumerate(students):
    first_name = s_name.split()[0].lower() if s_name else ""
    
    gender = "Male"
    # Basic heuristic for Indian names
    if any(first_name.endswith(ind) for ind in female_indicators):
        gender = "Female"
    
    # Exceptions/Overrides
    if first_name in ["anitha", "banu", "chitra", "divya", "eswari", "farida", "ganga", "hema", "indira", "jaya", "kala", "latha", "mala", "nila", "oviya", "priya", "radhika", "sudha", "tamil", "uma", "vani", "yamini", "zoya", "meena", "shanthi"]:
        gender = "Female"
    
    cursor.execute("UPDATE students_v2 SET gender = ? WHERE id = ?", (gender, s_id))
    
    if (i + 1) % 1000 == 0:
        print(f"Synchronized {i + 1} gender nodes...")

conn.commit()
conn.close()
print("Surgical gender categorization complete.")
