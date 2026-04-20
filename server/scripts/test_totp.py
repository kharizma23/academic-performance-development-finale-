import urllib.request

try:
    r = urllib.request.urlopen('http://localhost:8000/api/totp/setup?identifier=adminkhariz@gmail.com')
    print(r.read().decode())
except Exception as e:
    print(e.code, e.read().decode())
