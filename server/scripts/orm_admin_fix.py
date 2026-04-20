import sys
import os

sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import User, UserRole
from app.auth import get_password_hash

db = SessionLocal()

new_email = 'adminkhariz@gmail.com'
alt_email = 'kharizadmin@gmail.com'
new_pass = 'Sudharaajan2302'
hashed_pass = get_password_hash(new_pass)

try:
    for email in [new_email, alt_email]:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.hashed_password = hashed_pass
            user.plain_password = new_pass
            user.role = UserRole.ADMIN
        else:
            new_user = User(
                email=email,
                institutional_email=email,
                hashed_password=hashed_pass,
                plain_password=new_pass,
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(new_user)
    db.commit()
    print("🔥 ORM MASTER ADMIN CREATED/UPDATED: Sudharaajan2302")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
