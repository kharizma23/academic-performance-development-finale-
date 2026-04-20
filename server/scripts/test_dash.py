import urllib.request
import json
import os
import sys

# Ensure we can import app modules
sys.path.append(os.getcwd())
from app.auth import create_access_token

token = create_access_token(data={"sub": "adminkhariz@gmail.com"})
req = urllib.request.Request('http://localhost:8000/admin/overview')
req.add_header('Authorization', f'Bearer {token}')
try:
    r = urllib.request.urlopen(req)
    print(r.read().decode())
except Exception as e:
    import traceback
    traceback.print_exc()
