from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
import random

router = APIRouter(prefix="/api/skills", tags=["Skill Intelligence"])

@router.get("/overview")
async def get_skill_overview():
    """Returns global skill intelligence metrics"""
    return {
        "global_skill_score": 74.5,
        "top_skills": ["Python", "Problem Solving", "React", "System Design"],
        "skill_growth": 12.4,
        "company_readiness": 68.2,
        "trending_domain": "Artificial Intelligence",
        "skill_clusters": [
            {"name": "Technical", "score": 82},
            {"name": "Soft Skills", "score": 65},
            {"name": "Aptitude", "score": 74},
            {"name": "Core", "score": 79}
        ]
    }

@router.get("/profile/{student_id}")
async def get_student_skill_dna(student_id: str):
    """Generates a unique AI Skill DNA Profile for a student"""
    # In a real app, this would query refined skill data
    return {
        "student_id": student_id,
        "dna": {
            "coding": {"score": 88, "insight": "Elite algorithm designer with high logic velocity."},
            "communication": {"score": 62, "insight": "High technical clarity, requires focus on presentation cadence."},
            "aptitude": {"score": 75, "insight": "Consistent logical reasoning, stable performance."},
            "core": {"score": 81, "insight": "Deep architectural understanding of OS and DBMS."}
        },
        "evolution": [
            {"month": "Jan", "2024": 35, "2025": 45, "2026": 65, "is_prediction": False},
            {"month": "Feb", "2024": 38, "2025": 48, "2026": 68, "is_prediction": False},
            {"month": "Mar", "2024": 42, "2025": 52, "2026": 72, "is_prediction": False},
            {"month": "Apr", "2024": 45, "2025": 55, "2026": 78, "is_prediction": True},
            {"month": "May", "2024": 48, "2025": 58, "2026": 82, "is_prediction": True},
            {"month": "Jun", "2024": 52, "2025": 60, "2026": 85, "is_prediction": True},
            {"month": "Jul", "2024": 55, "2025": 62, "2026": 88, "is_prediction": True},
            {"month": "Aug", "2024": 58, "2025": 65, "2026": 91, "is_prediction": True},
            {"month": "Sep", "2024": 62, "2025": 68, "2026": 94, "is_prediction": True},
            {"month": "Oct", "2024": 65, "2025": 72, "2026": 96, "is_prediction": True},
            {"month": "Nov", "2024": 68, "2025": 75, "2026": 98, "is_prediction": True},
            {"month": "Dec", "2024": 72, "2025": 78, "2026": 100, "is_prediction": True}
        ],
        "badges": ["DSA Expert", "SQL Master", "Clean Coder"],
        "confidence_score": 84,
        "skill_score": 76.5
    }

@router.get("/gap/{student_id}")
async def get_skill_gap(student_id: str, target_company: str = "Amazon"):
    """Detects skill gaps for specific goals or companies"""
    companies = {
        "Amazon": ["System Design", "Distributed Systems", "Scaling", "AWS"],
        "Google": ["Advanced DSA", "OS Internals", "Concurrency", "C++"],
        "Microsoft": ["C#", "Cloud Architecture", "Enterprise Patterns", "Azure"]
    }
    
    missing = companies.get(target_company, ["Cloud Fundamentals", "System Optimization"])
    
    return {
        "target": target_company,
        "match_percentage": random.randint(65, 95),
        "missing_skills": missing,
        "recommendation": f"Focus on {missing[0]} to align with {target_company} standards."
    }

@router.get("/roadmap/{student_id}")
async def get_skill_roadmap(student_id: str):
    """Generates a personalized AI learning roadmap"""
    return {
        "weeks": [
            {"week": 1, "topic": "Advanced Tree Structures", "resource": "YouTube: Striver DSA", "duration": "10h"},
            {"week": 2, "topic": "System Design Patterns", "resource": "ByteByteGo", "duration": "12h"},
            {"week": 3, "topic": "Behavioral Mock Interviews", "resource": "Peer Practice", "duration": "8h"},
            {"week": 4, "topic": "Cloud Deployment (AWS)", "resource": "AWS Academy", "duration": "15h"}
        ],
        "domain_suggestion": "Backend Architect / Cloud Engineer"
    }

@router.get("/match")
async def get_company_match(student_id: str = None):
    """Matches a student with company requirements"""
    return [
        {"company": "Amazon", "match": 85, "status": "High Probability"},
        {"company": "Google", "match": 72, "status": "Moderate"},
        {"company": "Meta", "match": 68, "status": "Requires Gap Closure"},
        {"company": "Netflix", "match": 79, "status": "Strong Fit"}
    ]
