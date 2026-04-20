from fastapi import APIRouter, HTTPException, Body
import random
from datetime import datetime

router = APIRouter(prefix="/api/bridge", tags=["Bridge Program"])

# In-memory storage for mock demonstration
bridge_programs = {}

@router.post("/start")
async def start_bridge(data: dict = Body(...)):
    """Initiates a personalized bridge program based on skill gaps"""
    student_id = data.get("studentId")
    domain = data.get("domain")
    
    if not student_id or not domain:
        raise HTTPException(status_code=400, detail="Missing Institutional ID or Domain")

    program_id = f"BR-{random.randint(1000, 9999)}"
    
    # Universal Longitudinal Roadmap Phases
    phases = {
        "cloud": ["Docker Foundation", "Kubernetes Mastery", "Terraform IaC", "CI/CD Pipeline", "AWS/Azure Solutions", "Cloud Monitoring", "Cybersecurity", "System Design"],
        "web": ["Next.js Core", "State Management", "API Architecture", "Performance Opt.", "Auth Systems", "Serverless Functions", "Database Scaling", "Micro-frontends"],
        "data": ["Advanced Python", "Statistical Modeling", "Power BI / Tableau", "Big Data (Spark)", "MLOps Lifecycle", "Data Governance", "Predictive Analytics", "Architecture"]
    }

    selected_phases = phases.get(domain, phases["cloud"])
    roadmap = []
    for i, topic in enumerate(selected_phases):
        roadmap.append({
            "week": i + 1,
            "topic": topic,
            "status": "Pending",
            "tasks": [
                {"id": f"{program_id}-W{i+1}-T1", "label": f"Foundational {topic} Node", "status": "Pending"},
                {"id": f"{program_id}-W{i+1}-T2", "label": f"Verified {topic} Implementation", "status": "Pending"}
            ],
            "resource": f"https://institutional-learning.edu/course/{topic.lower().replace(' ', '-')}"
        })

    program_data = {
        "programId": program_id,
        "studentId": student_id,
        "studentName": "Kharizma Administrative Elite",
        "domain": domain,
        "domainTitle": "Cloud Architecture & DevOps" if domain == "cloud" else "Modern Fullstack" if domain == "web" else "Data Analytics",
        "status": "Active",
        "startDate": datetime.now().strftime("%Y-%m-%d"),
        "progress": 0,
        "roadmap": roadmap,
        "ai_suggestion": "Concentrate on Week 1 fundamentals before attempting Week 3 complex orchestrations."
    }
    
    bridge_programs[program_id] = program_data
    return {"programId": program_id}

@router.get("/{program_id}")
async def get_bridge_program(program_id: str):
    """Fetches full state of a specific bridge program"""
    if program_id not in bridge_programs:
        # For demo, if not found, create a mock one so the page works
        return {
            "programId": program_id,
            "studentId": "STU492",
            "studentName": "Mock Administrator",
            "domain": "cloud",
            "domainTitle": "Cloud Architecture & DevOps",
            "status": "Active",
            "startDate": "2026-03-30",
            "progress": 25,
            "roadmap": [
                {
                    "week": 1, "topic": "Kubernetes", "status": "Completed", 
                    "tasks": [{"id": "1", "label": "K8s Architecture", "status": "Completed"}],
                    "resource": "#"
                },
                {
                    "week": 2, "topic": "Docker", "status": "Pending", 
                    "tasks": [{"id": "2", "label": "Containerization", "status": "Pending"}],
                    "resource": "#"
                }
            ],
            "ai_suggestion": "DNA analysis suggests high affinity for Step 2; proceed with intensity."
        }
    return bridge_programs[program_id]

@router.get("/resources/{topic}")
async def get_bridge_resources(topic: str):
    """Returns curated learning resources for a specific roadmap topic"""
    # URL-Safe high-precision institutional asset mapping
    resources = {
        "docker-foundation": {
            "title": "Docker Foundation",
            "video": "https://www.youtube.com/embed/pTFZFxd4hZ0",
            "pdf": "https://institutional-docs.edu/docker-foundation.pdf",
            "practice": "https://institutional-labs.edu/docker-playground"
        },
        "kubernetes-mastery": {
            "title": "Kubernetes Mastery",
            "video": "https://www.youtube.com/embed/X48VuDVv0do",
            "pdf": "https://institutional-docs.edu/k8s-mastery.pdf",
            "practice": "https://institutional-labs.edu/k8s-interactive"
        },
        "terraform-iac": {
            "title": "Terraform IaC",
            "video": "https://www.youtube.com/embed/h970ZBgKINg",
            "pdf": "https://institutional-docs.edu/terraform-iac.pdf",
            "practice": "https://institutional-labs.edu/iac-sandbox"
        },
        "ci-cd-pipeline": {
            "title": "CI/CD Pipeline",
            "video": "https://www.youtube.com/embed/scEDHsr3fSY",
            "pdf": "https://institutional-docs.edu/cicd-pipelines.pdf",
            "practice": "https://institutional-labs.edu/pipeline-builder"
        },
        "aws-azure-solutions": {
            "title": "AWS/Azure Solutions",
            "video": "https://www.youtube.com/embed/UlzeX4Ye-M8",
            "pdf": "https://institutional-docs.edu/cloud-solutions.pdf",
            "practice": "https://institutional-labs.edu/cloud-architect"
        },
        "cloud-monitoring": {
            "title": "Cloud Monitoring",
            "video": "https://www.youtube.com/embed/h43Tf39S3lU",
            "pdf": "https://institutional-docs.edu/monitoring.pdf",
            "practice": "https://institutional-labs.edu/observability"
        },
        "cybersecurity": {
            "title": "Cybersecurity",
            "video": "https://www.youtube.com/embed/k9WkL3UvC-8",
            "pdf": "https://institutional-docs.edu/cyber-security.pdf",
            "practice": "https://institutional-labs.edu/red-team"
        },
        "system-design": {
            "title": "System Design",
            "video": "https://www.youtube.com/embed/i7ABlHnscbc",
            "pdf": "https://institutional-docs.edu/system-design.pdf",
            "practice": "https://institutional-labs.edu/architect-pro"
        }
    }
    # Path-safe institutional lookup
    safe_topic = topic.lower().replace(' ', '-').replace('/', '-')
    return resources.get(safe_topic, resources["docker-foundation"])

@router.post("/update-task")
async def update_bridge_task(data: dict = Body(...)):
    """Updates task status and recalibrates institutional progress %"""
    program_id = data.get("programId")
    task_id = data.get("taskId")
    status = data.get("status")
    
    if program_id in bridge_programs:
        program = bridge_programs[program_id]
        total_tasks = 0
        completed_tasks = 0
        
        # Recalibrate task status in the roadmap
        for week in program["roadmap"]:
            for task in week["tasks"]:
                total_tasks += 1
                if task["id"] == task_id:
                    task["status"] = status
                if task["status"] == "Completed":
                    completed_tasks += 1
        
        # Calculate dynamic progress
        new_progress = round((completed_tasks / total_tasks) * 100)
        program["progress"] = new_progress
        
        # Persist status in the week headers
        for week in program["roadmap"]:
            all_week_done = all(t["status"] == "Completed" for t in week["tasks"])
            week["status"] = "Completed" if all_week_done else "In Progress" if any(t["status"] == "Completed" for t in week["tasks"]) else "Pending"

        return {"success": True, "new_progress": new_progress, "program": program}
    
    raise HTTPException(status_code=404, detail="Institutional Bridge Node Not Found")
