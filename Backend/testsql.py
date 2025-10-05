import sqlite3

db_path = "db.sqlite3"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("select * from users_user;")
# cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
rows = cursor.fetchall()
for row in rows:
    print(row)


conn.close()
