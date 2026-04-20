from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models
import random
import string
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/otp",
    tags=["otp_auth"]
)

@router.post("/send")
async def send_otp(identifier: str, phone: str = "", db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    # Generate 6-digit OTP
    otp = "".join(random.choices(string.digits, k=6))
    user.otp_code = otp
    user.otp_expiry = datetime.now() + timedelta(minutes=10)
    db.commit()
    
    # In a real app, integrate with Twilio/Msg91 here
    # For now, we simulate sending and log it
    print(f"\x1b[32m[SMS] Sending OTP {otp} to {phone or 'Registered Device'}\x1b[0m")
    
    return {"message": "OTP sent successfully", "status": "sent", "debug_code": otp} # Debug code for AI testing

@router.post("/verify")
async def verify_otp(identifier: str, code: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    # Check if code is correct and not expired
    if not user.otp_code:
        raise HTTPException(status_code=400, detail="No OTP requested")
        
    if user.otp_code == code:
        if datetime.now() > user.otp_expiry:
            raise HTTPException(status_code=400, detail="OTP expired")
        
        # Clear OTP after successful use
        user.otp_code = None
        user.otp_expiry = None
        db.commit()
        return {"verified": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
