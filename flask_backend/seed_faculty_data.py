"""
Comprehensive Faculty Analytics Data Seeding Script
Populates Staff, Feedback, and Intervention tables with realistic metrics
"""

import os
import sys
import random
import uuid
from datetime import datetime, timedelta

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, Staff, Student, AcademicRecord, Feedback, Intervention

# Department and skill data
DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "MECH", "AIML", "DS", "AIDS", "BME", "CIVIL", "BT", "EIE"]
SKILLS = [
    "Machine Learning", "Data Structures", "Web Development", "Database Design",
    "Cloud Computing", "VLSI Design", "Signal Processing", "Power Systems",
    "Thermodynamics", "Fluid Mechanics", "Structural Analysis", "Renewable Energy",
    "Biotechnology", "Nanotechnology", "IoT", "Cybersecurity"
]
DESIGNATIONS = ["Assistant Professor", "Associate Professor", "Professor", "Lecturer", "Senior Lecturer"]

POSITIVE_REMARKS = [
    "Exceptional clarity in complex concepts. Students appreciate structured approach.",
    "Highly supportive during laboratory sessions and office hours.",
    "Strong research background reflects well in teaching methodology.",
    "Effective use of modern teaching aids and practical demonstrations.",
    "Students show significant improvement after this faculty's guidance.",
    "Excellent mentoring for academic projects and internships.",
    "Very responsive to student queries and feedback.",
    "Brings real-world industry experience to classroom.",
    "Creates engaging and interactive classroom environment.",
    "Provides comprehensive study materials and resources."
]

NEUTRAL_REMARKS = [
    "Course material could be more updated with latest developments.",
    "Occasionally misses office hours but available via email.",
    "Teaching pace sometimes feels rushed, could slow down.",
    "Lab sessions are adequately managed but could be more engaging.",
    "Students find some topics confusing but eventually understand.",
    "Reasonable attempt at explaining complex topics.",
    "Attendance could be marked more consistently.",
    "Teaching methods are traditional but effective.",
    "Needs more interaction with student feedback.",
    "Assessment criteria could be more transparent."
]

NEGATIVE_REMARKS = [
    "Difficult to follow explanations in lectures.",
    "Poor communication of concepts leading to student confusion.",
    "Lab sessions lack proper supervision and guidance.",
    "Frequently cancels classes or runs out of time.",
    "Assessment seems subjective and unfair at times.",
    "Not responsive to student emails and queries.",
    "Outdated teaching materials and methods.",
    "Limited time and availability for student support.",
    "Course content not aligned with industry standards.",
    "Lacks engagement with student learning outcomes."
]

def seed_faculty_data():
    """Seed comprehensive faculty analytics data"""
    
    with app.app_context():
        print("🔄 Starting Faculty Analytics Data Seeding...")
        
        # Get all staff members from database
        all_staff = db.session.query(Staff).all()
        
        if not all_staff:
            print("❌ No staff found in database. Run main seed first.")
            return
        
        print(f"📊 Found {len(all_staff)} staff members. Enhancing with analytics data...\n")
        
        # Statistics tracking
        stats = {
            "staff_updated": 0,
            "feedback_created": 0,
            "interventions_created": 0,
            "low_performers": [],
            "high_performers": [],
            "avg_rating": 0.0,
            "avg_consistency": 0.0
        }
        
        # 1. Enhance staff with metrics
        print("📈 Step 1: Enhancing Staff with Performance Metrics...")
        
        for staff in all_staff:
            # Assign skill based on department
            dept_skill_map = {
                "CSE": "Data Structures",
                "IT": "Web Development",
                "ECE": "Signal Processing",
                "EEE": "Power Systems",
                "MECH": "Thermodynamics",
                "AIML": "Machine Learning",
                "DS": "Data Science",
                "AIDS": "Artificial Intelligence",
                "BME": "Biomedical Engineering",
                "CIVIL": "Structural Analysis",
                "BT": "Biotechnology",
                "EIE": "Embedded Systems"
            }
            
            staff.primary_skill = dept_skill_map.get(staff.department or "CSE", random.choice(SKILLS))
            
            # Rating: mostly 3.0-4.8, some low performers <3.0
            if random.random() < 0.15:  # 15% low performers
                staff.student_feedback_rating = round(random.uniform(1.5, 2.9), 1)
                stats["low_performers"].append({
                    "name": staff.user.full_name if staff.user else "Unknown",
                    "rating": staff.student_feedback_rating,
                    "department": staff.department
                })
            else:
                staff.student_feedback_rating = round(random.uniform(3.0, 4.8), 1)
                if staff.student_feedback_rating >= 4.5:
                    stats["high_performers"].append({
                        "name": staff.user.full_name if staff.user else "Unknown",
                        "rating": staff.student_feedback_rating,
                        "department": staff.department
                    })
            
            # Consistency score: correlate with rating
            consistency_base = (staff.student_feedback_rating or 3.5) / 5.0
            staff.consistency_score = round(consistency_base * random.uniform(0.8, 1.1), 2)
            staff.consistency_score = min(max(staff.consistency_score, 0.4), 0.95)
            
            # Projects and publications
            staff.projects_completed = random.randint(2, 15)
            staff.publications_count = random.randint(0, 8)
            
            stats["staff_updated"] += 1
        
        db.session.commit()
        
        stats["avg_rating"] = sum(s.student_feedback_rating or 3.5 for s in all_staff) / len(all_staff)
        stats["avg_consistency"] = sum(s.consistency_score or 0.7 for s in all_staff) / len(all_staff)
        
        print(f"✅ Updated {stats['staff_updated']} staff members")
        print(f"   Average Rating: {stats['avg_rating']:.2f}/5.0")
        print(f"   Average Consistency: {stats['avg_consistency']*100:.1f}%")
        print(f"   🌟 High Performers: {len(stats['high_performers'])}")
        print(f"   ⚠️  Low Performers: {len(stats['low_performers'])}\n")
        
        # 2. Create feedback records
        print("💬 Step 2: Generating Student Feedback...")
        
        all_students = db.session.query(Student).limit(1000).all()
        if not all_students:
            print("   ⚠️  No students found, skipping feedback generation")
        else:
            for staff in all_staff:
                if not staff.user:
                    continue
                
                # 10-40 feedback entries per faculty
                feedback_count = random.randint(10, 40)
                
                for _ in range(feedback_count):
                    student = random.choice(all_students)
                    
                    # Determine sentiment based on staff rating
                    rating = staff.student_feedback_rating or 3.5
                    rand = random.random()
                    
                    if rating >= 4.0 and rand < 0.7:  # 70% positive for high-rated
                        remarks = random.choice(POSITIVE_REMARKS)
                        overall = round(random.uniform(4.0, 5.0), 1)
                    elif rating < 3.0 and rand < 0.6:  # 60% negative for low-rated
                        remarks = random.choice(NEGATIVE_REMARKS)
                        overall = round(random.uniform(1.0, 2.5), 1)
                    else:
                        remarks = random.choice(NEUTRAL_REMARKS)
                        overall = round(random.uniform(2.5, 4.0), 1)
                    
                    # Create feedback
                    feedback = Feedback(
                        id=str(uuid.uuid4()),
                        faculty_id=staff.user_id,
                        student_id=student.id,
                        overall_rating=overall,
                        detailed_remarks=remarks,
                        created_at=datetime.utcnow() - timedelta(days=random.randint(1, 180))
                    )
                    db.session.add(feedback)
                    stats["feedback_created"] += 1
            
            db.session.commit()
            print(f"✅ Created {stats['feedback_created']} feedback records\n")
        
        # 3. Create interventions for low performers
        print("🎯 Step 3: Assigning Interventions for Low Performers...")
        
        low_performer_staff = [s for s in all_staff if (s.student_feedback_rating or 3.5) < 3.5]
        
        intervention_types = ["Pedagogy Training", "Mentoring Program", "Curriculum Review", "Student Feedback Workshop"]
        
        for staff in low_performer_staff:
            if not staff.user:
                continue
            
            # 1-3 interventions per low performer
            num_interventions = random.randint(1, 3)
            for _ in range(num_interventions):
                intervention = Intervention(
                    id=str(uuid.uuid4()),
                    faculty_id=staff.user_id,
                    type=random.choice(intervention_types),
                    description=f"Performance improvement program initiated. Current rating: {staff.student_feedback_rating or 0}/5.0",
                    status=random.choice(["Assigned", "In Progress", "Completed"]),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 90))
                )
                db.session.add(intervention)
                stats["interventions_created"] += 1
        
        db.session.commit()
        print(f"✅ Created {stats['interventions_created']} intervention records\n")
        
        # Print summary
        print("=" * 60)
        print("🎓 FACULTY ANALYTICS SEEDING SUMMARY")
        print("=" * 60)
        print(f"✓ Total Staff Processed:     {stats['staff_updated']}")
        print(f"✓ Feedback Records Created:  {stats['feedback_created']}")
        print(f"✓ Interventions Assigned:    {stats['interventions_created']}")
        print(f"✓ Average Faculty Rating:    {stats['avg_rating']:.2f}/5.0")
        print(f"✓ Average Consistency:       {stats['avg_consistency']*100:.1f}%")
        print(f"✓ High Performers (≥4.5):   {len(stats['high_performers'])}")
        print(f"✓ Low Performers (<3.0):     {len(stats['low_performers'])}")
        print("=" * 60)
        
        if stats['low_performers']:
            print("\n⚠️  Low Performers Requiring Attention:")
            for lp in stats['low_performers'][:5]:
                print(f"   • {lp['name']} ({lp['department']}) - Rating: {lp['rating']}/5.0")
        
        if stats['high_performers']:
            print("\n⭐ Top Performers to Recognize:")
            top_5 = sorted(stats['high_performers'], key=lambda x: x['rating'], reverse=True)[:5]
            for hp in top_5:
                print(f"   • {hp['name']} ({hp['department']}) - Rating: {hp['rating']}/5.0")
        
        print("\n✅ Faculty Analytics Data Seeding Complete!\n")


if __name__ == "__main__":
    seed_faculty_data()
