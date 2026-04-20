from fastapi import APIRouter, HTTPException, Depends
import random
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/interventions", tags=["Intervention Centre"])

# Mock state for institutional demonstration
intervention_db = [
    {
        "id": 1, "student_id": "STU492", "student_name": "Kharizma Elite", 
        "issue": "Low CGPA in DBMS", "risk_level": "HIGH", "status": "Active",
        "assigned_action": "Bridge Program", "progress": 45, "priority": "Urgent",
        "created_at": "2026-03-28"
    },
    {
        "id": 2, "student_id": "STU881", "student_name": "Advaith Aryan", 
        "issue": "Attendance Threshold Warning", "risk_level": "MEDIUM", "status": "Active",
        "assigned_action": "Send Alert", "progress": 0, "priority": "High",
        "created_at": "2026-03-29"
    },
    {
        "id": 3, "student_id": "STU102", "student_name": "Maya Vishwakarma", 
        "issue": "Placement Module Incomplete", "risk_level": "LOW", "status": "Completed",
        "assigned_action": "Schedule Session", "progress": 100, "priority": "Normal",
        "created_at": "2026-03-20"
    }
]

@router.get("/")
async def get_all_interventions():
    """Returns the complete institutional intervention matrix"""
    return intervention_db

@router.post("/create")
async def create_intervention(data: dict):
    """Automatically identifies and creates a new academic intervention node"""
    issue = data.get("issue", "").lower()
    student_name = data.get("studentName", "Institutional Student")
    
    # AI Automatic Action Assignment Logic
    suggested_action = "Mentor"
    if "cgpa" in issue or "grade" in issue:
        suggested_action = "Bridge Program"
    elif "attendance" in issue:
        suggested_action = "Send Alert"
    elif "placement" in issue:
        suggested_action = "Support Session"

    new_id = len(intervention_db) + 1
    new_int = {
        "id": new_id,
        "student_id": data.get("studentId"),
        "student_name": student_name,
        "issue": data.get("issue"),
        "risk_level": data.get("riskLevel", "MEDIUM"),
        "status": "Active",
        "assigned_action": suggested_action,
        "progress": 5 if suggested_action else 0,
        "priority": "Urgent" if data.get("riskLevel") == "HIGH" else "Normal",
        "created_at": datetime.now().strftime("%Y-%m-%d")
    }
    intervention_db.append(new_int)
    return new_int

@router.post("/action")
async def take_intervention_action(data: dict):
    """Assigns an active corrective action to an intervention node"""
    int_id = data.get("interventionId")
    action = data.get("action") # Mentor, Bridge, Session, Alert
    
    for item in intervention_db:
        if item["id"] == int_id:
            item["assigned_action"] = action
            item["status"] = "Active"
            item["progress"] = 10 if action else 0
            return {"success": True, "updated_node": item}
            
    raise HTTPException(status_code=404, detail="Institutional Intervention Node Not Found")

@router.get("/{int_id}")
async def get_intervention_details(int_id: int):
    """Returns exhaustive performance data for a specific intervention"""
    for item in intervention_db:
        if item["id"] == int_id:
            # Enhanced mock detail data
            return {
                **item,
                "history": [
                    {"date": item["created_at"], "event": "Risk Detected (CGPA < 6.0)"},
                    {"date": "2026-03-30", "event": f"Action Assigned: {item['assigned_action']}"}
                ],
                "ai_feedback": "Student exhibits high potential in coding but lacks foundational database normalization theory. Immediate mentor assignment recommended."
            }
    raise HTTPException(status_code=404, detail="Node Not Found")

@router.get("/stats/summary")
async def get_intervention_stats():
    """Returns high-precision institutional intervention summary metrics"""
    return {
        "total": len(intervention_db),
        "active": len([x for x in intervention_db if x["status"] == "Active"]),
        "completed": len([x for x in intervention_db if x["status"] == "Completed"]),
        "failed": len([x for x in intervention_db if x["status"] == "Failed"]),
        "risk_reduction_pct": 28.5,
        "success_rate": 84.2
    }
