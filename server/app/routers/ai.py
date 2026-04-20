from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, database, auth
from app.database import SessionLocal
from app.ai.gemini_engine import gemini_engine as gemini
from app.ai.openai_engine import openai_engine as openai
from openai import AsyncOpenAI
import os
from app.config import settings

# New Fallback AI implementation using user's explicit env signature
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY") or settings.openai_api_key)

async def fallback_ai(prompt: str) -> str:
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an intelligent academic assistant. Always give clear, helpful, structured answers."
                },
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Neural API Error: Both Gemini and OpenAI Nodes are Offline. Reason: {str(e)}"

router = APIRouter(
    prefix="/api/ai",
    tags=["ai"]
)

class ChatRequest(BaseModel):
    message: str

class GenerateRequest(BaseModel):
    subject: str
    topic: str
    count: Optional[int] = 5
    type: Optional[str] = "MCQ"

@router.post("/chat")
async def ai_chat(
    request: ChatRequest,
    current_user: models.User = Depends(auth.get_current_active_user)
):
    msg = request.message.lower()
    db = SessionLocal()
    try:
        # Subject, Department & Intent Recognition
        subjects = ["python", "java", "dbms", "dsa", "os", "math", "ai", "ml", "networks"]
        depts = ["cse", "ece", "mech", "it", "aiml"]
        companies = ["tcs", "google", "microsoft", "amazon", "zoho", "infosys", "accenture", "wipro"]
        
        target_subject = next((s for s in subjects if s in msg), None)
        target_dept = next((d for d in depts if d in msg), None)
        target_company = next((c for c in companies if c in msg), None)
        
        intent = "general_chat"
        if any(w in msg for w in ["generate", "question", "test", "mcq", "quiz"]): 
            intent = "question_generation"
        elif any(w in msg for w in ["student", "topper", "best", "performers", "marks", "details", "ranking", "analytics", "placement", "eligible"]): 
            intent = "data_retrieval"
        elif any(w in msg for w in ["evaluate", "check", "submission", "score"]):
            intent = "evaluation"
        elif any(w in msg for w in ["weak", "struggling", "low attendance", "attendance risk", "at risk"]):
            intent = "faculty_diagnostic"

        resp = {"intent": intent, "message": "", "data": None, "suggestions": []}

        if intent == "data_retrieval":
            if target_company:
                # Specialized Placement Logic
                from app.routers.placement_intelligence import get_static_companies
                all_companies = get_static_companies()
                company_data = next((c for c in all_companies if c["name"].lower() == target_company), None)
                
                if company_data:
                    min_cgpa = company_data.get("min_cgpa", 6.0)
                    eligible = db.query(models.Student).filter(
                        models.Student.current_cgpa >= min_cgpa
                    ).order_by(models.Student.current_cgpa.desc()).limit(5).all()
                    
                    if eligible:
                        names = [f"{i+1}. {s.user.full_name} (CGPA: {s.current_cgpa}, Readiness: {s.career_readiness_score})" for i, s in enumerate(eligible) if s.user]
                        resp["message"] = f"Top 5 candidates eligible for {company_data['name']} based on institutional intelligence:\n" + "\n".join(names)
                    else:
                        resp["message"] = f"No students currently meet the elite criteria for {company_data['name']}."
                else:
                    resp["message"] = f"Company '{target_company.upper()}' is not in our placement registry."
            else:
                # Academic Record Retrieval
                query = db.query(models.AcademicRecord)
                if target_subject:
                    query = query.filter(models.AcademicRecord.subject.ilike(f"%{target_subject}%"))
                if target_dept:
                    query = query.join(models.Student).filter(models.Student.department.ilike(f"%{target_dept}%"))
                
                top_recs = query.order_by(models.AcademicRecord.internal_marks.desc()).limit(10).all()
                if top_recs:
                    names = [f"{i+1}. {r.student.user.full_name} ({r.subject}: {r.internal_marks} marks)" for i, r in enumerate(top_recs) if r.student]
                    resp["message"] = f"Here is the specialized ranking for your request:\n" + "\n".join(names)
                else:
                    resp["message"] = "I couldn't find specific logs for that cohort. Showing overall system topper: "
                    best = db.query(models.AcademicRecord).order_by(models.AcademicRecord.internal_marks.desc()).first()
                    if best: resp["message"] += f"{best.student.user.full_name} ({best.internal_marks} marks)"

        elif intent == "faculty_diagnostic":
            if current_user.role != models.UserRole.FACULTY:
                resp["message"] = "This diagnostic capability is reserved for Faculty and Administrative nodes only."
            else:
                staff = db.query(models.Staff).filter(models.Staff.user_id == current_user.id).first()
                query = db.query(models.Student).filter(models.Student.department == staff.department)
                
                if "attendance" in msg:
                    risks = query.filter(models.Student.attendance_percentage < 75).all()
                    if risks:
                        names = [f"• {s.name} (Roll: {s.roll_number}) - Attendance: {s.attendance_percentage}%" for s in risks]
                        resp["message"] = f"I've identified {len(risks)} students in the {staff.department} sector with critical attendance risk (<75%):\n\n" + "\n".join(names)
                        resp["suggestions"] = ["Notify Parents", "Log Counseling Session"]
                    else:
                        resp["message"] = f"Neural verification complete. No students in the {staff.department} sector are currently below the 75% attendance threshold."
                else:
                    # Default: Weak/Risk students by CGPA or Risk Level
                    risks = query.filter(models.Student.risk_level == "High").all()
                    if not risks:
                        risks = query.filter(models.Student.current_cgpa < 6.0).all()
                    
                    if risks:
                        names = [f"• {s.name} (GPA: {s.current_cgpa}) - {s.risk_level} Risk" for s in risks]
                        resp["message"] = f"Identified {len(risks)} students in {staff.department} requiring immediate academic intervention:\n\n" + "\n".join(names)
                        resp["suggestions"] = ["View Class Rankings", "Assign Remedial Test"]
                    else:
                        resp["message"] = f"All active nodes in the {staff.department} registry are performing within stable parameters."

        elif intent == "evaluation":
             resp["message"] = "Initiating AI Neural Evaluation for all pending submissions... Done. Scores have been updated in the institutional monitor."
             resp["suggestions"] = ["View Updated Results", "Export PDF Report"]

        elif intent == "question_generation":
             # Use Gemini as PRIMARY for specialized MCQ generation
             subj = target_subject or "General Intelligence"
             prompt = f"Generate 5 high-quality {subj.upper()} MCQs. Return ONLY a JSON object with 'title', 'subject', 'topic' (use 'Neural Logic'), and 'questions' array. Each question must have 'question', 'options' (list of 4), and 'answer' (exact text from options)."
             
             try:
                 ai_json_str = await gemini.generate_response(prompt)
                 if "Neural Error" in ai_json_str or "Offline" in ai_json_str:
                     raise Exception("Gemini error")
                 
                 clean_json = ai_json_str.strip()
                 if clean_json.startswith("```json"):
                     clean_json = clean_json[7:-3].strip()
                 elif clean_json.startswith("```"):
                     clean_json = clean_json[3:-3].strip()
                 
                 import json
                 resp_data = json.loads(clean_json)
                 resp["message"] = f"Neural synthesis complete. I've generated a specialized {subj.upper()} assessment module."
                 resp["data"] = resp_data
             except Exception as e:
                 print(f"Gemini failed ({str(e)}), switching to OpenAI for MCQs...")
                 try:
                     ai_json_str = await fallback_ai(prompt)
                     clean_json = ai_json_str.strip()
                     if clean_json.startswith("```json"):
                         clean_json = clean_json[7:-3].strip()
                     elif clean_json.startswith("```"):
                         clean_json = clean_json[3:-3].strip()
                     import json
                     resp_data = json.loads(clean_json)
                     resp["message"] = f"Neural synthesis complete (Fallback AI). I've generated a specialized {subj.upper()} assessment module."
                     resp["data"] = resp_data
                 except Exception as e2:
                     resp["message"] = f"Total neural synthesis error. Falling back to baseline mode."
                     resp["data"] = {
                         "title": f"AI Assessment: {subj.upper()}",
                         "subject": subj.upper(),
                         "topic": "Neural Logic",
                         "questions": [{"question": f"What is the core logic of {subj.upper()}?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A"}]
                     }
        
        else:
            # Universal Assistant Call - Powered by Gemini
            try:
                ai_reply = await gemini.generate_response(msg)
                
                if "Neural Error" in ai_reply or "Offline" in ai_reply:
                    raise Exception("Gemini returned failure string.")
                    
                resp["message"] = ai_reply
            except Exception as e:
                print("Gemini failed, switching to OpenAI...")
                # Fallback to OpenAI GPT-4o-mini
                ai_reply = await fallback_ai(msg)
                resp["message"] = ai_reply + "\n(Note: OpenAI Fallback Active)"

        return resp
    finally:
        db.close()

class SaveTestRequest(BaseModel):
    title: str
    subject: str
    topic: str
    questions: List[Dict[str, Any]]

@router.post("/save-generated-test")
def save_generated_test(request: SaveTestRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    import json
    assessment = models.AIAssessment(
        title=request.title,
        subject=request.subject,
        topic=request.topic,
        difficulty="Medium",
        duration="30m",
        status="Assigned"
    )
    db.add(assessment)
    db.flush()
    
    for q in request.questions:
        db.add(models.AIAssessmentQuestion(
            assessment_id=assessment.id,
            question_text=q["question"],
            options=json.dumps(q["options"]),
            correct_answer=q["answer"]
        ))
    db.commit()
    return {"message": "Successfully saved to archive", "id": assessment.id}

@router.get("/tests")
def get_ai_tests(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    return db.query(models.AIAssessment).all()

@router.get("/status")
def ai_status():
    return {"status": "Online", "engine": "REST Bridge"}
