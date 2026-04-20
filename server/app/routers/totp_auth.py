from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models
import pyotp
import qrcode
import io
import base64

router = APIRouter(
    prefix="/api/totp",
    tags=["totp_auth"]
)

@router.get("/setup")
async def setup_totp(identifier: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    if not user.totp_secret:
        user.totp_secret = pyotp.random_base32()
        db.commit()
    
    totp = pyotp.TOTP(user.totp_secret)
    provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="StudentPlatform")
    
    # Generate QR Code
    img = qrcode.make(provisioning_uri)
    buf = io.BytesIO()
    img.save(buf)
    qr_base64 = base64.b64encode(buf.getvalue()).decode()
    
    return {
        "secret": user.totp_secret,
        "qr_code": f"data:image/png;base64,{qr_base64}",
        "has_totp": True
    }

@router.post("/verify")
async def verify_totp(identifier: str, code: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    
    if not user.totp_secret:
        raise HTTPException(status_code=400, detail="TOTP not configured")
        
    totp = pyotp.TOTP(user.totp_secret)
    if totp.verify(code):
        return {"verified": True}
    else:
        raise HTTPException(status_code=400, detail="Invalid Authenticator Code")

@router.get("/check")
async def check_totp(identifier: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter((models.User.email == identifier) | (models.User.id == identifier)).first()
    if not user: return {"has_totp": False}
    return {"has_totp": bool(user.totp_secret)}
