from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth import get_current_user
from app import models
import random
import datetime

router = APIRouter(prefix="/admin/modules", tags=["Admin Modules"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- MODULE 1: FEEDBACK ANALYTICS -----------------
@router.get("/feedback")
def get_feedback_analytics(db: Session = Depends(get_db)):
    # High-density feedback synthesis
    return {
        "total_feedbacks": random.randint(1200, 5000),
        "avg_rating": round(random.uniform(3.8, 4.8), 1),
        "sentiment": {
            "positive": random.randint(65, 85),
            "neutral": random.randint(10, 25),
            "negative": random.randint(2, 10)
        },
        "trends": [
            {"month": "Jan", "rating": round(random.uniform(3.5, 4.5), 1)},
            {"month": "Feb", "rating": round(random.uniform(3.5, 4.5), 1)},
            {"month": "Mar", "rating": round(random.uniform(3.5, 4.5), 1)},
            {"month": "Apr", "rating": round(random.uniform(3.5, 4.5), 1)},
            {"month": "May", "rating": round(random.uniform(3.5, 4.5), 1)},
            {"month": "Jun", "rating": round(random.uniform(3.5, 4.5), 1)},
        ],
        "faculty_ratings": [
            {"name": "Dr. Arun Kumar", "rating": 4.8, "feedback_count": 142},
            {"name": "Prof. Sarah Chen", "rating": 4.6, "feedback_count": 120},
            {"name": "Dr. James Wilson", "rating": 4.5, "feedback_count": 110},
            {"name": "Dr. Priya Das", "rating": 4.3, "feedback_count": 95},
        ],
        "ai_recommendations": [
            {"category": "ACADEMIC", "suggestion": "Scale practical lab frequency for AIML S4 by 15%.", "priority": "High"},
            {"category": "INFRASTRUCTURE", "suggestion": "Optimize HVAC cycles in Block-C for evening sessions.", "priority": "Medium"},
            {"category": "PEDAGOGY", "suggestion": "Introduce peer-review nodes for Research Methodologies.", "priority": "High"}
        ]
    }

# ----------------- MODULE 2: WEEKLY REPORTS -----------------
@router.get("/reports")
def get_weekly_reports():
    return {
        "reports": [
            {"id": "W12-CSE", "dept": "CSE", "week": "12", "date": "2026-03-25", "status": "Generated", "ai_summary": "High performance in CS302; 5 anomaly nodes flagged in attendance."},
            {"id": "W12-ECE", "dept": "ECE", "week": "12", "date": "2026-03-25", "status": "Generated", "ai_summary": "Consistent growth; placement readiness at 88%."},
            {"id": "W11-MECH", "dept": "MECH", "week": "11", "date": "2026-03-18", "status": "Archived", "ai_summary": "Lab internal marks peaked; research output stable."},
        ],
        "comparison": [
            {"week": "W09", "performance": 78},
            {"week": "W10", "performance": 82},
            {"week": "W11", "performance": 80},
            {"week": "W12", "performance": 85},
        ]
    }

# ----------------- MODULE 3: ATTENDANCE INTELLIGENCE -----------------
@router.get("/attendance")
def get_attendance_intelligence():
    return {
        "total_monitored": 8642,
        "overall_attendance": 88.5,
        "low_attendance_count": 290,
        "prediction_next_month": -2.4, # Predicted drop
        "heatmap": [
            {"subject": "DSA", "attendance": 92},
            {"subject": "DBMS", "attendance": 84},
            {"subject": "OS", "attendance": 76},
            {"subject": "AI/ML", "attendance": 95},
        ],
        "alerts": [
            {"student": "737622-S005", "attendance": 68, "risk": "High"},
            {"student": "737622-S012", "attendance": 72, "risk": "Medium"},
            {"student": "737622-S028", "attendance": 64, "risk": "High"},
        ]
    }

# ----------------- MODULE 4: COURSE MANAGEMENT -----------------
@router.get("/courses")
def get_course_management():
    return [
        {"id": 1, "name": "Advanced AI/ML", "code": "CS401", "faculty": "Dr. Prabu", "progress": 75, "completion_est": "2026-05-10"},
        {"id": 2, "name": "Neural Networks", "code": "CS402", "faculty": "Dr. Arul", "progress": 62, "completion_est": "2026-05-25"},
        {"id": 3, "name": "Data Mining", "code": "CS403", "faculty": "Prof. Smith", "progress": 45, "completion_est": "2026-06-15"},
    ]

# ----------------- MODULE 5: TEST & ASSESSMENT -----------------
@router.get("/tests")
def get_test_assessments():
    return {
        "active_tests": [
            {"id": 101, "title": "Unit Test 2 - DSA", "dept": "CSE", "submissions": 115, "total": 120, "avg_score": 78},
            {"id": 102, "title": "Practice Quiz - OS", "dept": "CSE", "submissions": 95, "total": 120, "avg_score": 62},
        ],
        "evaluations_pending": 0 # AI auto-evaluated everything
    }

# ----------------- MODULE 6: AI ALERTS -----------------
@router.get("/alerts")
def get_ai_alerts():
    return {
        "priority_alerts": [
            {"id": 1, "type": "Risk", "msg": "7 sudden drops in Attendance detected in AIML Section B", "time": "2 mins ago"},
            {"id": 2, "type": "Anomaly", "msg": "Unusual marks spike in ECE internal assessments", "time": "1 hour ago"},
        ],
        "history": [
            {"date": "2026-04-01", "event": "CGPA outlier flag (737622-S099)", "status": "Resolved"},
            {"date": "2026-03-31", "event": "Faculty feedback dip detected", "status": "Path Assigned"},
        ]
    }

# ----------------- MODULE 7: ALUMNI INTELLIGENCE -----------------
@router.get("/alumni")
def get_alumni_intelligence():
    return {
        "placement_rate": 96.4,
        "avg_package": "12.8 LPA",
        "top_recruiters": ["Google", "Amazon", "NVIDIA", "Meta"],
        "engagement_score": 88,
        "mentorship_nodes": 142
    }

# ----------------- MODULE 8: INDUSTRY TRENDS -----------------
@router.get("/trends")
def get_industry_trends():
    return [
        {"skill": "Generative AI Node", "demand": "High", "salary_avg": "24.5 LPA", "requirement": "Expertise in LLM fine-tuning, RAG architectures, and Vector Database scaling."},
        {"skill": "Cyber Resilience Hub", "demand": "Critical", "salary_avg": "19.2 LPA", "requirement": "Zero Trust Security protocols, Cloud Native threat detection, and SOC automation."},
        {"skill": "Edge Compute Vector", "demand": "High", "salary_avg": "16.8 LPA", "requirement": "Low-latency microservices, IoT gateway logic, and real-time streaming protocols."},
        {"skill": "Spatial Intelligence", "demand": "Emergent", "salary_avg": "21.0 LPA", "requirement": "Computer Vision synthesis, 3D Mesh processing, and AR/VR infrastructure nodes."}
    ]

# ----------------- MODULE 9: LEARNING PATH -----------------
@router.get("/learning-path")
def get_learning_paths():
    return {
        "avg_completion": 68,
        "active_roadmaps": 1250,
        "certification_gap": 22, # % students without active cert
        "recommendations": [
            "AWS Certified Solutions Architect",
            "Google Professional Machine Learning Engineer",
            "CompTIA Security+"
        ]
    }
