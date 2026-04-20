import sys, os
sys.path.append(os.getcwd())
from app import database, auth

db = next(database.get_db())
try:
    user = auth.authenticate_user(db, 'adminkhariz@gmail.com', 'Sudharaajan2302')
    print("Authenticated user:", user.email if user else "None")
except Exception as e:
    import traceback
    traceback.print_exc()
