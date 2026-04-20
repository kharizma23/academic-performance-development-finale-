import sqlite3

c = sqlite3.connect('student_platform.db')
row = c.execute("SELECT totp_secret FROM users WHERE email='adminkhariz@gmail.com'").fetchone()

if row and row[0] is not None:
    print(f"SECRET EXISTS: {row[0]}")
    c.execute("UPDATE users SET totp_secret = NULL WHERE email='adminkhariz@gmail.com'")
    c.commit()
    print("WIPED SECRET. READY FOR SCAN.")
else:
    if not row:
        print("ADMIN NOT FOUND!")
    else:
        print("SECRET IS ALREADY NULL! READY FOR SCAN.")
