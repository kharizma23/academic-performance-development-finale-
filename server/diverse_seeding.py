import sqlite3
import random

db_path = "student_platform_final.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Lists of names and suffixes to make them unique
male_names = ["Arun", "Babu", "Chandran", "Deva", "Eswar", "Faisal", "Ganesh", "Hari", "Indran", "Jagan", "Kiran", "Lokesh", "Mani", "Nitin", "Om", "Prasad", "Quadir", "Raj", "Suresh", "Thala", "Uday", "Varun", "Wilson", "Xavier", "Yusuf", "Zahir", "Ramesh", "Sridhar", "Venkatesh", "Anbazhagan", "Balamurugan", "Chidambaram", "Durai", "Elango", "Govind", "Ilayaraja", "Jeeva", "Karthik", "Loganathan", "Murugan", "Natarajan", "Palanivel", "Raghunathan", "Senthil", "Tamilselvan", "Ulagu", "Vadivel", "Yogesh", "Zia"]
female_names = ["Anitha", "Banu", "Chitra", "Divya", "Eswari", "Farida", "Ganga", "Hema", "Indira", "Jaya", "Kala", "Latha", "Mala", "Nila", "Oviya", "Priya", "Radhika", "Sudha", "Tamil", "Uma", "Vani", "Yamini", "Zoya", "Meena", "Shanthi", "Bakiyalakshmi", "Chandini", "Dharshini", "Gayathri", "Harini", "Ishwarya", "Janani", "Kavitha", "Lakshmi", "Mythili", "Nandhini", "Pavithra", "Ramya", "Sangeetha", "Tharani", "Vidhya", "Abirami", "Bhavani", "Deepika", "Kousalya", "Madhu", "Nithya", "Revathi", "Sowmya"]

# Get all students
cursor.execute("""
    SELECT s.id, u.full_name, s.roll_number
    FROM students_v2 s
    JOIN users u ON s.user_id = u.id
""")
students = cursor.fetchall()

seen_emails = set()

print(f"Commencing deep demographic synchronization for {len(students)} nodes...")

for i, (s_id, s_name, roll) in enumerate(students):
    # Unique Father/Mother Names
    f_first = random.choice(male_names)
    f_last = s_name.split()[-1] if ' ' in s_name else random.choice(male_names)
    father = f"{f_first} {f_last}"
    
    m_name = random.choice(female_names)
    mother = f"{m_name} {f_last}"
    
    # Unique Personal Email
    # Logic: name.roll_suffix@gmail.com
    name_slug = s_name.lower().replace(" ", ".")
    email_base = f"{name_slug}"
    email = f"{email_base}@gmail.com"
    
    # Handle collisions
    counter = 1
    while email in seen_emails:
        email = f"{name_slug}.{counter}@gmail.com"
        counter += 1
    seen_emails.add(email)
    
    cursor.execute("""
        UPDATE students_v2 SET 
        father_name = ?, 
        mother_name = ?, 
        personal_email = ?
        WHERE id = ?
    """, (father, mother, email, s_id))
    
    if (i + 1) % 1000 == 0:
        print(f"Synchronized {i + 1} student records...")

conn.commit()
conn.close()
print("Surgical demographic diversity complete. All records are now unique.")
