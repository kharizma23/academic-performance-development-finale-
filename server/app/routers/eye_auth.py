from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/eye",
    tags=["eye_auth"]
)

class EyeRequest(BaseModel):
    identifier: str
    blink_count: int

@router.get("/check")
def check_eye_status(identifier: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user:
        return {"enrolled": False}
    return {"enrolled": user.has_eye_enrolled}

@router.post("/register")
def register_eye(req: EyeRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == req.identifier) | (models.User.id == req.identifier)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if req.blink_count < 3:
        raise HTTPException(status_code=400, detail="Insufficient blink samples for biometric lock")
    
    user.has_eye_enrolled = True
    db.commit()
    return {"message": "Retinal Bio-Lock synchronized successfully"}

@router.post("/verify")
def verify_eye(req: EyeRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == req.identifier) | (models.User.id == req.identifier)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.has_eye_enrolled:
        raise HTTPException(status_code=403, detail="Retinal profile node not found. Please enroll first.")
    
    if req.blink_count >= 3:
        return {"verified": True}
    return {"verified": False}
