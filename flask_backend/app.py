import os
import random
import uuid
import time
from functools import wraps
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import text, func
from datetime import datetime
import json

# ─── AI Assistant Mock Models ────────────────────────────────────────────────
class AIAssistant:
    @staticmethod
    def detect_intent(message):
        msg = message.lower()
        if any(w in msg for w in ["generate", "question", "test", "create paper", "mcq"]):
            return "question_generation"
        if any(w in msg for w in ["student", "performance", "marks", "how is", "who is topper", "best in", "details"]):
            return "data_retrieval"
        return "general_chat"

    @staticmethod
    def generate_questions(subject, topic, count=5, q_type="MCQ"):
        # This would normally call an LLM API like Gemini or OpenAI
        questions = []
        for i in range(1, count + 1):
            if q_type == "MCQ":
                questions.append({
                    "id": i,
                    "question": f"Sample {q_type} Question {i} about {topic} in {subject}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "Option A",
                    "explanation": f"This is why Option A is correct for {topic}."
                })
            else:
                questions.append({
                    "id": i,
                    "question": f"Explain the concept of {topic} in {subject} (2 marks).",
                    "answer": f"Standard definition of {topic}.",
                    "marks": 2
                })
        return questions

# ─── Simple in-memory cache ───────────────────────────────────────────────────
_cache: dict = {}

def _cached(ttl: int = 60):
    """Decorator: cache function result for `ttl` seconds."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = f"{fn.__name__}:{args}:{kwargs}"
            entry = _cache.get(key)
            if entry and time.time() < entry["exp"]:
                return entry["value"]
            result = fn(*args, **kwargs)
            _cache[key] = {"value": result, "exp": time.time() + ttl}
            return result
        return wrapper
    return decorator


# ─── Load environment variables ───────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///C:/Users/kharizma/Downloads/testcom-main/testcom-main/server/student_platform.db"

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# ─── Initialize SQLAlchemy ───────────────────────────────────────────────────
from models import db, User, Staff, Student, AcademicRecord, Feedback, Intervention, AITest, AITestSubmission
db.init_app(app)

# ─── Create all tables if they don't exist ────────────────────────────────────
with app.app_context():
    db.create_all()

# --- Helper: Rule-based Sentiment Analysis ---
def analyze_sentiment(text):
    if not text: return "Neutral"
    pos = ["excellent", "great", "good", "amazing", "clear", "helpful", "supportive", "passion", "expert", "brilliant", "outstanding", "wonderful"]
    neg = ["bad", "poor", "unclear", "difficult", "hard", "boring", "late", "strict", "rude", "terrible", "awful", "disappointing"]

    text_lower = text.lower()
    p_score = sum(1 for w in pos if w in text_lower)
    n_score = sum(1 for w in neg if w in text_lower)

    if p_score > n_score: return "Positive"
    if n_score > p_score: return "Negative"
    return "Neutral"

# --- Helper: Sentiment distribution ---
def get_sentiment_data(faculty_id):
    # If using existing feedback table (faculty -> student), we might not have student -> faculty text
    # Let's check for remarks in Feedback where faculty_id is the recipient (if we assume bi-directional)
    # OR if there's no data, return mock distribution based on staff rating
    staff = Staff.query.get(faculty_id)
    rating = staff.student_feedback_rating or 3.5
    
    # Mocking distribution based on rating
    total = random.randint(15, 45)
    pos_ratio = (rating / 5.0) * 0.8
    neg_ratio = (1.0 - (rating / 5.0)) * 0.4
    
    pos = int(total * pos_ratio)
    neg = int(total * neg_ratio)
    neu = total - pos - neg
    
    return {
        "Positive": max(pos, 0),
        "Negative": max(neg, 0),
        "Neutral": max(neu, 0),
        "total": total
    }

# --- Helper: Subject performance ---
def get_subject_performance(staff):
    # Query AcademicRecord for subjects matching staff's department or primary skill
    base_query = AcademicRecord.query
    if staff.primary_skill:
        records = base_query.filter(AcademicRecord.subject.like(f"%{staff.primary_skill}%")).all()
    else:
        records = base_query.limit(200).all() # Just generic
        
    if not records:
        # Fallback to smart mock if no DB records found
        subjects = [
            {"name": staff.primary_skill or "Advanced Core", "pass_rate": round(random.uniform(85, 98), 1)},
            {"name": f"{staff.department} Theory", "pass_rate": round(random.uniform(78, 92), 1)},
            {"name": f"{staff.department} Lab", "pass_rate": round(random.uniform(92, 99), 1)}
        ]
    else:
        # Aggregate from real records
        sub_map = {}
        for r in records:
            if r.subject not in sub_map: sub_map[r.subject] = {"pass": 0, "total": 0}
            sub_map[r.subject]["total"] += 1
            if r.grade and r.grade not in ["F", "RA", "U"]:
                sub_map[r.subject]["pass"] += 1
        
        subjects = []
        for name, stats in sub_map.items():
            rate = (stats["pass"] / stats["total"]) * 100
            subjects.append({"name": name, "pass_rate": round(rate, 1)})
            if len(subjects) >= 3: break
            
    for s in subjects:
        s["fail_rate"] = round(100 - s["pass_rate"], 1)
    return subjects

# --- Helper: Build faculty dict ---
def build_faculty_dict(s):
    user = s.user
    if not user:
        return None
    rating = s.student_feedback_rating if s.student_feedback_rating else 0.0
    impact = (s.consistency_score or 0.8) * 40 + rating * 12
    # Use dynamic subjects from helper
    subjects_data = get_subject_performance(s)
    subjects = [sub["name"] for sub in subjects_data]
    
    return {
        "id": s.id,
        "user_id": user.id,
        "name": user.full_name,
        "department": s.department,
        "subjects": subjects,
        "rating": round(rating, 2),
        "impact": round(min(impact, 100), 2),
        "designation": s.designation,
        "email": user.institutional_email or user.email,
        "primary_skill": s.primary_skill,
        "be_degree": s.be_degree,
        "me_degree": s.me_degree,
        "projects_completed": s.projects_completed or 0,
        "publications_count": s.publications_count or 0,
        "consistency_score": round((s.consistency_score or 0) * 100, 1)
    }

# ─── API Endpoints ───────────────────────────────────────────────────────────

@app.route("/api/faculty", methods=["GET"])
@_cached(ttl=120)
def get_all_faculty():
    all_staff = Staff.query.all()
    results = [r for s in all_staff if (r := build_faculty_dict(s)) is not None]
    return jsonify(results)

@app.route("/api/faculty/overview", methods=["GET"])
@_cached(ttl=90)
def get_faculty_overview():
    staff_count = Staff.query.count()
    avg_rating = db.session.query(func.avg(Staff.student_feedback_rating)).scalar() or 0.0
    avg_impact = db.session.query(func.avg(Staff.consistency_score)).scalar() or 0.0

    # Risk: staff with rating < 3 or low consistency
    low_performers = Staff.query.filter(
        (Staff.student_feedback_rating < 3.0) | (Staff.consistency_score < 0.5)
    ).count()

    # Dept breakdown - count by department
    dept_counts = db.session.query(Staff.department, func.count(Staff.id)).group_by(Staff.department).all()
    dept_data = [{"dept": d, "count": c} for d, c in dept_counts if d]

    return jsonify({
        "total_faculty": staff_count,
        "average_rating": round(float(avg_rating), 2),
        "average_impact_score": round(float(avg_impact * 100), 2),
        "high_risk_nodes": low_performers,
        "performance_trend": "Increasing" if avg_impact > 0.8 else "Stable",
        "dept_distribution": dept_data
    })

@app.route("/api/faculty/leaderboard", methods=["GET"])
@_cached(ttl=90)
def get_faculty_leaderboard():
    top_staff = Staff.query.order_by(Staff.consistency_score.desc()).limit(10).all()
    results = []
    for i, s in enumerate(top_staff):
        if not s.user: continue
        rating = s.student_feedback_rating or 0.0
        impact = s.consistency_score * 40 + rating * 12
        results.append({
            "id": s.id,
            "rank": i + 1,
            "name": s.user.full_name,
            "dept": s.department,
            "impact": round(min(impact, 100), 1),
            "rating": round(rating, 2),
            "designation": s.designation
        })
    return jsonify(results)

@app.route("/api/faculty/performance", methods=["GET"])
@_cached(ttl=60)
def get_faculty_performance():
    all_staff = Staff.query.all()
    performance_data = []
    for s in all_staff:
        if not s.user: continue
        rating = s.student_feedback_rating or 0.0
        impact = s.consistency_score * 40 + rating * 12
        pass_rate = 75 + (s.consistency_score or 0.5) * 20 + random.uniform(-5, 5)
        pass_rate = min(max(pass_rate, 50), 98)
        performance_data.append({
            "id": s.id,
            "name": s.user.full_name,
            "department": s.department,
            "pass_rate": round(pass_rate, 1),
            "fail_rate": round(100 - pass_rate, 1),
            "impact": round(min(impact, 100), 1),
            "rating": round(rating, 2),
            "attendance_correlation": round(0.6 + (s.consistency_score or 0.5) * 0.3 + random.uniform(-0.05, 0.1), 2)
        })
    return jsonify(performance_data)

@app.route("/api/faculty/feedback", methods=["GET"])
@_cached(ttl=60)
def get_faculty_feedback():
    all_feedback = Feedback.query.order_by(Feedback.created_at.desc()).limit(100).all()
    results = []
    for f in all_feedback:
        sentiment = analyze_sentiment(f.detailed_remarks)
        faculty_name = "Unknown"
        if f.faculty and f.faculty.full_name:
            faculty_name = f.faculty.full_name
        results.append({
            "id": f.id,
            "faculty_name": faculty_name,
            "faculty_id": f.faculty_id,
            "rating": f.overall_rating,
            "comment": f.detailed_remarks or "",
            "sentiment": sentiment,
            "date": f.created_at.isoformat() if f.created_at else None
        })
    
    # Sentiment distribution
    sentiment_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    for r in results:
        sentiment_counts[r["sentiment"]] = sentiment_counts.get(r["sentiment"], 0) + 1
    
    avg_rating = sum(r["rating"] for r in results if r["rating"]) / len(results) if results else 0
    
    return jsonify({
        "total": len(results),
        "average_rating": round(avg_rating, 2),
        "sentiment_distribution": sentiment_counts,
        "recent_feedback": results[:20]
    })

@app.route("/api/faculty/alerts", methods=["GET"])
@_cached(ttl=30)
def get_faculty_alerts():
    alerts = []
    
    # Low performing faculty (rating < 3.5)
    low_rated = Staff.query.filter(Staff.student_feedback_rating < 3.5).all()
    for s in low_rated:
        if not s.user: continue
        alerts.append({
            "type": "low_performance",
            "severity": "high" if (s.student_feedback_rating or 0) < 3.0 else "medium",
            "faculty_id": s.id,
            "faculty_name": s.user.full_name,
            "department": s.department,
            "message": f"Rating below threshold: {round(s.student_feedback_rating or 0, 1)}/5",
            "metric": "Student Rating",
            "value": round(s.student_feedback_rating or 0, 1)
        })
    
    # Low consistency
    low_consistency = Staff.query.filter(Staff.consistency_score < 0.6).all()
    for s in low_consistency:
        if not s.user: continue
        # Avoid duplicates
        if not any(a["faculty_id"] == s.id and a["type"] == "low_consistency" for a in alerts):
            alerts.append({
                "type": "low_consistency",
                "severity": "medium",
                "faculty_id": s.id,
                "faculty_name": s.user.full_name,
                "department": s.department,
                "message": f"Low consistency score: {round((s.consistency_score or 0) * 100, 1)}%",
                "metric": "Consistency Score",
                "value": round((s.consistency_score or 0) * 100, 1)
            })
    
    # Negative feedback alerts
    negative_feedback = Feedback.query.filter(Feedback.overall_rating < 3.0).all()
    faculty_neg_count = {}
    for f in negative_feedback:
        fid = f.faculty_id
        faculty_neg_count[fid] = faculty_neg_count.get(fid, 0) + 1
    
    for fid, count in faculty_neg_count.items():
        if count >= 2:
            user = User.query.get(fid)
            if user:
                staff = Staff.query.filter_by(user_id=fid).first()
                alerts.append({
                    "type": "negative_feedback",
                    "severity": "high" if count >= 5 else "medium",
                    "faculty_id": fid,
                    "faculty_name": user.full_name,
                    "department": staff.department if staff else "N/A",
                    "message": f"{count} negative reviews received",
                    "metric": "Negative Reviews",
                    "value": count
                })
    
    # Sort by severity
    severity_order = {"high": 0, "medium": 1, "low": 2}
    alerts.sort(key=lambda x: severity_order.get(x["severity"], 2))
    
    return jsonify(alerts[:20])  # Return top 20

@app.route("/api/faculty/risk-contribution", methods=["GET"])
@_cached(ttl=60)
def get_risk_contribution():
    # Get all staff
    all_staff = Staff.query.all()
    results = []
    
    for s in all_staff:
        if not s.user: continue
        # Mock: derive risk student count from rating and consistency
        rating = s.student_feedback_rating or 3.5
        consistency = s.consistency_score or 0.7
        # Lower rating + lower consistency = more risk students
        base_students = 80 + random.randint(20, 60)
        risk_ratio = max(0.05, 0.5 - (rating / 5 * 0.3) - (consistency * 0.2))
        risk_count = int(base_students * risk_ratio)
        
        results.append({
            "id": s.id,
            "name": s.user.full_name,
            "department": s.department,
            "total_students": base_students,
            "risk_students": risk_count,
            "risk_percentage": round(risk_ratio * 100, 1),
            "rating": round(rating, 2)
        })
    
    # Sort by risk count descending
    results.sort(key=lambda x: x["risk_students"], reverse=True)
    return jsonify(results[:10])

@app.route("/api/faculty/compare", methods=["GET"])
def compare_faculty():
    """Compare two faculty members side-by-side"""
    id1 = request.args.get("id1")
    id2 = request.args.get("id2")
    
    if not id1 or not id2:
        return jsonify({"error": "Provide id1 and id2 query params"}), 400
    
    def get_staff_data(fid):
        s = Staff.query.filter((Staff.id == fid) | (Staff.staff_id == fid) | (Staff.user_id == fid)).first()
        if not s or not s.user:
            return None
        rating = s.student_feedback_rating or 0.0
        impact = s.consistency_score * 40 + rating * 12
        pass_rate = 75 + (s.consistency_score or 0.5) * 20 + random.uniform(-5, 5)
        pass_rate = min(max(pass_rate, 50), 98)
        feedback = Feedback.query.filter(Feedback.faculty_id == s.user_id).all()
        sentiments = [analyze_sentiment(f.detailed_remarks) for f in feedback]
        
        return {
            "id": s.id,
            "name": s.user.full_name,
            "department": s.department,
            "designation": s.designation,
            "rating": round(rating, 2),
            "impact": round(min(impact, 100), 1),
            "pass_rate": round(pass_rate, 1),
            "fail_rate": round(100 - pass_rate, 1),
            "consistency": round((s.consistency_score or 0) * 100, 1),
            "projects_completed": s.projects_completed or 0,
            "publications_count": s.publications_count or 0,
            "total_reviews": len(feedback),
            "positive_reviews": sentiments.count("Positive"),
            "negative_reviews": sentiments.count("Negative"),
            "attendance_correlation": round(0.6 + (s.consistency_score or 0.5) * 0.3, 2),
            "classes_per_week": 18 + random.randint(-4, 4),
            "subjects_count": 3,
            "primary_skill": s.primary_skill or "Engineering",
            "be_degree": s.be_degree,
            "me_degree": s.me_degree
        }
    
    data1 = get_staff_data(id1)
    data2 = get_staff_data(id2)
    
    if not data1:
        return jsonify({"error": f"Faculty with id {id1} not found"}), 404
    if not data2:
        return jsonify({"error": f"Faculty with id {id2} not found"}), 404
    
    return jsonify({"faculty1": data1, "faculty2": data2})

@app.route("/api/faculty/<id>", methods=["GET"])
def get_faculty_detail(id):
    staff = Staff.query.filter((Staff.id == id) | (Staff.staff_id == id) | (Staff.user_id == id)).first()
    if not staff:
        return jsonify({"error": "Faculty member not found."}), 404

    user = staff.user
    rating = staff.student_feedback_rating or 3.5
    
    # Subjects and performance from DB or calculated logic
    subjects = get_subject_performance(staff)
    avg_pass_rate = sum(s["pass_rate"] for s in subjects) / len(subjects) if subjects else 85.0

    workload = {
        "classes_per_week": 18 + random.randint(-4, 4),
        "total_subjects": len(subjects),
        "active_students": 120 + random.randint(-20, 40)
    }

    sent_data = get_sentiment_data(staff.id)

    # Attendance data trend
    attendance_data = [
        {"month": "Aug", "faculty_attendance": round(90 + random.uniform(-5, 5), 1), "student_attendance": round(80 + random.uniform(-10, 10), 1)},
        {"month": "Sep", "faculty_attendance": round(92 + random.uniform(-5, 5), 1), "student_attendance": round(82 + random.uniform(-10, 10), 1)},
        {"month": "Oct", "faculty_attendance": round(88 + random.uniform(-5, 5), 1), "student_attendance": round(78 + random.uniform(-10, 10), 1)},
        {"month": "Nov", "faculty_attendance": round(94 + random.uniform(-5, 5), 1), "student_attendance": round(85 + random.uniform(-10, 10), 1)},
        {"month": "Dec", "faculty_attendance": round(91 + random.uniform(-5, 5), 1), "student_attendance": round(83 + random.uniform(-10, 10), 1)},
        {"month": "Jan", "faculty_attendance": round(93 + random.uniform(-5, 5), 1), "student_attendance": round(86 + random.uniform(-10, 10), 1)},
    ]

    # Performance before/after (Comparative Analytics)
    performance_comparison = [
        {"period": "Before Session", "avg_marks": round(65 + random.uniform(-5, 5), 1), "pass_rate": round(avg_pass_rate - 8, 1)},
        {"period": "After Session", "avg_marks": round(75 + random.uniform(-5, 5), 1), "pass_rate": round(avg_pass_rate, 1)},
    ]

    return jsonify({
        "id": staff.id,
        "name": user.full_name,
        "department": staff.department,
        "designation": staff.designation,
        "primary_skill": staff.primary_skill,
        "rating": round(float(rating), 2),
        "impact": round(float((staff.consistency_score or 0.8) * 100), 1),
        "be_degree": staff.be_degree,
        "me_degree": staff.me_degree,
        "projects_completed": staff.projects_completed or 0,
        "publications_count": staff.publications_count or 0,
        "email": user.institutional_email or user.email,
        "workload": workload,
        "subjects": subjects,
        "performance": {
            "pass_rate": round(avg_pass_rate, 1),
            "fail_rate": round(100 - avg_pass_rate, 1),
            "attendance_correlation": round(0.7 + (staff.consistency_score or 0.8) * 0.2, 2)
        },
        "performance_comparison": performance_comparison,
        "attendance_data": attendance_data,
        "feedback_analytics": {
            "total_reviews": sent_data["total"],
            "sentiment_distribution": {
                "Positive": sent_data["Positive"],
                "Negative": sent_data["Negative"],
                "Neutral": sent_data["Neutral"]
            },
            "recent_comments": [
                {"text": "Exceptional clarity in complex concepts.", "sentiment": "Positive", "rating": 5},
                {"text": "Highly supportive during laboratory sessions.", "sentiment": "Positive", "rating": 4.5},
                {"text": "Course material could be more updated.", "sentiment": "Neutral", "rating": 3.5}
            ]
        }
    })

@app.route("/api/faculty/intervention", methods=["POST"])
def assign_intervention():
    data = request.json
    inter = Intervention(
        faculty_id=data.get("faculty_id"),
        type=data.get("type"),
        description=data.get("description"),
        status="Assigned"
    )
    db.session.add(inter)
    db.session.commit()
    return jsonify({"message": "Intervention assigned successfully.", "id": inter.id})

@app.route("/api/faculty/interventions", methods=["GET"])
def get_all_interventions():
    """Get list of all assigned interventions"""
    all_interventions = Intervention.query.order_by(Intervention.created_at.desc()).all()
    results = []
    for inter in all_interventions:
        user = User.query.get(inter.faculty_id) if inter.faculty_id else None
        results.append({
            "id": inter.id,
            "faculty_id": inter.faculty_id,
            "faculty_name": user.full_name if user else "Unknown",
            "type": inter.type,
            "description": inter.description,
            "status": inter.status,
            "created_at": inter.created_at.isoformat() if inter.created_at else None
        })
    return jsonify(results)

@app.route("/api/faculty/insights", methods=["GET"])
def get_faculty_insights():
    staff_count = Staff.query.count()
    if staff_count == 0:
        return jsonify(["No data available for insights."])

    avg_rating = db.session.query(func.avg(Staff.student_feedback_rating)).scalar() or 0.0
    avg_consistency = db.session.query(func.avg(Staff.consistency_score)).scalar() or 0.0

    low_rated_count = Staff.query.filter(Staff.student_feedback_rating < 3.5).count()
    top_dept = db.session.query(Staff.department, func.avg(Staff.consistency_score)).group_by(
        Staff.department).order_by(func.avg(Staff.consistency_score).desc()).first()

    top_dept_name = top_dept[0] if top_dept else "CSE"

    insights = [
        f"Top performing department: {top_dept_name} with {round(float(top_dept[1] or 0) * 100, 1)}% average consistency score.",
        f"{low_rated_count} faculty members have a student rating below 3.5 — recommend targeted interventions.",
        f"Overall institutional faculty impact: {round(float(avg_consistency or 0) * 100, 1)}% — {'above' if avg_consistency > 0.8 else 'below'} benchmark.",
        f"Average student feedback rating is {round(float(avg_rating), 2)}/5.0 across all {staff_count} faculty members.",
        f"Attendance correlation analysis shows faculty with >90% consistency have {round(random.uniform(15, 25), 1)}% higher student pass rates.",
        f"Recommend workload balancing for {random.randint(3, 8)} faculty members teaching >20 classes per week."
    ]
    return jsonify(insights)

# ═══════════════════════════════════════════════════════════════════════════════
# 🏆 HIGH ACHIEVERS INTELLIGENCE MODULE APIs ════════════════════════════════════
# ═══════════════════════════════════════════════════════════════════════════════

@app.route("/api/high-achievers", methods=["GET"])
@_cached(ttl=60)
def get_all_high_achievers():
    """Get all high achievers with comprehensive metrics"""
    limit = request.args.get("limit", 50, type=int)
    department = request.args.get("department", None)
    year = request.args.get("year", None)
    
    query = Student.query.join(User).filter(User.id != None)
    
    if department:
        query = query.filter(Student.department == department)
    if year:
        query = query.filter(Student.year == int(year))
    
    students = query.all()
    
    results = []
    for student in students:
        if not student.user:
            continue
        
        # Get feedback count for this student
        feedback_count = Feedback.query.filter(Feedback.student_id == student.id).count()
        
        # Calculate composite score
        cgpa = student.current_cgpa or 0.0
        skill_score = student.career_readiness_score or 0.0
        attendance_avg = random.uniform(85, 98)
        
        composite = (cgpa * 0.4) + (skill_score * 0.3) + (attendance_avg * 0.3)
        
        # Calculate growth
        base_cgpa = cgpa * random.uniform(0.8, 0.95)
        growth_percent = ((cgpa - base_cgpa) / base_cgpa * 100) if base_cgpa > 0 else 0
        
        results.append({
            "id": student.id,
            "name": student.user.full_name,
            "email": student.user.email,
            "roll_number": student.roll_number or "N/A",
            "department": student.department,
            "year": student.year or 1,
            "cgpa": round(cgpa, 2),
            "composite_score": round(min(composite, 10), 2),
            "skill_score": round(skill_score, 2),
            "attendance": round(attendance_avg, 1),
            "feedback_count": feedback_count,
            "growth_percent": round(growth_percent, 1),
            "streak": random.randint(20, 180),
            "career_readiness": round(skill_score, 2)
        })
    
    # Sort by composite score
    results.sort(key=lambda x: x["composite_score"], reverse=True)
    
    return jsonify(results[:limit])

@app.route("/api/high-achievers/top", methods=["GET"])
@_cached(ttl=60)
def get_top_achievers():
    """Get top 10, 50 achievers with rankings"""
    count = request.args.get("count", 10, type=int)
    
    students = Student.query.join(User).filter(User.id != None).all()
    
    results = []
    for student in students:
        if not student.user:
            continue
        
        cgpa = student.current_cgpa or 0.0
        skill_score = student.career_readiness_score or 0.0
        attendance_avg = random.uniform(85, 98)
        
        composite = (cgpa * 0.4) + (skill_score * 0.3) + (attendance_avg * 0.3)
        
        results.append({
            "id": student.id,
            "rank": 0,  # Will be set after sorting
            "name": student.user.full_name,
            "roll_number": student.roll_number or "N/A",
            "department": student.department,
            "year": student.year or 1,
            "cgpa": round(cgpa, 2),
            "composite_score": round(min(composite, 10), 2),
            "badge": None
        })
    
    results.sort(key=lambda x: x["composite_score"], reverse=True)
    
    for idx, student in enumerate(results[:count]):
        student["rank"] = idx + 1
        if idx == 0:
            student["badge"] = "🥇 Rank 1"
        elif idx == 1:
            student["badge"] = "🥈 Rank 2"
        elif idx == 2:
            student["badge"] = "🥉 Rank 3"
    
    return jsonify(results[:count])

@app.route("/api/high-achievers/growth", methods=["GET"])
@_cached(ttl=60)
def get_growth_intelligence():
    """Identify students with highest improvement"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    results = []
    for student in students:
        if not student.user:
            continue
        
        cgpa = student.current_cgpa or 0.0
        base_cgpa = cgpa * random.uniform(0.7, 0.95)
        growth_percent = ((cgpa - base_cgpa) / base_cgpa * 100) if base_cgpa > 0 else 0
        
        if growth_percent > 5:  # Only show meaningful growth
            results.append({
                "id": student.id,
                "name": student.user.full_name,
                "department": student.department,
                "year": student.year or 1,
                "current_cgpa": round(cgpa, 2),
                "previous_cgpa": round(base_cgpa, 2),
                "growth_percent": round(growth_percent, 1),
                "badge": "📈 Most Improved"
            })
    
    results.sort(key=lambda x: x["growth_percent"], reverse=True)
    return jsonify(results[:20])

@app.route("/api/high-achievers/skills", methods=["GET"])
@_cached(ttl=60)
def get_skill_excellence():
    """Identify skills excellence and top performers by skill"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    skill_categories = {
        "coding": [],
        "aptitude": [],
        "communication": []
    }
    
    for student in students:
        if not student.user:
            continue
        
        # Mock skill scores based on career readiness
        readiness = student.career_readiness_score or 5.0
        
        coding_score = readiness + random.uniform(-1, 2)
        aptitude_score = readiness + random.uniform(-1, 2)
        communication_score = readiness + random.uniform(-1, 2)
        
        if coding_score > 6.5:
            skill_categories["coding"].append({
                "id": student.id,
                "name": student.user.full_name,
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "score": round(min(coding_score, 10), 2),
                "badge": "💻 Top Coder"
            })
        
        if aptitude_score > 6.5:
            skill_categories["aptitude"].append({
                "id": student.id,
                "name": student.user.full_name,
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "score": round(min(aptitude_score, 10), 2),
                "badge": "🧠 Logic Master"
            })
        
        if communication_score > 6.5:
            skill_categories["communication"].append({
                "id": student.id,
                "name": student.user.full_name,
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "score": round(min(communication_score, 10), 2),
                "badge": "🎯 Best Communicator"
            })
    
    for category in skill_categories:
        skill_categories[category].sort(key=lambda x: x["score"], reverse=True)
        skill_categories[category] = skill_categories[category][:5]
    
    return jsonify(skill_categories)

@app.route("/api/high-achievers/department-toppers", methods=["GET"])
@_cached(ttl=60)
def get_department_toppers():
    """Get topper from each department"""
    departments = set()
    students = Student.query.join(User).filter(User.id != None).all()
    
    dept_toppers = {}
    
    for student in students:
        if not student.user or not student.department:
            continue
        
        departments.add(student.department)
        cgpa = student.current_cgpa or 0.0
        
        if student.department not in dept_toppers or cgpa > dept_toppers[student.department]["cgpa"]:
            dept_toppers[student.department] = {
                "id": student.id,
                "name": student.user.full_name,
                "department": student.department,
                "year": student.year or 1,
                "cgpa": round(cgpa, 2),
                "roll_number": student.roll_number or "N/A"
            }
    
    return jsonify(list(dept_toppers.values()))

@app.route("/api/high-achievers/consistency", methods=["GET"])
@_cached(ttl=60)
def get_consistency_engine():
    """Identify consistently high-scoring students"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    results = []
    for student in students:
        if not student.user:
            continue
        
        cgpa = student.current_cgpa or 0.0
        
        # Students with CGPA > 8.5 are considered consistent achievers
        if cgpa >= 8.5:
            results.append({
                "id": student.id,
                "name": student.user.full_name,
                "roll_number": student.roll_number or "N/A",
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "cgpa": round(cgpa, 2),
                "consistency": round(random.uniform(85, 99), 1),
                "badge": "✨ Consistent Achiever"
            })
    
    results.sort(key=lambda x: x["cgpa"], reverse=True)
    return jsonify(results)

# ═══════════════════════════════════════════════════════════════════════════════
# 🤖 AI ACADEMIC ASSISTANT APIs ════════════════════════════════════════════════
# ═══════════════════════════════════════════════════════════════════════════════

@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    data = request.json
    user_message = data.get("message", "")
    
    intent = AIAssistant.detect_intent(user_message)
    
    response = {
        "intent": intent,
        "message": "",
        "data": None,
        "suggestions": []
    }
    
    if intent == "question_generation":
        # Extract subject/topic/count if possible (simple heuristic)
        msg_low = user_message.lower()
        subject = "DBMS" if "dbms" in msg_low else "Python" if "python" in msg_low else "Java" if "java" in msg_low else "General"
        topic = "General Concepts"
        count = 10
        if "50" in msg_low: count = 50
        elif "10" in msg_low: count = 10
        
        q_type = "2-mark" if "two-mark" in msg_low or "2 mark" in msg_low else "MCQ"
        
        questions = AIAssistant.generate_questions(subject, topic, count, q_type)
        response["message"] = f"I contextually generated {count} {q_type} questions for {subject}. You can review and create a test from them."
        response["data"] = {
            "questions": questions,
            "subject": subject,
            "topic": topic
        }
        response["suggestions"] = ["Create Test for Students", "Change to 5 MCQs"]
    
    elif intent == "data_retrieval":
        msg_low = user_message.lower()
        if "ece" in msg_low and "3rd year" in msg_low:
            students = Student.query.filter_by(department="ECE", year=3).order_by(Student.current_cgpa.desc()).limit(10).all()
            if students:
                names = [f"{s.user.full_name} (CGPA: {s.current_cgpa})" for s in students if s.user]
                response["message"] = "Here are the top 10 students in ECE 3rd year: \n" + "\n".join(names)
                response["data"] = [{"name": s.user.full_name, "cgpa": s.current_cgpa} for s in students if s.user]
            else:
                response["message"] = "I found your request for ECE 3rd year toppers, but there's no data in the database for them yet."
        elif "topper" in msg_low:
            top_student = Student.query.join(User).order_by(Student.current_cgpa.desc()).first()
            if top_student:
                response["message"] = f"The overall topper is {top_student.user.full_name} from {top_student.department} with a CGPA of {top_student.current_cgpa}."
            else:
                response["message"] = "I couldn't find any student topper data yet."
        else:
            response["message"] = "I can fetch information about departments, years, and student rankings. Try 'Top 5 CSE students'."
            
    else:
        response["message"] = "Hello! I am your AI Academic Assistant. I can generate question papers, fetch student rankings, and evaluate submissions. How can I help you today?"
        response["suggestions"] = ["Generate 10 MCQs on DBMS", "Who is the topper in CSE?", "How to evaluate tests?"]
        
    return jsonify(response)

@app.route("/api/ai/generate", methods=["POST"])
def ai_generate_test():
    data = request.json
    subject = data.get("subject", "General")
    topic = data.get("topic", "General Knowledge")
    count = data.get("count", 5)
    q_type = data.get("type", "MCQ")
    
    questions = AIAssistant.generate_questions(subject, topic, count, q_type)
    return jsonify({
        "subject": subject,
        "topic": topic,
        "questions": questions
    })

@app.route("/api/test/create", methods=["POST"])
def create_test():
    data = request.json
    new_test = AITest(
        title=data.get("title", f"{data.get('subject')} Test"),
        subject=data.get("subject"),
        topic=data.get("topic"),
        department=data.get("department"),
        year=data.get("year"),
        questions=data.get("questions"),
        total_marks=data.get("total_marks", 100),
        created_by=data.get("created_by")
    )
    db.session.add(new_test)
    db.session.commit()
    return jsonify({"message": "Test created successfully", "test_id": new_test.id})

@app.route("/api/test/assign", methods=["POST"])
def assign_test():
    data = request.json
    test_id = data.get("test_id")
    dept = data.get("department")
    year = data.get("year")
    
    # In a real system, we'd create "AssignedTest" mapping or just filter in global view
    # For simplicity, we just return the count of students impacted
    students = Student.query.filter_by(department=dept, year=year).all()
    
    # Create empty submissions for all targeted students to track "Pending" status
    for s in students:
        existing = AITestSubmission.query.filter_by(test_id=test_id, student_id=s.id).first()
        if not existing:
            sub = AITestSubmission(
                test_id=test_id,
                student_id=s.id,
                status="Pending",
                answers={}
            )
            db.session.add(sub)
    
    db.session.commit()
    return jsonify({"message": f"Test assigned to {len(students)} students in {dept} Year {year}."})

@app.route("/api/test/student/<student_id>", methods=["GET"])
def get_student_tests(student_id):
    # Find all submissions for this student (includes Pending ones)
    subs = AITestSubmission.query.filter_by(student_id=student_id).all()
    results = []
    for s in subs:
        test = s.test
        if test:
            results.append({
                "submission_id": s.id,
                "test_id": test.id,
                "title": test.title,
                "subject": test.subject,
                "questions_count": len(test.questions) if test.questions else 0,
                "status": s.status,
                "score": s.score,
                "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None
            })
    return jsonify(results)

@app.route("/api/test/details/<test_id>", methods=["GET"])
def get_test_details(test_id):
    test = AITest.query.get(test_id)
    if not test:
        return jsonify({"error": "Test not found"}), 404
    
    # Scrub correct answers if student is requesting?? 
    # For now, return all (frontend will handle visibility)
    return jsonify({
        "id": test.id,
        "title": test.title,
        "subject": test.subject,
        "questions": test.questions,
        "total_marks": test.total_marks
    })

@app.route("/api/test/submit", methods=["POST"])
def submit_test():
    data = request.json
    test_id = data.get("test_id")
    student_id = data.get("student_id")
    answers = data.get("answers") # dict: { q_id: answer }
    
    sub = AITestSubmission.query.filter_by(test_id=test_id, student_id=student_id).first()
    if not sub:
        sub = AITestSubmission(test_id=test_id, student_id=student_id)
        db.session.add(sub)
    
    sub.answers = answers
    sub.status = "Submitted"
    sub.submitted_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({"message": "Test submitted successfully.", "submission_id": sub.id})

@app.route("/api/test/evaluate/<submission_id>", methods=["POST"])
def evaluate_submission(submission_id):
    sub = AITestSubmission.query.get(submission_id)
    if not sub: return jsonify({"error": "Submission not found"}), 404
    
    test = sub.test
    if not test: return jsonify({"error": "Test not found"}), 404
    
    total_score = 0
    feedback_segments = []
    
    for q in test.questions:
        q_id = str(q.get("id"))
        student_ans = sub.answers.get(q_id, "").strip()
        correct_ans = q.get("answer", "").strip()
        
        if q.get("type") == "MCQ" or "options" in q:
            if student_ans.lower() == correct_ans.lower():
                total_score += (test.total_marks / len(test.questions))
            else:
                feedback_segments.append(f"Q{q_id}: Expected {correct_ans}, got {student_ans}.")
        else:
            # AI Evaluation for open-ended (Mock Logic)
            if student_ans.lower() == correct_ans.lower():
                total_score += (test.total_marks / len(test.questions))
            elif any(word in student_ans.lower() for word in correct_ans.lower().split()):
                total_score += (test.total_marks / len(test.questions)) * 0.7
                feedback_segments.append(f"Q{q_id}: Good attempt but needs more clarity.")
            else:
                feedback_segments.append(f"Q{q_id}: Answer did not match essential concepts.")

    sub.score = round(total_score, 2)
    sub.marks = round(total_score, 2)
    sub.status = "Evaluated"
    sub.ai_feedback = "\n".join(feedback_segments) if feedback_segments else "Excellent performance! All answers were perfect."
    
    db.session.commit()
    return jsonify({
        "score": sub.score,
        "feedback": sub.ai_feedback,
        "status": sub.status
    })

@app.route("/api/test/results/<test_id>", methods=["GET"])
def get_test_results(test_id):
    subs = AITestSubmission.query.filter_by(test_id=test_id).all()
    results = []
    for s in subs:
        if s.status == "Pending": continue
        student = s.student
        results.append({
            "student_name": student.user.full_name if student and student.user else "Unknown Student",
            "department": student.department if student else "N/A",
            "score": s.score,
            "status": s.status,
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None,
            "accuracy": round((s.score / s.test.total_marks) * 100, 1) if s.test and s.test.total_marks else 0
        })
    
    # Rank list
    results.sort(key=lambda x: x["score"], reverse=True)
    for i, r in enumerate(results): r["rank"] = i + 1
    
    return jsonify({
        "test_title": AITest.query.get(test_id).title if AITest.query.get(test_id) else "Unknown Test",
        "results": results,
        "stats": {
            "total_submitted": len(results),
            "average_score": round(sum(r["score"] for r in results) / len(results), 2) if results else 0,
            "top_score": results[0]["score"] if results else 0
        }
    })

@app.route("/api/test/export/<test_id>", methods=["GET"])
def export_test_pdf(test_id):
    # For now, return JSON representation that the frontend can use to print or 
    # we could generate actual PDF if reportlab is installed correctly.
    # I'll implement a simple text-based generator or just structured data.
    test = AITest.query.get(test_id)
    if not test: return jsonify({"error": "Test not found"}), 404
    
    return jsonify({
        "title": test.title,
        "subject": test.subject,
        "questions": test.questions,
        "export_url": f"/api/test/pdf/{test_id}" # Placeholder for actual PDF file
    })

@app.route("/api/high-achievers/placement-ready", methods=["GET"])
@_cached(ttl=60)
def get_placement_ready():
    """Identify students ready for top companies"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    results = []
    for student in students:
        if not student.user:
            continue
        
        cgpa = student.current_cgpa or 0.0
        career_readiness = student.career_readiness_score or 0.0
        
        # Placement ready if CGPA > 7.5 and career readiness > 6.5
        if cgpa >= 7.5 and career_readiness >= 6.5:
            results.append({
                "id": student.id,
                "name": student.user.full_name,
                "roll_number": student.roll_number or "N/A",
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "cgpa": round(cgpa, 2),
                "career_readiness": round(career_readiness, 2),
                "placement_score": round(((cgpa/10) * 0.5 + (career_readiness/10) * 0.5) * 100, 1),
                "badge": "🎯 Placement Ready"
            })
    
    results.sort(key=lambda x: x["placement_score"], reverse=True)
    return jsonify(results)

@app.route("/api/high-achievers/insights", methods=["GET"])
@_cached(ttl=90)
def get_high_achievers_insights():
    """Generate AI insights for high achievers"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    dept_stats = {}
    for student in students:
        if not student.department:
            continue
        if student.department not in dept_stats:
            dept_stats[student.department] = {"count": 0, "total_cgpa": 0, "placement_ready": 0}
        
        dept_stats[student.department]["count"] += 1
        dept_stats[student.department]["total_cgpa"] += student.current_cgpa or 0
        
        if (student.current_cgpa or 0) >= 7.5 and (student.career_readiness_score or 0) >= 6.5:
            dept_stats[student.department]["placement_ready"] += 1
    
    insights = []
    
    for dept, stats in sorted(dept_stats.items(), key=lambda x: x[1]["total_cgpa"] / max(x[1]["count"], 1), reverse=True)[:3]:
        avg_cgpa = stats["total_cgpa"] / stats["count"]
        insights.append(f"🔥 {dept} achievers show strong placement readiness with avg CGPA of {avg_cgpa:.2f}")
    
    insights.append(f"📊 Total high achievers system analyzing {len(students)} students across {len(dept_stats)} departments")
    
    top_students = sorted(students, key=lambda x: x.current_cgpa or 0, reverse=True)[:3]
    if top_students:
        top_name = top_students[0].user.full_name if top_students[0].user else "Unknown"
        insights.append(f"⭐ Top performer: {top_name} with CGPA {top_students[0].current_cgpa}")
    
    return jsonify(insights)

@app.route("/api/high-achievers/compare", methods=["GET"])
def compare_high_achievers():
    """Compare two students side-by-side"""
    id1 = request.args.get("id1")
    id2 = request.args.get("id2")
    
    if not id1 or not id2:
        return jsonify({"error": "Provide id1 and id2 query params"}), 400
    
    def get_student_comparison_data(sid):
        student = Student.query.get(sid)
        if not student or not student.user:
            return None
        
        cgpa = student.current_cgpa or 0.0
        skill_score = student.career_readiness_score or 0.0
        attendance = random.uniform(80, 98)
        
        return {
            "id": student.id,
            "name": student.user.full_name,
            "roll_number": student.roll_number,
            "department": student.department,
            "year": student.year,
            "cgpa": round(cgpa, 2),
            "skill_score": round(skill_score, 2),
            "attendance": round(attendance, 1),
            "composite": round((cgpa * 0.4 + skill_score * 0.3 + attendance * 0.3), 2)
        }
    
    data1 = get_student_comparison_data(id1)
    data2 = get_student_comparison_data(id2)
    
    if not data1:
        return jsonify({"error": f"Student {id1} not found"}), 404
    if not data2:
        return jsonify({"error": f"Student {id2} not found"}), 404
    
    return jsonify({"student1": data1, "student2": data2})

@app.route("/api/high-achievers/download-report", methods=["GET"])
def download_high_achievers_report():
    """Generate downloadable report"""
    students = Student.query.join(User).filter(User.id != None).all()
    
    report_data = {
        "title": "High Achievers Intelligence Report",
        "generated_at": datetime.utcnow().isoformat(),
        "total_students": len(students),
        "high_achievers": []
    }
    
    high_achievers_list = []
    for student in students:
        if not student.user:
            continue
        
        cgpa = student.current_cgpa or 0.0
        if cgpa >= 8.0:
            high_achievers_list.append({
                "rank": len(report_data["high_achievers"]) + 1,
                "name": student.user.full_name,
                "roll_number": student.roll_number or "N/A",
                "department": student.department or "Unknown",
                "year": student.year or 1,
                "cgpa": round(cgpa, 2),
                "status": "Placement Ready" if cgpa >= 7.5 else "On Track"
            })
    
    high_achievers_list.sort(key=lambda x: x["cgpa"], reverse=True)
    report_data["high_achievers"] = high_achievers_list
    
    return jsonify(report_data)

# ═════════════════════════════════════════════════════════════════════════════
# 🎯 PLACEMENT INTELLIGENCE MODULE - AI-DRIVEN PLACEMENT ANALYTICS
# ═════════════════════════════════════════════════════════════════════════════

COMPANIES = [
    {"name": "Google", "minCGPA": 8.0, "skills": ["Data Structures", "Algorithms", "System Design"], "minReadiness": 8.5},
    {"name": "Microsoft", "minCGPA": 7.8, "skills": ["Cloud Computing", "C++", "Problem Solving"], "minReadiness": 8.0},
    {"name": "Amazon", "minCGPA": 7.5, "skills": ["DSA", "Backend Development", "AWS"], "minReadiness": 7.8},
    {"name": "Meta", "minCGPA": 8.0, "skills": ["React", "System Design", "Algorithms"], "minReadiness": 8.3},
    {"name": "Apple", "minCGPA": 8.2, "skills": ["iOS Development", "Swift", "Design Patterns"], "minReadiness": 8.5},
    {"name": "JPMorgan Chase", "minCGPA": 7.6, "skills": ["Finance", "Java", "SQL"], "minReadiness": 7.9},
    {"name": "Goldman Sachs", "minCGPA": 7.8, "skills": ["Trading Systems", "C++", "Finance"], "minReadiness": 8.1},
    {"name": "Infosys", "minCGPA": 6.5, "skills": ["Java", "Web Development", "Communication"], "minReadiness": 6.8},
    {"name": "TCS", "minCGPA": 6.0, "skills": ["Python", "SQL", "Teamwork"], "minReadiness": 6.5},
    {"name": "Wipro", "minCGPA": 6.5, "skills": ["C#", "Cloud", "Problem Solving"], "minReadiness": 7.0},
]

SKILL_SET = ["Data Structures", "Algorithms", "System Design", "Cloud Computing", "C++", "Python", "Java",
             "JavaScript", "React", "SQL", "Problem Solving", "Communication", "Leadership", "Android Development",
             "iOS Development", "Machine Learning", "Web Development", "Databases", "Networking", "Security"]

def calculate_readiness_score(student: any) -> dict:
    """Calculate placement readiness with AI randomization"""
    cgpa = student.current_cgpa or 0.0
    career_readiness = student.career_readiness_score or 5.0
    
    # Base readiness from CGPA and career score (weighted)
    base_readiness = (cgpa / 10) * 0.5 + (career_readiness / 10) * 0.5
    readiness_score = base_readiness * 10
    
    # Add randomization for realism (±0.5)
    readiness_score += random.uniform(-0.5, 0.5)
    readiness_score = min(10, max(0, readiness_score))  # Clamp 0-10
    
    return {
        "cgpa": round(cgpa, 2),
        "career_readiness": round(career_readiness, 2),
        "readiness_score": round(readiness_score, 2),
        "status": "Ready" if readiness_score >= 7.0 else "In Progress" if readiness_score >= 5.0 else "Needs Improvement"
    }

def get_eligible_companies(readiness: dict) -> list:
    """Get companies where student is eligible"""
    eligible = []
    readiness_score = readiness["readiness_score"]
    cgpa_score = readiness["cgpa"]
    
    for company in COMPANIES:
        if cgpa_score >= company["minCGPA"] and readiness_score >= company["minReadiness"]:
            # Calculate match percentage
            match_pct = min(100, int((readiness_score / company["minReadiness"]) * 100))
            eligible.append({
                "company": company["name"],
                "minCGPA": company["minCGPA"],
                "matchPercentage": match_pct,
                "requiredSkills": company["skills"],
                "placementProbability": round(random.uniform(max(50, match_pct - 20), min(100, match_pct + 10)), 1)
            })
    
    return sorted(eligible, key=lambda x: x["placementProbability"], reverse=True)

def generate_student_skills(student_id: str) -> dict:
    """Generate random but realistic skill proficiencies"""
    random.seed(int(student_id.split('-')[0], 16) % 10000)  # Pseudo-deterministic per student
    skills = random.sample(SKILL_SET, k=random.randint(5, 8))
    skill_data = {}
    for skill in skills:
        skill_data[skill] = round(random.uniform(5, 10), 1)
    return skill_data

@app.route("/api/placement/overview", methods=["GET"])
@_cached(ttl=120)
def get_placement_overview():
    """Placement dashboard overview statistics"""
    try:
        # Get 3rd and 4th year students only
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        total_students = len(students)
        eligible_students = 0
        placed_students = 0
        
        for student in students:
            readiness = calculate_readiness_score(student)
            if readiness["readiness_score"] >= 7.0:
                eligible_students += 1
            if readiness["readiness_score"] >= 8.5:
                placed_students += random.choice([True, False]) if random.random() > 0.3 else False
        
        placement_pct = (placed_students / total_students * 100) if total_students > 0 else 0
        
        return jsonify({
            "total_students": total_students,
            "eligible_students": eligible_students,
            "placed_students": placed_students,
            "placement_percentage": round(placement_pct, 1),
            "average_package": round(random.uniform(600000, 1200000), 0),
            "highest_package": round(random.uniform(2000000, 3500000), 0),
            "companies_hiring": len(COMPANIES)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/student/<student_id>", methods=["GET"])
@_cached(ttl=60)
def get_student_placement_profile(student_id):
    """Get detailed placement profile for a student"""
    try:
        student = Student.query.get(student_id)
        if not student or not student.user:
            return jsonify({"error": "Student not found"}), 404
        
        readiness = calculate_readiness_score(student)
        eligible_companies = get_eligible_companies(readiness)
        skills = generate_student_skills(student_id)
        
        # Identify skill gaps
        all_required = set()
        for co in eligible_companies[:3]:
            all_required.update(co["requiredSkills"])
        
        skill_gaps = []
        for required_skill in all_required:
            if required_skill not in skills:
                skill_gaps.append(required_skill)
        
        return jsonify({
            "name": student.user.full_name,
            "roll_number": student.roll_number or "N/A",
            "department": student.department or "Unknown",
            "year": student.year or 1,
            "email": student.user.email if student.user else "N/A",
            "readiness": readiness,
            "eligible_companies": eligible_companies,
            "skills_proficiency": skills,
            "skill_gaps": skill_gaps,
            "mock_test_score": {
                "aptitude": round(random.uniform(60, 99), 1),
                "coding": round(random.uniform(50, 100), 1),
                "communication": round(random.uniform(65, 95), 1)
            },
            "interview_rounds_cleared": random.randint(0, 4),
            "offers_received": random.randint(0, 3),
            "training_recommendations": [
                f"Improve {skill}" for skill in skill_gaps[:3]
            ] if skill_gaps else ["You're well-prepared!"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/company/<company_name>", methods=["GET"])
@_cached(ttl=90)
def get_company_eligible_students(company_name):
    """Get all students eligible for a specific company"""
    try:
        eligible_students = []
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        company = next((c for c in COMPANIES if c["name"].lower() == company_name.lower()), None)
        if not company:
            return jsonify({"error": "Company not found"}), 404
        
        for student in students:
            readiness = calculate_readiness_score(student)
            if readiness["cgpa"] >= company["minCGPA"] and readiness["readiness_score"] >= company["minReadiness"]:
                match_pct = min(100, int((readiness["readiness_score"] / company["minReadiness"]) * 100))
                eligible_students.append({
                    "id": student.id,
                    "name": student.user.full_name,
                    "roll_number": student.roll_number or "N/A",
                    "department": student.department or "Unknown",
                    "cgpa": readiness["cgpa"],
                    "readiness_score": readiness["readiness_score"],
                    "match_percentage": match_pct,
                    "placement_probability": round(random.uniform(max(50, match_pct - 20), min(100, match_pct + 10)), 1)
                })
        
        eligible_students.sort(key=lambda x: x["placement_probability"], reverse=True)
        
        return jsonify({
            "company": company_name,
            "total_eligible": len(eligible_students),
            "students": eligible_students[:20],
            "company_details": {
                "min_cgpa": company["minCGPA"],
                "required_skills": company["skills"],
                "min_readiness": company["minReadiness"]
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/insights", methods=["GET"])
@_cached(ttl=120)
def get_placement_insights():
    """AI-generated placement insights"""
    try:
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        dept_stats = {}
        for student in students:
            dept = student.department or "Unknown"
            if dept not in dept_stats:
                dept_stats[dept] = {"count": 0, "avg_readiness": 0}
            readiness = calculate_readiness_score(student)
            dept_stats[dept]["count"] += 1
            dept_stats[dept]["avg_readiness"] += readiness["readiness_score"]
        
        for dept in dept_stats:
            dept_stats[dept]["avg_readiness"] /= dept_stats[dept]["count"]
        
        insights = [
            f"🎯 {max(dept_stats, key=lambda x: dept_stats[x]['avg_readiness'])} department shows highest placement readiness.",
            f"📊 Average placement readiness across all students: {sum(d['avg_readiness'] for d in dept_stats.values()) / len(dept_stats):.1f}/10",
            f"🏢 {len(COMPANIES)} companies actively hiring from campus.",
            f"💼 Tech and Finance sectors dominate placements.",
            f"⚡ DSA and System Design are most sought-after skills."
        ]
        
        return jsonify({"insights": insights})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/placed-students", methods=["GET"])
@_cached(ttl=90)
def get_placed_students():
    """Get list of placed students with companies"""
    try:
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        placed = []
        for student in students:
            readiness = calculate_readiness_score(student)
            if readiness["readiness_score"] >= 8.5 and random.random() > 0.4:  # 60% placement probability
                placed.append({
                    "name": student.user.full_name,
                    "roll_number": student.roll_number or "N/A",
                    "department": student.department or "Unknown",
                    "company": random.choice([c["name"] for c in COMPANIES[:5]]),
                    "package": round(random.uniform(600000, 2500000), 0),
                    "cgpa": round(readiness["cgpa"], 2)
                })
        
        return jsonify({
            "total_placed": len(placed),
            "placed_students": sorted(placed, key=lambda x: x["package"], reverse=True)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/skills-gap/<student_id>", methods=["GET"])
@_cached(ttl=60)
def get_skill_gap(student_id):
    """Analyze skill gaps for student"""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        readiness = calculate_readiness_score(student)
        eligible_companies = get_eligible_companies(readiness)
        current_skills = generate_student_skills(student_id)
        
        # Identify what's needed
        required_skills_map = {}
        for company in eligible_companies[:5]:
            for skill in company["requiredSkills"]:
                if skill not in required_skills_map:
                    required_skills_map[skill] = 0
                required_skills_map[skill] += 1
        
        gaps = []
        for skill, frequency in sorted(required_skills_map.items(), key=lambda x: x[1], reverse=True):
            if skill not in current_skills:
                gaps.append({
                    "skill": skill,
                    "current_level": 0,
                    "required_level": 7.0,
                    "required_by_companies": frequency,
                    "estimated_days_to_learn": random.randint(14, 90),
                    "resources": [
                        f"LeetCode - {skill}",
                        f"Udemy Course",
                        f"YouTube Tutorial",
                        f"Practice Project"
                    ]
                })
        
        total_gaps = len(gaps)
        mastered_skills = [s for s in current_skills if current_skills[s] >= 8.0]
        
        return jsonify({
            "student_id": student_id,
            "total_skill_gaps": total_gaps,
            "gaps": gaps,
            "mastered_skills": mastered_skills,
            "recommended_focus": gaps[:3] if gaps else [],
            "estimated_preparation_days": sum(g["estimated_days_to_learn"] for g in gaps[:3]) if gaps else 0
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/prediction/<student_id>", methods=["GET"])
@_cached(ttl=60)
def get_placement_prediction(student_id):
    """AI placement probability prediction"""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        readiness = calculate_readiness_score(student)
        eligible_companies = get_eligible_companies(readiness)
        
        # ML-inspired prediction model
        base_probability = (readiness["readiness_score"] / 10) * 100
        company_factors = len(eligible_companies) * 5
        year_factor = 10 if student.year == 4 else 5
        
        predicted_probability = min(98, max(10, base_probability + company_factors + year_factor + random.uniform(-5, 5)))
        
        # Confidence based on data quality
        confidence = "High" if readiness["readiness_score"] >= 8.0 else "Medium" if readiness["readiness_score"] >= 7.0 else "Low"
        
        # Predict likely companies
        likely_companies = eligible_companies[:3] if eligible_companies else []
        
        return jsonify({
            "student_id": student_id,
            "placement_probability": round(predicted_probability, 1),
            "confidence_level": confidence,
            "likely_companies": [c["company"] for c in likely_companies],
            "readiness_breakdown": {
                "cgpa": readiness["cgpa"],
                "career_readiness": readiness["career_readiness"],
                "overall_score": readiness["readiness_score"]
            },
            "next_steps": [
                "Improve weak skills" if len(likely_companies) < len(COMPANIES) / 2 else "Strong profile!",
                "Practice mock interviews",
                "Build projects",
                "Network with alumni"
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/interview-tracking", methods=["GET"])
@_cached(ttl=90)
def get_interview_tracking():
    """Interview round tracking for placed students"""
    try:
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        interviews = []
        for student in students:
            if random.random() > 0.6:  # 40% have interview data
                readiness = calculate_readiness_score(student)
                rounds_cleared = min(4, int((readiness["readiness_score"] / 10) * 4))
                
                interviews.append({
                    "student_id": student.id,
                    "name": student.user.full_name,
                    "company": random.choice([c["name"] for c in COMPANIES]),
                    "rounds": [
                        {"round": "Online Test", "status": "Cleared", "score": random.randint(70, 100) if rounds_cleared >= 1 else "Not Taken"},
                        {"round": "Group Discussion", "status": "Cleared" if rounds_cleared >= 2 else "Pending", "score": random.randint(7, 10) if rounds_cleared >= 2 else "Pending"},
                        {"round": "Technical Interview", "status": "Cleared" if rounds_cleared >= 3 else "Pending", "score": random.randint(7, 10) if rounds_cleared >= 3 else "Pending"},
                        {"round": "HR Interview", "status": "Cleared" if rounds_cleared >= 4 else "Pending", "score": random.randint(8, 10) if rounds_cleared >= 4 else "Pending"}
                    ],
                    "overall_status": "Offer Received" if rounds_cleared == 4 else f"At Round {rounds_cleared + 1}" if rounds_cleared < 4 else "Not Started",
                    "offer_package": round(random.uniform(600000, 2000000), 0) if rounds_cleared == 4 else None
                })
        
        return jsonify({
            "total_interviews": len(interviews),
            "interview_data": interviews,
            "summary": {
                "offers_received": len([i for i in interviews if i["rounds"][-1]["status"] == "Cleared"]),
                "pending": len([i for i in interviews if i["overall_status"] != "Offer Received"])
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/companies-list", methods=["GET"])
@_cached(ttl=120)
def get_companies_list():
    """Get list of all hiring companies with criteria"""
    try:
        company_list = []
        
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        for company in COMPANIES:
            eligible_count = sum(1 for s in students 
                                if calculate_readiness_score(s)["cgpa"] >= company["minCGPA"] 
                                and calculate_readiness_score(s)["readiness_score"] >= company["minReadiness"])
            
            company_list.append({
                "name": company["name"],
                "min_cgpa": company["minCGPA"],
                "min_readiness": company["minReadiness"],
                "required_skills": company["skills"],
                "eligible_students": eligible_count,
                "average_package": round(random.uniform(600000, 2500000), 0)
            })
        
        return jsonify(sorted(company_list, key=lambda x: x["eligible_students"], reverse=True))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/ranking", methods=["GET"])
@_cached(ttl=90)
def get_placement_ranking():
    """Rank students by placement readiness (3rd-4th year only)"""
    try:
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        ranked = []
        for student in students:
            readiness = calculate_readiness_score(student)
            eligible_companies = get_eligible_companies(readiness)
            
            ranked.append({
                "rank": 0,  # Will assign below
                "student_id": student.id,
                "name": student.user.full_name,
                "department": student.department or "Unknown",
                "year": student.year,
                "cgpa": readiness["cgpa"],
                "readiness_score": readiness["readiness_score"],
                "eligible_companies_count": len(eligible_companies),
                "status": readiness["status"]
            })
        
        # Sort by readiness score
        ranked.sort(key=lambda x: x["readiness_score"], reverse=True)
        
        # Assign ranks
        for idx, student in enumerate(ranked, 1):
            student["rank"] = idx
        
        return jsonify({
            "total_students": len(ranked),
            "top_students": ranked[:20],
            "average_readiness": round(sum(s["readiness_score"] for s in ranked) / len(ranked), 2) if ranked else 0
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/placement/all-students", methods=["GET"])
@_cached(ttl=90)
def get_placement_students():
    """Get all placement-eligible students (3rd-4th year)"""
    try:
        students = Student.query.join(User).filter(
            (Student.year == 3) | (Student.year == 4),
            User.id != None
        ).all()
        
        placement_data = []
        for student in students:
            readiness = calculate_readiness_score(student)
            eligible_companies = get_eligible_companies(readiness)
            
            placement_data.append({
                "id": student.id,
                "name": student.user.full_name,
                "roll_number": student.roll_number or "N/A",
                "department": student.department or "Unknown",
                "year": student.year,
                "cgpa": readiness["cgpa"],
                "readiness_score": readiness["readiness_score"],
                "eligible_companies": len(eligible_companies),
                "top_match": eligible_companies[0]["company"] if eligible_companies else "None",
                "placement_probability": eligible_companies[0]["placementProbability"] if eligible_companies else 0,
                "status": readiness["status"]
            })
        
        placement_data.sort(key=lambda x: x["readiness_score"], reverse=True)
        
        return jsonify({
            "total": len(placement_data),
            "students": placement_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Main ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
