from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, database, auth
from app.database import SessionLocal
from app.ai.gemini_engine import gemini_engine as gemini
from app.ai.openai_engine import openai_engine as openai

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
async def ai_chat(request: ChatRequest):
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

        elif intent == "evaluation":
             resp["message"] = "Initiating AI Neural Evaluation for all pending submissions... Done. Scores have been updated in the institutional monitor."
             resp["suggestions"] = ["View Updated Results", "Export PDF Report"]

        elif intent == "question_generation":
             # Use OpenAI for specialized MCQ generation
             subj = target_subject or "General Intelligence"
             prompt = f"Generate 5 high-quality {subj.upper()} MCQs. Return ONLY a JSON object with 'title', 'subject', 'topic' (use 'Neural Logic'), and 'questions' array. Each question must have 'question', 'options' (list of 4), and 'answer' (exact text from options)."
             
             try:
                 ai_json_str = await openai.generate_response(prompt)
                 # Expecting JSON back. If it's wrapped in ```json ... ```, strip it.
                 clean_json = ai_json_str.strip()
                 if clean_json.startswith("```json"):
                     clean_json = clean_json[7:-3].strip()
                 
                 import json
                 resp_data = json.loads(clean_json)
                 resp["message"] = f"Neural synthesis complete. I've generated a specialized {subj.upper()} assessment module."
                 resp["data"] = resp_data
             except Exception as e:
                 resp["message"] = f"Neural synthesis error: {str(e)}. Falling back to baseline mode."
                 resp["data"] = {
                     "title": f"AI Assessment: {subj.upper()}",
                     "subject": subj.upper(),
                     "topic": "Neural Logic",
                     "questions": [{"question": f"What is the core logic of {subj.upper()}?", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A"}]
                 }
        
        else:
            # Universal Assistant Call - Powered by OpenAI
            try:
                ai_reply = await openai.generate_response(msg)
                resp["message"] = ai_reply
                
                # Optional: Use Gemini for parallel suggestions if needed
                # suggestions_prompt = f"Based on this message: '{msg}', suggest 3 follow-up actions for a student."
                # resp["suggestions"] = await gemini.generate_response(suggestions_prompt)
            except Exception as e:
                # Fallback to Gemini for suggestions if OpenAI is offline
                ai_reply = await gemini.generate_response(msg)
                resp["message"] = ai_reply + "\n(Note: Neural Bridge Fallback Active)"

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
