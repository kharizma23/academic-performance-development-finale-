from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String, primary_key=True)
    full_name = db.Column(db.String)
    email = db.Column(db.String)
    role = db.Column(db.String)
    institutional_email = db.Column(db.String)

class Staff(db.Model):
    __tablename__ = "staff_v2"
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey("users.id"))
    staff_id = db.Column(db.String)
    department = db.Column(db.String)
    designation = db.Column(db.String)
    primary_skill = db.Column(db.String)
    consistency_score = db.Column(db.Float)
    student_feedback_rating = db.Column(db.Float)
    be_degree = db.Column(db.String)
    me_degree = db.Column(db.String)
    projects_completed = db.Column(db.Integer, default=0)
    publications_count = db.Column(db.Integer, default=0)

    user = db.relationship("User", backref=db.backref("staff_profile", uselist=False))

class Student(db.Model):
    __tablename__ = "students_v2"
    id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey("users.id"))
    roll_number = db.Column(db.String)
    department = db.Column(db.String)
    year = db.Column(db.Integer)
    current_cgpa = db.Column(db.Float)
    risk_level = db.Column(db.String)
    career_readiness_score = db.Column(db.Float)
    
    user = db.relationship("User", backref=db.backref("student_profile", uselist=False))

class AcademicRecord(db.Model):
    __tablename__ = "academic_records"
    id = db.Column(db.String, primary_key=True)
    student_id = db.Column(db.String, db.ForeignKey("students_v2.id"))
    subject = db.Column(db.String)
    internal_marks = db.Column(db.Float)
    external_marks = db.Column(db.Float)
    grade = db.Column(db.String)
    attendance_percentage = db.Column(db.Float)

class Feedback(db.Model):
    __tablename__ = "feedback"
    id = db.Column(db.String, primary_key=True)
    faculty_id = db.Column(db.String, db.ForeignKey("users.id"))
    student_id = db.Column(db.String, db.ForeignKey("students_v2.id"))
    overall_rating = db.Column(db.Float)
    detailed_remarks = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    faculty = db.relationship("User", backref=db.backref("received_feedback", lazy=True))
    student = db.relationship("Student", backref=db.backref("feedback_records", lazy=True))

class Intervention(db.Model):
    __tablename__ = "interventions"
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    faculty_id = db.Column(db.String, db.ForeignKey("users.id"))
    type = db.Column(db.String) # Training / Mentoring
    description = db.Column(db.String)
    status = db.Column(db.String, default="Assigned")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AITest(db.Model):
    __tablename__ = "ai_tests"
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String)
    subject = db.Column(db.String)
    topic = db.Column(db.String)
    department = db.Column(db.String)
    year = db.Column(db.Integer)
    questions = db.Column(db.JSON)  # Stores list of question dicts
    total_marks = db.Column(db.Integer, default=100)
    created_by = db.Column(db.String, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AITestSubmission(db.Model):
    __tablename__ = "ai_test_submissions"
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    test_id = db.Column(db.String, db.ForeignKey("ai_tests.id"))
    student_id = db.Column(db.String, db.ForeignKey("students_v2.id"))
    answers = db.Column(db.JSON)  # Stores student answers
    score = db.Column(db.Float, default=0.0)
    marks = db.Column(db.Float, default=0.0) # alias for score
    status = db.Column(db.String, default="Pending") # Pending / Submitted / Evaluated
    ai_feedback = db.Column(db.Text)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    test = db.relationship("AITest", backref=db.backref("submissions", lazy=True))
    student = db.relationship("Student", backref=db.backref("ai_test_attempts", lazy=True))
