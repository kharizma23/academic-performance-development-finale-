import sqlite3
c = sqlite3.connect('student_platform_v2.db')
for t in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall():
    count = c.execute(f"SELECT count(*) FROM {t[0]}").fetchone()[0]
    print(f"{t[0]}: {count}")
