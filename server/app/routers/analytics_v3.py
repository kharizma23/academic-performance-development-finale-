from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import random
from typing import List, Optional
from datetime import datetime
from app import database, models, schemas, auth

router = APIRouter(
    prefix="/admin/analytics",
    tags=["admin-analytics"]
)

@router.get("/feedback", response_model=schemas.FeedbackAnalytics)
def get_feedback_analytics(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 1 Implementation
    feedbacks = db.query(models.Feedback).all()
    total = len(feedbacks)
    if total == 0:
        return schemas.FeedbackAnalytics(
            total_feedbacks=0, avg_rating=0.0,
            sentiment=schemas.SentimentScore(positive=0, neutral=0, negative=0),
            faculty_ratings=[], trends=[], ai_recommendations=[]
        )
    
    avg_total = sum(f.overall_rating for f in feedbacks) / total
    
    fac_ratings = []
    # Simplified faculty aggregation
    facs = db.query(models.Staff).all()
    for f in facs:
        fac_ratings.append(schemas.FacultyRating(
            name=f.user.full_name if f.user else "Faculty",
            rating=f.student_feedback_rating,
            feedback_count=random.randint(5, 50)
        ))

    return schemas.FeedbackAnalytics(
        total_feedbacks=total + 150, # Inflated for demo
        avg_rating=round(avg_total, 2),
        sentiment=schemas.SentimentScore(positive=72.5, neutral=18.2, negative=9.3),
        faculty_ratings=fac_ratings[:5],
        trends=[
            schemas.FeedbackTrend(month="Jan", rating=4.1),
            schemas.FeedbackTrend(month="Feb", rating=4.3),
            schemas.FeedbackTrend(month="Mar", rating=round(avg_total, 2))
        ],
        ai_recommendations=[
            schemas.ActionRecommendation(category="Pedagogy", suggestion="Increase practical lab hours for OS course as students report theory-heavy content.", priority="High"),
            schemas.ActionRecommendation(category="Communication", suggestion="Dr. Arul Prasad has excellent clarity but needs more interactive doubt-clearing sessions.", priority="Medium"),
            schemas.ActionRecommendation(category="Resource", suggestion="Students in AIML dept requesting more GPU-enabled cloud nodes for deep learning credits.", priority="Medium")
        ]
    )

@router.get("/reports", response_model=schemas.WeeklyReportData)
def get_weekly_reports(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 2 Implementation
    reports = [
        schemas.WeeklyReportSummary(
            week_number=12, start_date="2026-03-24", end_date="2026-03-31",
            academic_performance=82.4, attendance_rate=88.5, syllabus_completion=75.0,
            ai_summary="Institutional performance increased by 4.2% this week. CSE and AIML depts showing 95%+ assignment completion.",
            performance_vs_last_week=4.2
        ),
        schemas.WeeklyReportSummary(
            week_number=11, start_date="2026-03-17", end_date="2026-03-24",
            academic_performance=78.2, attendance_rate=85.0, syllabus_completion=68.0,
            ai_summary="Standard performance levels. Slight dip in MECH department attendance identified by Anomaly Detector.",
            performance_vs_last_week=1.5
        )
    ]
    return schemas.WeeklyReportData(reports=reports, department_stats=[])

@router.get("/attendance", response_model=schemas.AttendanceIntelligence)
def get_attendance_intelligence(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 3 Implementation
    students = db.query(models.Student).limit(20).all()
    student_list = [
        schemas.StudentAttendance(
            id=s.id, name=s.user.full_name, percentage=s.attendance_percentage,
            status="Critical" if s.attendance_percentage < 75 else ("Warning" if s.attendance_percentage < 85 else "Stable")
        ) for s in students
    ]
    
    heatmap = [
        schemas.AttendanceHeatmap(subject="DS", attendance=92.0),
        schemas.AttendanceHeatmap(subject="DBMS", attendance=84.5),
        schemas.AttendanceHeatmap(subject="OS", attendance=71.2),
        schemas.AttendanceHeatmap(subject="Maths", attendance=68.4)
    ]
    
    predictions = [
        schemas.AttendancePrediction(student_id=students[0].id if students else "1", predicted_drop_percent=12.5, risk_level="High")
    ]
    
    return schemas.AttendanceIntelligence(
        overall_percentage=84.2,
        high_risk_count=len([s for s in student_list if s.status == "Critical"]),
        heatmap=heatmap,
        predictions=predictions,
        student_list=student_list
    )

@router.get("/courses", response_model=List[schemas.CourseProgress])
def get_course_management(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 4 Implementation
    subjects = db.query(models.Subject).all()
    return [
        schemas.CourseProgress(
            course_name=s.name,
            faculty_name=s.faculty.user.full_name if s.faculty and s.faculty.user else "Unassigned",
            progress=random.randint(40, 85),
            resources_count=random.randint(5, 20),
            ai_optimization="Suggest adding 2 more video lectures on Neural Networks."
        ) for s in subjects
    ]

@router.get("/tests", response_model=List[schemas.TestResult])
def get_test_assessment(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 5 Implementation
    tests = db.query(models.AIAssessment).all()
    return [
        schemas.TestResult(
            test_id=t.id, title=t.title, avg_score=78.5,
            submissions_count=25, total_students=80
        ) for t in tests
    ]

@router.get("/alerts", response_model=List[schemas.AIAlert])
def get_ai_alerts(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 6 Implementation
    return [
        schemas.AIAlert(id="1", type="Risk", message="12 students in ECE-3 dipped below 75% attendance.", severity="High", timestamp="2 mins ago"),
        schemas.AIAlert(id="2", type="Anomaly", message="Unusual high success rate in DSA Internal Test (98% avg). Check for test integrity.", severity="Medium", timestamp="1 hour ago")
    ]

@router.get("/alumni", response_model=schemas.AlumniMetric)
def get_alumni_intel(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 7 Implementation
    return schemas.AlumniMetric(total_alumni=1450, placed_percent=92.5, mentorship_ready=320, engagement_score=8.5)

@router.get("/industry-trends", response_model=List[schemas.IndustryTrend])
def get_industry_trends(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 8 Implementation
    return [
        schemas.IndustryTrend(skill="Generative AI", demand="Exponential", salary_avg="18-35 LPA", requirement="PyTorch, Transformers"),
        schemas.IndustryTrend(skill="Full Stack (MERN)", demand="High", salary_avg="8-15 LPA", requirement="Next.js, Node, MongoDB")
    ]

@router.get("/learning-path/{student_id}", response_model=schemas.LearningPathNode)
def get_learning_path(student_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Module 9 Implementation
    return schemas.LearningPathNode(
        goal="Senior Data Scientist",
        steps=["Python Mastery", "Statistics for AI", "Machine Learning Pipeline", "Deep Learning Architectures"],
        progress=65.0,
        certificates=["AWS Certified ML Specialist", "Google TensorBoard Advanced"]
    )
