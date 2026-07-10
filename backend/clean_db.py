import database
from sqlalchemy import text

with database.engine.connect() as conn:
    conn.execute(text('SET FOREIGN_KEY_CHECKS = 0;'))
    conn.execute(text('DROP TABLE IF EXISTS study_sessions, tasks, events, materials, modules, enrollments, prerequisites, courses, users, reports, notifications, activity_logs;'))
    conn.execute(text('SET FOREIGN_KEY_CHECKS = 1;'))
    conn.commit()
print("Database cleaned.")
