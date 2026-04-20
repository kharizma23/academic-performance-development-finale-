import sys
import os
import asyncio

sys.path.append(os.getcwd())

from app.database import SessionLocal
from app.routers import totp_auth

async def main():
    db = SessionLocal()
    try:
        res = await totp_auth.setup_totp('adminkhariz@gmail.com', db)
        print("RESULT", res)
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

asyncio.run(main())
