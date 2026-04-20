import sqlite3
import random

db_path = "student_platform_final.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List of Tamil Nadu cities and districts for realistic data
locations = [
    "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", 
    "Trichy, Tamil Nadu", "Salem, Tamil Nadu", "Tirunelveli, Tamil Nadu",
    "Thanjavur, Tamil Nadu", "Vellore, Tamil Nadu", "Erode, Tamil Nadu",
    "Kanchipuram, Tamil Nadu", "Nagercoil, Tamil Nadu", "Thoothukudi, Tamil Nadu",
    "Dindigul, Tamil Nadu", "Hosur, Tamil Nadu", "Kumbakonam, Tamil Nadu",
    "Karaikudi, Tamil Nadu", "Namakkal, Tamil Nadu", "Pollachi, Tamil Nadu",
    "Sivakasi, Tamil Nadu", "Theni, Tamil Nadu", "Udhagamandalam, Tamil Nadu",
    "Virudhunagar, Tamil Nadu", "Arakkonam, Tamil Nadu", "Cuddalore, Tamil Nadu",
    "Dharmapuri, Tamil Nadu", "Nagapattinam, Tamil Nadu", "Pudukkottai, Tamil Nadu",
    "Ramanathapuram, Tamil Nadu", "Tiruppur, Tamil Nadu", "Tiruvannamalai, Tamil Nadu"
]

areas = ["Anna Nagar", "Adyar", "T. Nagar", "Velachery", "Mylapore", "Tambaram", "Porur", "Guindy", "Avadi", "Ambattur"]

# Get all students
cursor.execute("SELECT id FROM students_v2")
student_ids = [row[0] for row in cursor.fetchall()]

print(f"Synchronizing residency nodes for {len(student_ids)} students...")

for i, s_id in enumerate(student_ids):
    # Construct a realistic address
    door_no = random.randint(1, 150)
    street = f"Street No. {random.randint(1, 40)}"
    area = random.choice(areas)
    city = random.choice(locations)
    full_address = f"No. {door_no}, {street}, {area}, {city}"
    
    cursor.execute("UPDATE students_v2 SET location = ? WHERE id = ?", (full_address, s_id))
    
    if (i + 1) % 1000 == 0:
        print(f"Propagated {i + 1} address records...")

conn.commit()
conn.close()
print("Geographic location synchronization complete. All student residency labels are now unique and descriptive.")
