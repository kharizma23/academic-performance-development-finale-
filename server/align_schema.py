from sqlalchemy import create_engine, inspect, text
import os

# Align this with database.py
DATABASE_URL = "sqlite:///./student_platform_final.db"
engine = create_engine(DATABASE_URL)

def fix_schema():
    print(f"Connecting to {DATABASE_URL}...")
    inspector = inspect(engine)
    
    # Tables to check
    tables = ["users", "students_v2", "staff_v2", "academic_records", "ai_scores", "skills", "feedback", "todos", "study_plans", "remedial_assessments", "subjects", "subject_resources"]
    
    # We'll just check students_v2 for now as it's the most likely culprit
    target_table = "students_v2"
    columns = [c['name'] for c in inspector.get_columns(target_table)]
    
    model_columns = {
        "admin_notes": "TEXT",
        "risk_reason": "TEXT",
        "backlog_details": "TEXT",
        "school_11th": "TEXT",
        "school_12th": "TEXT",
        "area_of_interest": "TEXT",
        "cgpa_trend": "TEXT",
        "ai_suggestion": "TEXT",
        "faculty_feedback": "TEXT",
        "placement_analysis": "TEXT",
        "weak_areas": "TEXT",
        "last_completion_date_new": "DATETIME", # to avoid conflicts
    }
    
    with engine.connect() as conn:
        for col, col_type in model_columns.items():
            if col not in columns:
                try:
                    print(f"Adding column {col} to {target_table}...")
                    conn.execute(text(f"ALTER TABLE {target_table} ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception as e:
                    print(f"Error adding {col}: {e}")

    print("Schema alignment complete.")

if __name__ == "__main__":
    fix_schema()
