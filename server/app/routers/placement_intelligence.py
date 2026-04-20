from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models
from typing import List, Optional
import random

router = APIRouter(
    prefix="/api/placement",
    tags=["placement-intelligence"]
)

def get_static_companies():
    return [
        # PRODUCT BASED - BIG TECH
        {"name": "Google", "min_cgpa": 8.5, "min_readiness": 9.2, "average_package": 3200000, "eligible_students": 12, "required_skills": ["DSA", "System Design", "Algorithims"], "category": "Product Based", "preferred_departments": ["CSE", "IT", "AIML", "AIDS"]},
        {"name": "Microsoft", "min_cgpa": 8.0, "min_readiness": 8.8, "average_package": 2800000, "eligible_students": 18, "required_skills": ["C#", "Azure", "Problem Solving"], "category": "Product Based", "preferred_departments": ["CSE", "IT", "ECE"]},
        {"name": "Amazon", "min_cgpa": 7.5, "min_readiness": 8.5, "average_package": 2500000, "eligible_students": 45, "required_skills": ["Java", "Distributed Systems", "SQL"], "category": "Product Based", "preferred_departments": ["CSE", "IT", "ECE", "MECH"]},
        {"name": "Adobe", "min_cgpa": 8.0, "min_readiness": 8.5, "average_package": 2200000, "eligible_students": 30, "required_skills": ["C++", "Graphics", "OS"], "category": "Product Based", "preferred_departments": ["CSE", "IT"]},
        {"name": "Apple", "min_cgpa": 8.8, "min_readiness": 9.5, "average_package": 3500000, "eligible_students": 8, "required_skills": ["Swift", "Kernel", "Hardware"], "category": "Product Based", "preferred_departments": ["CSE", "ECE", "EIE"]},
        {"name": "Meta", "min_cgpa": 8.5, "min_readiness": 9.2, "average_package": 3000000, "eligible_students": 15, "required_skills": ["React", "PHP", "Scalability"], "category": "Product Based", "preferred_departments": ["CSE", "IT"]},
        {"name": "Netflix", "min_cgpa": 8.5, "min_readiness": 9.2, "average_package": 3800000, "eligible_students": 5, "required_skills": ["Java", "Video Streaming", "Cloud"], "category": "Product Based", "preferred_departments": ["CSE", "IT"]},
        {"name": "NVIDIA", "min_cgpa": 8.5, "min_readiness": 9.2, "average_package": 2800000, "eligible_students": 25, "required_skills": ["CUDA", "C++", "AI Architecture"], "category": "Product Based", "preferred_departments": ["CSE", "ECE", "AIML"]},
        {"name": "Salesforce", "min_cgpa": 7.5, "min_readiness": 8.2, "average_package": 1800000, "eligible_students": 50, "required_skills": ["Apex", "Cloud", "Business Logic"], "category": "Product Based", "preferred_departments": ["CSE", "IT"]},
        {"name": "Oracle", "min_cgpa": 7.5, "min_readiness": 8.0, "average_package": 1600000, "eligible_students": 85, "required_skills": ["Database", "Java", "ERP"], "category": "Product Based", "preferred_departments": ["CSE", "IT", "ECE"]},

        # CORE / ELECTRONICS / AUTOMOTIVE
        {"name": "L&T", "min_cgpa": 7.0, "min_readiness": 7.5, "average_package": 850000, "eligible_students": 120, "required_skills": ["Civil", "Design", "Project Mgmt"], "category": "Core / Electronics", "preferred_departments": ["CIVIL", "MECH", "EEE"]},
        {"name": "Tata Motors", "min_cgpa": 7.2, "min_readiness": 7.8, "average_package": 950000, "eligible_students": 85, "required_skills": ["Mechanical", "EV Tech", "Manufacturing"], "category": "Core / Electronics", "preferred_departments": ["MECH", "EEE", "EIE"]},
        {"name": "Ashok Leyland", "min_cgpa": 6.8, "min_readiness": 7.0, "average_package": 720000, "eligible_students": 110, "required_skills": ["Automotive", "CAD", "Quality Control"], "category": "Core / Electronics", "preferred_departments": ["MECH", "EEE"]},
        {"name": "Bosch", "min_cgpa": 7.5, "min_readiness": 8.0, "average_package": 1200000, "eligible_students": 75, "required_skills": ["Embedded", "IoT", "Sensors"], "category": "Core / Electronics", "preferred_departments": ["ECE", "EIE", "EEE"]},
        {"name": "Siemens", "min_cgpa": 7.5, "min_readiness": 8.0, "average_package": 1150000, "eligible_students": 60, "required_skills": ["Automation", "PLC", "Hardware Design"], "category": "Core / Electronics", "preferred_departments": ["EEE", "EIE", "MECH"]},
        {"name": "Honeywell", "min_cgpa": 7.0, "min_readiness": 7.5, "average_package": 900000, "eligible_students": 95, "required_skills": ["Control Systems", "Testing", "Python"], "category": "Core / Electronics", "preferred_departments": ["EIE", "ECE", "EEE"]},
        {"name": "GE", "min_cgpa": 7.2, "min_readiness": 7.8, "average_package": 1050000, "eligible_students": 55, "required_skills": ["Renewables", "Data", "Power Systems"], "category": "Core / Electronics", "preferred_departments": ["EEE", "MECH"]},
        {"name": "ABB", "min_cgpa": 7.0, "min_readiness": 7.5, "average_package": 880000, "eligible_students": 70, "required_skills": ["Robotics", "Drives", "Electrical"], "category": "Core / Electronics", "preferred_departments": ["EEE", "MECH", "EIE"]},
        {"name": "Schneider Electric", "min_cgpa": 7.0, "min_readiness": 7.2, "average_package": 820000, "eligible_students": 130, "required_skills": ["Industrial", "EcoStruxure", "Energy"], "category": "Core / Electronics", "preferred_departments": ["EEE", "EIE"]},
        {"name": "Bharat Electronics", "min_cgpa": 8.0, "min_readiness": 8.5, "average_package": 1400000, "eligible_students": 40, "required_skills": ["VLSI", "Radar", "Govt Specs"], "category": "Core / Electronics", "preferred_departments": ["ECE", "EIE"]},

        # STARTUPS / UNICORNS
        {"name": "Zoho", "min_cgpa": 6.0, "min_readiness": 8.5, "average_package": 1000000, "eligible_students": 250, "required_skills": ["Problem Solving", "Java", "Productivity"], "category": "Unicorns", "preferred_departments": ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AIML", "AIDS"]},
        {"name": "Freshworks", "min_cgpa": 7.5, "min_readiness": 8.0, "average_package": 1400000, "eligible_students": 140, "required_skills": ["SaaS", "Fullstack", "Elasticsearch"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "Swiggy", "min_cgpa": 7.0, "min_readiness": 8.2, "average_package": 2200000, "eligible_students": 35, "required_skills": ["Go", "Kafka", "Data Science"], "category": "Unicorns", "preferred_departments": ["CSE", "IT", "AIML"]},
        {"name": "Zomato", "min_cgpa": 7.0, "min_readiness": 8.2, "average_package": 2000000, "eligible_students": 42, "required_skills": ["Node.js", "Redis", "Frontend"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "Razorpay", "min_cgpa": 8.0, "min_readiness": 8.8, "average_package": 2400000, "eligible_students": 28, "required_skills": ["Payments", "Security", "Backend"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "Paytm", "min_cgpa": 6.5, "min_readiness": 7.5, "average_package": 1200000, "eligible_students": 180, "required_skills": ["Java", "Android", "Fintech"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "PhonePe", "min_cgpa": 7.5, "min_readiness": 8.5, "average_package": 2600000, "eligible_students": 22, "required_skills": ["JVM", "Scale", "Architecture"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "CRED", "min_cgpa": 8.2, "min_readiness": 9.0, "average_package": 2800000, "eligible_students": 15, "required_skills": ["Design", "Backend", "Marketing"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},
        {"name": "Meesho", "min_cgpa": 7.0, "min_readiness": 8.0, "average_package": 1800000, "eligible_students": 60, "required_skills": ["Ecommerce", "Python", "ML"], "category": "Unicorns", "preferred_departments": ["CSE", "IT", "AIML"]},
        {"name": "Flipkart", "min_cgpa": 7.5, "min_readiness": 8.5, "average_package": 2400000, "eligible_students": 90, "required_skills": ["Supply Chain", "Java", "Big Data"], "category": "Unicorns", "preferred_departments": ["CSE", "IT"]},

        # SERVICE BASED
        {"name": "TCS", "min_cgpa": 6.5, "min_readiness": 6.0, "average_package": 450000, "eligible_students": 572, "required_skills": ["Fundamentals", "Communication", "Logic"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"]},
        {"name": "Infosys", "min_cgpa": 6.5, "min_readiness": 6.0, "average_package": 420000, "eligible_students": 510, "required_skills": ["Python", "SDLC", "SQL"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE", "MECH"]},
        {"name": "Wipro", "min_cgpa": 6.5, "min_readiness": 6.0, "average_package": 400000, "eligible_students": 480, "required_skills": ["Java", "Testing", "Cloud"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
        {"name": "HCL", "min_cgpa": 6.5, "min_readiness": 6.5, "average_package": 380000, "eligible_students": 420, "required_skills": ["Infrastructure", "Support", "Windows"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
        {"name": "Cognizant", "min_cgpa": 6.8, "min_readiness": 7.0, "average_package": 480000, "eligible_students": 390, "required_skills": ["Automation", "Digital", "Salesforce"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
        {"name": "Tech Mahindra", "min_cgpa": 6.5, "min_readiness": 6.5, "average_package": 410000, "eligible_students": 350, "required_skills": ["Networking", "Python", "5G"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
        {"name": "Capgemini", "min_cgpa": 6.8, "min_readiness": 7.2, "average_package": 520000, "eligible_students": 210, "required_skills": ["Integration", "Cloud Native", "DevOps"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
        {"name": "Accenture", "min_cgpa": 6.5, "min_readiness": 6.5, "average_package": 550000, "eligible_students": 240, "required_skills": ["Consulting", "Cloud", "English"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"]},
        {"name": "IBM", "min_cgpa": 7.2, "min_readiness": 8.0, "average_package": 1100000, "eligible_students": 110, "required_skills": ["Mainframe", "Watson AI", "Linux"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE"]},
        {"name": "DXC Technology", "min_cgpa": 6.5, "min_readiness": 6.5, "average_package": 350000, "eligible_students": 160, "required_skills": ["Service Desk", "Application Mgmt", "Azure"], "category": "Service Based", "preferred_departments": ["CSE", "IT", "ECE", "EEE"]},
    ]

@router.get("/overview", response_model=dict)
def get_placement_overview(db: Session = Depends(get_db)):
    placement_cohort = db.query(models.Student).filter(models.Student.year.in_([3, 4])).all()
    total_students = len(placement_cohort)
    eligible_students = len([s for s in placement_cohort if s.current_cgpa >= 7.5])
    placed_students = int(eligible_students * 0.65)
    
    return {
        "total_students": total_students,
        "eligible_students": eligible_students,
        "placed_students": placed_students,
        "placement_percentage": round((placed_students / eligible_students * 100), 1) if eligible_students > 0 else 0,
        "average_package": 680000,
        "highest_package": 4250000,
        "companies_hiring": 85
    }

@router.get("/all-students", response_model=dict)
def get_all_placement_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).join(models.User).filter(models.Student.year.in_([3, 4])).all()
    results = []
    for s in students:
        if not s.user: continue
        
        results.append({
            "id": s.id,
            "name": s.user.full_name,
            "roll_number": s.roll_number,
            "department": s.department,
            "year": s.year,
            "cgpa": round(s.current_cgpa or 0.0, 2),
            "readiness_score": round((s.career_readiness_score or 0.0) / 10, 2) if (s.career_readiness_score or 0.0) > 10 else round(s.career_readiness_score or 0.0, 2),
            "eligible_companies": random.randint(5, 15),
            "top_match": random.choice(["Google", "Microsoft", "Amazon"]),
            "placement_probability": random.randint(70, 98),
            "status": "Ready" if (s.career_readiness_score or 0.0) >= 75 or (s.career_readiness_score or 0.0) >= 7.5 else "In Progress"
        })
        
    return {"total": len(results), "students": results}

@router.get("/insights", response_model=dict)
def get_placement_insights(db: Session = Depends(get_db)):
    return {
        "insights": [
            "Consistent focus on DSA required for top product companies.",
            "Mock interview scores show 20% improvement in ECE department.",
            "High correlation (0.85) between career readiness and placement probability.",
            "Recommend advanced Python workshops for Year 3 CSE students."
        ]
    }

@router.get("/companies-list", response_model=List[dict])
def get_companies_list():
    return get_static_companies()

@router.get("/company/{company_name}", response_model=dict)
def get_company_eligible(company_name: str, db: Session = Depends(get_db)):
    companies = get_static_companies()
    company = next((c for c in companies if c["name"].lower() == company_name.lower()), None)
    
    if not company:
        raise HTTPException(status_code=404, detail=f"Company {company_name} not found in intelligence registry")
        
    # Standard Placement Cohort: Year 3 and Year 4
    eligible_students = db.query(models.Student).filter(
        models.Student.year.in_([3, 4]),
        models.Student.current_cgpa >= company["min_cgpa"]
    ).all()
    
    student_list = []
    for s in eligible_students:
        if not s.user: continue
        
        student_list.append({
            "id": s.id,
            "name": s.user.full_name,
            "roll_number": s.roll_number,
            "department": s.department,
            "cgpa": s.current_cgpa,
            "readiness_score": round((s.career_readiness_score or 0.0) / 10, 2) if (s.career_readiness_score or 0.0) > 10 else round(s.career_readiness_score or 0.0, 2),
            "match_percentage": round(random.uniform(70, 98), 1),
            "placement_probability": round(random.uniform(60, 95), 1)
        })
        
    return {
        "company": company["name"],
        "total_eligible": len(student_list),
        "students": student_list,
        "company_details": {
            "min_cgpa": company["min_cgpa"],
            "required_skills": company["required_skills"],
            "min_readiness": company["min_readiness"]
        }
    }

@router.get("/interview-tracking", response_model=dict)
def get_interview_tracking():
    interviews = [
        {"id": 1, "student_name": "Karthik R", "company": "Google", "round": "Technical Round 3", "status": "Under Process", "date": "2026-03-31"},
        {"id": 2, "student_name": "Deepika S", "company": "Microsoft", "round": "HR / Managerial", "status": "Offer Received", "date": "2026-03-29"},
        {"id": 3, "student_name": "Rahul M", "company": "Amazon", "round": "System Design", "status": "Under Process", "date": "2026-04-01"},
        {"id": 4, "student_name": "Priyanka V", "company": "Zoho", "round": "L3 Programming", "status": "Under Process", "date": "2026-03-30"},
        {"id": 5, "student_name": "Arun K", "company": "TCS", "round": "Final Round", "status": "Offer Received", "date": "2026-03-28"},
        {"id": 6, "student_name": "Meera P", "company": "Accenture", "round": "Cognitive Ability", "status": "Under Process", "date": "2026-04-02"},
        {"id": 7, "student_name": "Siddharth J", "company": "Razorpay", "round": "Product Thinking", "status": "Under Process", "date": "2026-03-31"},
        {"id": 8, "student_name": "Ananya G", "company": "Freshworks", "round": "Coding Assessment", "status": "Under Process", "date": "2026-03-30"},
        {"id": 9, "student_name": "Vignesh T", "company": "Tata Motors", "round": "Plant Interview", "status": "Offer Received", "date": "2026-03-27"},
        {"id": 10, "student_name": "Divya B", "company": "Honeywell", "round": "Electronics Fundamentals", "status": "Under Process", "date": "2026-04-03"}
    ]
    return {
        "offers_received": 542,
        "under_process": 1280,
        "interviews": interviews
    }

@router.get("/ranking", response_model=dict)
def get_placement_ranking():
    ranking = [
        {"rank": 1, "name": "Aditya Sharma", "dept": "CSE", "year": 4, "cgpa": 9.8, "readiness": 98.4, "status": "Ready"},
        {"rank": 2, "name": "Ishita Verma", "dept": "ECE", "year": 4, "cgpa": 9.6, "readiness": 96.2, "status": "Ready"},
        {"rank": 3, "name": "Sanjay Gupta", "dept": "AIML", "year": 3, "cgpa": 9.7, "readiness": 95.8, "status": "Ready"},
        {"rank": 4, "name": "Nisha Roy", "dept": "CSE", "year": 4, "cgpa": 9.4, "readiness": 94.1, "status": "Ready"},
        {"rank": 5, "name": "Vikas Singh", "dept": "MECH", "year": 4, "cgpa": 9.2, "readiness": 92.5, "status": "Ready"},
        {"rank": 6, "name": "Ananya Dass", "dept": "IOT", "year": 3, "cgpa": 9.3, "readiness": 91.8, "status": "Ready"},
        {"rank": 7, "name": "Rohit Kapoor", "dept": "ECE", "year": 4, "cgpa": 9.1, "readiness": 90.9, "status": "Ready"}
    ]
    return {
        "total": len(ranking),
        "ranking": ranking,
        "metrics": {
            "top_readiness": 98.4,
            "avg_readiness": 84.2
        }
    }

@router.get("/placed-students", response_model=dict)
def get_placed_students():
    placed = [
        {"name": "Amit Kumar", "dept": "CSE", "company": "Google", "cgpa": 9.5, "package": 3200000},
        {"name": "Sneha Reddy", "dept": "ECE", "company": "Microsoft", "cgpa": 9.2, "package": 2800000},
        {"name": "Mano J", "dept": "AIML", "company": "Amazon", "cgpa": 9.1, "package": 2500000},
        {"name": "Tanya S", "dept": "CSE", "company": "Zoho", "cgpa": 8.9, "package": 1200000},
        {"name": "Harish R", "dept": "MECH", "company": "Tata Motors", "cgpa": 8.7, "package": 950000},
        {"name": "Deepa K", "dept": "IOT", "company": "NVIDIA", "cgpa": 9.3, "package": 2800000},
        {"name": "Karthik W", "dept": "ECE", "company": "Bosch", "cgpa": 8.5, "package": 1200000}
    ]
    return {
        "total_placed": 5005,
        "placed_students": placed
    }

@router.get("/student/{student_id}", response_model=dict)
def get_student_placement_profile(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).join(models.User).filter(models.Student.id == student_id).first()
    
    if not student or not student.user:
        raise HTTPException(status_code=404, detail=f"Candidate node {student_id} not found in institutional registry")
        
    readiness_score = student.career_readiness_score or 0.0
    cgpa = student.current_cgpa or 0.0
    
    # Analyze corporate eligibility from static registry
    companies = get_static_companies()
    eligible_companies = []
    for c in companies:
        if cgpa >= c["min_cgpa"]:
            eligible_companies.append({
                "company": c["name"],
                "minCGPA": c["min_cgpa"],
                "matchPercentage": round(random.uniform(70, 98), 1),
                "requiredSkills": c["required_skills"],
                "placementProbability": round(random.uniform(60, 95), 1)
            })

    return {
        "name": student.user.full_name,
        "roll_number": student.roll_number or "MATRIX-000",
        "department": student.department or "CORE",
        "year": student.year or 4,
        "email": student.user.email,
        "readiness": {
            "cgpa": round(cgpa, 2),
            "career_readiness": round(readiness_score / 10, 2) if readiness_score > 10 else round(readiness_score, 2),
            "readiness_score": round(readiness_score / 10, 2) if readiness_score > 10 else round(readiness_score, 2),
            "status": "Ready" if readiness_score >= 75 or readiness_score >= 7.5 else "In Progress"
        },
        "eligible_companies": eligible_companies,
        "skills_proficiency": {
            "Data Structures": round(random.uniform(6, 9.5), 1),
            "Problem Solving": round(random.uniform(7, 9.8), 1),
            "System Design": round(random.uniform(5, 8.5), 1),
            "Technical Comm.": round(random.uniform(6, 9.0), 1),
            "Python/Java": round(random.uniform(7, 9.5), 1)
        },
        "skill_gaps": ["Distributed Systems", "Cloud Architecture"] if readiness_score < 8.5 else [],
        "mock_test_score": {
            "aptitude": round(random.uniform(70, 95), 1),
            "coding": round(random.uniform(65, 92), 1),
            "communication": round(random.uniform(75, 98), 1)
        },
        "interview_rounds_cleared": random.randint(0, 4),
        "offers_received": random.randint(0, 3),
        "training_recommendations": [
            "Enroll in Advanced System Design Workshop",
            "Focus on high-availability mock coding cycles",
            "Target Tier-1 Product Nodes for optimized placement probability"
        ]
    }
