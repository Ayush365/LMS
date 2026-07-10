import json
import sqlite3 # Or pymysql
from database import SessionLocal
import models

def backup_data():
    db = SessionLocal()
    data = {
        "users": [],
        "courses": [],
        "tasks": []
    }
    
    users = db.query(models.User).all()
    for u in users:
        data["users"].append({"username": u.username, "email": u.email, "role": u.role.value if u.role else "student"})
        
    courses = db.query(models.Course).all()
    for c in courses:
        data["courses"].append({"title": c.title, "dept": c.department})
        
    with open("backup.json", "w") as f:
        json.dump(data, f, indent=4)
    print("Backup saved to backup.json")
    db.close()

if __name__ == "__main__":
    backup_data()
