import random
import uuid
from app import models, auth as auth_utils, database

def seed_complete_matrix():
    db = database.SessionLocal()
    try:
        print("Surgically injecting 1000 Institutional Data Nodes into the matrix...")
        
        # 1. Clear existing - Institutional Purge Node
        db.query(models.Student).delete()
        db.query(models.Staff).delete()
        # Using list access to handle potential query filter issues with enums
        db.query(models.User).filter(models.User.role.in_([models.UserRole.STUDENT, models.UserRole.FACULTY])).delete()
        db.commit()

        first_names = [
            "Arun", "Bala", "Chandran", "Divya", "Ezhil", "Fathima", "Ganesh", "Hari", "Indu", "Jeeva",
            "Karthik", "Latha", "Mani", "Nandhini", "Oviya", "Prakash", "Qasim", "Ravi", "Santhosh", "Tamil",
            "Usha", "Varun", "Waseem", "Xavier", "Yazhini", "Zakir", "Adithya", "Bhuvan", "Charu", "Deepak",
            "Gokul", "Inba", "Janani", "Kavin", "Logu", "Meena", "Naveen", "Pavithra", "Ranjith", "Surya",
            "Vidhya", "Yogesh", "Anbarasu", "Bharathi", "Chitra", "Dinesh", "Elango", "Geetha", "Hemant", "Iswarya",
            "Abinaya", "Balaji", "Chendur", "Dhivya", "Elakkia", "Gowtham", "Harini", "Ishwarya", "Jagan", "Kavya",
            "Lavanya", "Murali", "Nithya", "Omprakash", "Prasanna", "Rajeswari", "Sangeetha", "Tharun", "Uma", "Vimal",
            "Ajay", "Baskaran", "Clement", "Damodaran", "Edwin", "Farook", "Gunasekar", "Harshana", "Irfan", "Jasmine"
        ]
        last_names = ["K", "S", "M", "A", "R", "P", "V", "B", "T", "J", "L", "Kumar", "Rajan", "Priya", "Dharshini", "Selvi"]
        
        depts = [
            "AIML", "AGRI", "EEE", "EIE", "ECE", "BT", "BME",
            "CIVIL", "IT", "MECH", "MECHATRONICS", "CSE", "FT", "FD", "AIDS"
        ]
        shared_pwd = auth_utils.get_password_hash("Sudharaajan2302")
        
        assigned_emails = set()

        # 2. Seed Faculty (Staff) - 100 Nodes
        for i in range(100):
            dept = random.choice(depts)
            name = f"Dr. {random.choice(first_names)} {random.choice(last_names)}"
            email = f"faculty_{i+1}@bit.edu.in"
            
            u = models.User(
                email=email, 
                full_name=name, 
                role=models.UserRole.FACULTY, 
                hashed_password=shared_pwd,
                institutional_email=email
            )
            db.add(u); db.flush()
            
            s = models.Staff(
                user_id=u.id,
                staff_id=f"BIT-FAC-{1000+i}",
                department=dept,
                designation=random.choice(["Professor", "Associate Professor", "Assistant Professor"]),
                be_degree="B.E. " + dept,
                me_degree="M.Tech Institutional Lead",
                primary_skill=random.choice(["Neural Networks", "Quantum Computing", "Sustainable Agri", "VLSI Design", "Full Stack Development"]),
                projects_completed=random.randint(5, 20),
                publications_count=random.randint(8, 45),
                consistency_score=round(random.uniform(0.70, 0.99), 2),
                student_feedback_rating=round(random.uniform(4.0, 5.0), 2)
            )
            db.add(s)
            
        # 3. Seed Students - 8700 Nodes (Institutional Saturation)
        print("Scaling Student Intelligence Matrix to 8,700 Nodes...")
        for i in range(8700):
            dept = random.choice(depts)
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            name = f"{fname} {lname}"
            email = f"{fname.lower()}.{lname.lower()}{i}@student.bit.edu.in"
            
            u = models.User(
                email=email, 
                full_name=name, 
                role=models.UserRole.STUDENT, 
                hashed_password=shared_pwd,
                institutional_email=email
            )
            db.add(u); db.flush()
            
            cgpa = round(random.uniform(7.5, 9.9) if i < 3000 else random.uniform(5.5, 8.8), 2)
            risk = "Low" if cgpa > 8.2 else ("Medium" if cgpa > 6.8 else "High")
            year = random.randint(1, 4)
            batch = {1: "25", 2: "24", 3: "23", 4: "22"}.get(year, "23")
            
            notes = [
                 "Excellent aptitude, recommend for Google track.",
                 "Slightly weak in Python basics. Monitoring progress.",
                 "High placement readiness. Consistent performer.",
                 "Critical attendance shortfall detected in Sem 4.",
                 "Showing improvement in communication nodes.",
                 "Potential leadership candidate for IEEE.",
                 "Needs focus on Database Management fundamentals."
            ]
            
            s = models.Student(
                user_id=u.id, 
                roll_number=f"7376{batch}{dept}{i:04d}", 
                department=dept, 
                year=year,
                current_cgpa=cgpa, 
                risk_level=risk, 
                admin_notes=random.choice(notes) if random.random() > 0.4 else None,
                growth_index=round(random.uniform(1.2, 1.95), 2),
                career_readiness_score=round(random.uniform(50, 98), 1),
                academic_dna_score=round(random.uniform(70, 99), 1),
                attendance_percentage=round(random.uniform(75, 99), 1)
            )
            db.add(s)
            
            if (i+1) % 500 == 0:
                print(f"Node Synced: {i+1} / 8700 identities active...")

        db.commit()
        print("--------------------------------------------------")
        print("INSTITUTIONAL CORE SYNCHRONIZED SUCCESSFULLY")
        print("Nodes Active: 900 Students | 100 Faculty | 15 Departments")
        print("--------------------------------------------------")
        
    except Exception as e:
        print(f"Synthesis Latency: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_complete_matrix()
