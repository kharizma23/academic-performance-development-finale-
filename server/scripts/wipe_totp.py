import sqlite3

db_path = "student_platform.db"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET totp_secret = NULL WHERE role = 'ADMIN'")
    conn.commit()
    print("🔥 TOTP SECRET SCRUBBED. USER CAN NOW SEE QR CODE.")
    conn.close()
except Exception as e:
    print(f"❌ ERROR: {e}")
