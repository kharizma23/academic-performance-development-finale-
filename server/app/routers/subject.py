from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Optional
from app import database, models, schemas, auth
import random

import time
_cache = {}

def get_cached(key: str):
    e = _cache.get(key)
    if e and time.time() < e["exp"]: return e["v"]
    return None

def set_cached(key: str, val, ttl: int = 60):
    _cache[key] = {"v": val, "exp": time.time() + ttl}

router = APIRouter(
    prefix="/api/subjects",
    tags=["subject-intelligence"]
)

@router.get("/overview", response_model=dict)
async def get_subject_overview(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """General dashboard overview for all subjects."""
    cached = get_cached("subjects_overview")
    if cached: return cached
    
    # SQL Aggregation for institutional KPIs
    stats = db.query(
        func.count(models.AcademicRecord.id).label("total_count"),
        func.avg(models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks).label("avg_marks"),
        func.count(func.distinct(models.AcademicRecord.subject)).label("subject_count")
    ).first()
    
    if not stats or stats.total_count == 0:
        return {"total_subjects": 0, "avg_pass_rate": 0, "avg_marks": 0, "difficult_subject": "N/A"}
        
    avg_pass_rate = db.query(
        func.avg(case((models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks >= 50, 1.0), else_=0.0))
    ).scalar() * 100
    
    # Identify difficult subject (lowest pass rate) via SQL
    difficult = db.query(
        models.AcademicRecord.subject,
        func.avg(case((models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks >= 50, 1.0), else_=0.0)).label("pass_rate")
    ).group_by(models.AcademicRecord.subject).order_by("pass_rate").first()
    
    result = {
        "total_subjects": stats.subject_count,
        "avg_pass_rate": round(avg_pass_rate, 2),
        "avg_marks": round(stats.avg_marks, 2),
        "difficult_subject": difficult[0] if difficult else "N/A"
    }
    set_cached("subjects_overview", result)
    return result
    
    return {
        "total_subjects": len(unique_subjects),
        "avg_pass_rate": round(pass_rate, 2),
        "avg_marks": round(avg_marks, 2),
        "difficult_subject": difficult_subject
    }

@router.get("/list", response_model=List[dict])
async def list_subjects(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """List all subjects with their aggregated stats."""
    cached = get_cached("subjects_list")
    if cached: return cached
    
    # Group AcademicRecords by subject name to get stats for the list view
    stats = db.query(
        models.AcademicRecord.subject,
        func.count(models.AcademicRecord.id).label("student_count"),
        func.avg(models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks).label("avg_marks"),
        func.sum(case((models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks >= 50, 1), else_=0)).label("pass_count")
    ).group_by(models.AcademicRecord.subject).all()
    
    # Now merge with actual Subject table if it has formal IDs/Codes
    subjects_formal = {s.name: s for s in db.query(models.Subject).all()}
    
    result = []
    for s_name, count, avg_m, pass_c in stats:
        formal = subjects_formal.get(s_name)
        result.append({
            "id": formal.id if formal else s_name, # Use ID if exists, otherwise name
            "name": s_name,
            "code": formal.code if formal else "N/A",
            "department": formal.department if formal else "Common",
            "semester": formal.semester if formal else 1,
            "pass_percentage": round((pass_c / count) * 100, 2) if count > 0 else 0,
            "avg_marks": round(avg_m, 2)
        })
    set_cached("subjects_list", result)
    return result

@router.get("/{subject_name_or_id}")
async def get_subject_detail(subject_name_or_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """Specific subject details and mapping."""
    # First check Subject table by ID or name
    subject = db.query(models.Subject).filter(
        (models.Subject.id == subject_name_or_id) | (models.Subject.name == subject_name_or_id)
    ).first()
    
    # If not found in formal table, aggregate from academic records
    name = subject.name if subject else subject_name_or_id
    records = db.query(models.AcademicRecord).filter(models.AcademicRecord.subject == name).all()
    
    if not records and not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    return {
        "id": subject.id if subject else name,
        "name": name,
        "code": subject.code if subject else "N/A",
        "department": subject.department if subject else "General",
        "semester": subject.semester if subject else 1,
        "description": subject.description if subject else "Core academic subject analysis.",
        "faculty": {
            "name": subject.faculty.name if subject and subject.faculty else "Unassigned",
            "id": subject.faculty_id if subject else None
        } if subject else {"name": "Unassigned", "id": None}
    }

@router.get("/{subject_name_or_id}/performance")
async def get_subject_performance(subject_name_or_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """Deep performance metrics: Internal vs External, ratios, trends."""
    # Resolve name
    subject = db.query(models.Subject).filter(models.Subject.id == subject_name_or_id).first()
    name = subject.name if subject else subject_name_or_id
    
    agg = db.query(
        func.count(models.AcademicRecord.id).label("total"),
        func.avg(models.AcademicRecord.internal_marks).label("avg_int"),
        func.avg(models.AcademicRecord.external_marks).label("avg_ext"),
        func.sum(case((models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks >= 50, 1), else_=0)).label("pass_count")
    ).filter(models.AcademicRecord.subject == name).first()
    
    if not agg or agg.total == 0:
        return {"error": "no data"}
    
    pass_count = agg.pass_count or 0
    fail_count = agg.total - pass_count
    
    # Marks distribution grouping via SQL (efficient)
    dist_stats = db.query(
        case((models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks < 40, "0-40"),
             (models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks < 60, "40-60"),
             (models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks < 80, "60-80"),
             else_="80-100").label("range"),
        func.count(models.AcademicRecord.id)
    ).filter(models.AcademicRecord.subject == name).group_by("range").all()
    
    dist = {"0-40": 0, "40-60": 0, "60-80": 0, "80-100": 0}
    for r, c in dist_stats: dist[r] = c
        
    # AI Insight Generation
    insights = []
    avg_internal = agg.avg_int or 0
    avg_external = agg.avg_ext or 0
    gap = avg_internal - avg_external
    if gap > 15:
        insights.append("High disparity discovered between CIA and Semester marks. Internal assessments may be lenient.")
    elif gap < -5:
        insights.append("Student performance spikes in Semester exams. Internal coaching might need intensification.")
    else:
        insights.append("Stable correlation maintained between Internal and External evaluation vectors.")
        
    if (fail_count / agg.total) > 0.3:
        insights.append("High backlog risk detected. Subject difficulty index exceeds standard department average.")
    
    return {
        "pass_fail_ratio": {"pass": pass_count, "fail": fail_count},
        "avg_internal": round(avg_internal, 2),
        "avg_external": round(avg_external, 2),
        "marks_distribution": dist,
        "backlog_percentage": round((fail_count / agg.total) * 100, 2),
        "ai_insights": insights,
        "remedial_suggestions": [
            "Conduct specialized bridge courses for weak performers.",
            "Integrate topic-specific question banks for external exam prep.",
            "Focus on Internal-External gap calibration."
        ]
    }

@router.get("/{subject_name_or_id}/students")
async def get_subject_students_intel(subject_name_or_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    """Toppers and Risk students for this specific subject."""
    subject = db.query(models.Subject).filter(models.Subject.id == subject_name_or_id).first()
    name = subject.name if subject else subject_name_or_id
    
    # Explicitly join with Student to get profile data
    toppers = db.query(
        models.Student.id,
        models.User.full_name,
        models.Student.roll_number,
        (models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks).label("total")
    ).join(models.Student, models.AcademicRecord.student_id == models.Student.id)\
     .join(models.User, models.Student.user_id == models.User.id)\
     .filter(models.AcademicRecord.subject == name)\
     .order_by(func.sum(models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks).desc())\
     .limit(5).all()
     
    risks = db.query(
        models.Student.id,
        models.User.full_name,
        models.Student.roll_number,
        (models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks).label("total")
    ).join(models.Student, models.AcademicRecord.student_id == models.Student.id)\
     .join(models.User, models.Student.user_id == models.User.id)\
     .filter(models.AcademicRecord.subject == name, (models.AcademicRecord.internal_marks + models.AcademicRecord.external_marks) < 50)\
     .limit(10).all()

    return {
        "toppers": [{"id": t.id, "name": t.full_name, "roll_number": t.roll_number, "marks": t.total} for t in toppers],
        "risk_students": [{"id": r.id, "name": r.full_name, "roll_number": r.roll_number, "marks": r.total} for r in risks]
    }
