from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from typing import List, Dict
import random

router = APIRouter(prefix="/career", tags=["Career Prediction"])

def calculate_match(student: models.Student, required_skills: List[str], target_role: str):
    """
    MATCH SCORE (%) based on:
    - CGPA weight (30%)
    - Skills match (40%)
    - Courses completed (20%) -> Simulating with Completed Todos / XP
    - Projects (10%) -> Simulating with specific project keywords in Todos
    """
    # 1. CGPA (30%) - Normalized to 10 max, then * 3
    cgpa_score = (student.current_cgpa / 10) * 30
    
    # 2. Skills Match (40%)
    student_skills_list = [s.skill_name.lower() for s in student.skills]
    matched_skills = [s for s in required_skills if s.lower() in student_skills_list]
    skills_score = (len(matched_skills) / max(len(required_skills), 1)) * 40
    
    # 3. Courses (20%) -> Simulated based on XP points vs Target (e.g. 500 XP = Max Score)
    courses_score = min((student.xp_points / 500) * 20, 20)
    
    # 4. Projects (10%) -> Defaulted to 7, increased if "Project" in todo names
    projects_base = 7
    project_todos = [t for t in student.academic_records if "project" in t.subject.lower()]
    projects_score = min(projects_base + (len(project_todos) * 1), 10)
    
    total_match = round(cgpa_score + skills_score + courses_score + projects_score, 1)
    
    # Readiness Logic
    readiness = "LOW"
    if total_match >= 80: readiness = "HIGH"
    elif total_match >= 60: readiness = "MEDIUM"
    
    # Missing Skills
    missing = [s for s in required_skills if s.lower() not in student_skills_list]
    
    return total_match, readiness, missing

@router.get("/recommendations/{student_id}", response_model=schemas.CareerRecommendations)
def get_recommendations(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    career_map = [
        {
            "title": "Full Stack Developer",
            "domain": "Software",
            "skills": ["React", "Node.js", "SQL", "Next.js", "Python"],
            "lpa": "12-18",
            "paths": ["Learn Next.js App Router", "Master Prisma ORM", "Deploy to Vercel"]
        },
        {
            "title": "AI Engineer",
            "domain": "Data Science",
            "skills": ["Python", "PyTorch", "ML", "Deep Learning", "TensorFlow"],
            "lpa": "18-25",
            "paths": ["Mathematical Foundations", "NLP Specialist Track", "LLM Fine-tuning"]
        },
        {
            "title": "Data Scientist",
            "domain": "Data Science",
            "skills": ["SQL", "Statistics", "Pandas", "Tableau", "R"],
            "lpa": "10-15",
            "paths": ["Advanced SQL Operations", "PowerBI Dashboards", "Statistical Forecasting"]
        },
        {
            "title": "Cloud Engineer",
            "domain": "DevOps",
            "skills": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
            "lpa": "15-22",
            "paths": ["AWS Solution Architect", "Certified Kubernetes Admin", "Istio Mesh Config"]
        },
        {
            "title": "Cybersecurity Analyst",
            "domain": "Security",
            "skills": ["TCP/IP", "Linux", "WireShark", "Penetration Testing"],
            "lpa": "14-20",
            "paths": ["CompTIA Security+", "Ethical Hacking Cert", "SOC Operations Hub"]
        }
    ]
    
    recommended_roles = []
    domain_scores = {"Software": 0, "Data Science": 0, "DevOps": 0, "Security": 0}
    
    for c in career_map:
        match, readiness, missing = calculate_match(student, c["skills"], c["title"])
        
        role_obj = {
            "title": c["title"],
            "match": match,
            "readiness": readiness,
            "missing_skills": missing,
            "suggestions": [f"Enroll in {s} Mastery Course" for s in missing[:2]],
            "domain": c["domain"],
            "lpa": c["lpa"],
            "required_skills": c["skills"],
            "learning_path": c["paths"]
        }
        recommended_roles.append(role_obj)
        
        # Track domain matches
        if match > domain_scores[c["domain"]]:
            domain_scores[c["domain"]] = match

    # Calculate institutional readiness (avg of top roles or domain scores)
    inst_readiness = round(sum(domain_scores.values()) / len(domain_scores), 1)
    
    # AI Insight Logic
    primary = sorted(recommended_roles, key=lambda x: x["match"], reverse=True)[0]
    insight = f"Neural Analysis suggests high synchrony with {primary['title']} roles. focus on {primary['missing_skills'][0] if primary['missing_skills'] else 'Core Architecture'} for 100% calibration."

    return {
        "roles": recommended_roles,
        "domain_scores": domain_scores,
        "institutional_readiness": inst_readiness,
        "ai_recommendations": insight
    }

@router.post("/ai-advice", response_model=schemas.CareerAdvice)
def get_ai_advice(req: schemas.AIAdviceRequest):
    # Simulated AI logic
    return {
        "personalized_suggestion": "Based on your high CGPA and growing interest in DevOps, switching focus to AWS Cloud Architecture will yield a 30% higher LPA trajectory.",
        "improvement_tips": [
            "Complete the Docker Node Orchestration module.",
            "Certify in AWS Foundational Cloud Practitioner.",
            "Build a Multi-region deployment project."
        ]
    }

@router.get("/progress/{student_id}", response_model=schemas.CareerProgress)
def get_progress(student_id: str, db: Session = Depends(get_db)):
    # Simulating growth trends
    return {
        "improvement_trend": [
            {"label": "Nov", "value": 45},
            {"label": "Dec", "value": 52},
            {"label": "Jan", "value": 68},
            {"label": "Feb", "value": 75},
            {"label": "Mar", "value": 82}
        ],
        "skill_growth": [
            {"skill": "Logic", "growth": 15},
            {"skill": "Code", "growth": 22},
            {"skill": "Cloud", "growth": 35}
        ],
        "readiness_change": 12.5
    }
