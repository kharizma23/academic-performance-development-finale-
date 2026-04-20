import sqlite3
c = sqlite3.connect('student_platform_v2.db')
row = c.execute("SELECT sql FROM sqlite_master WHERE name='staff_v2'").fetchone()
if row:
    print(row[0])
else:
    print("TABLE STAFF_V2 NOT FOUND")
