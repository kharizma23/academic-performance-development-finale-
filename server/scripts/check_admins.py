import sys
import os
sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.models import User
import json

def list_admins():
    db = SessionLocal()
    admins = db.query(User).filter(User.role == "admin").all()
    print(json.dumps([u.email for u in admins]))

if __name__ == "__main__":
    list_admins()
