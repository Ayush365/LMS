import models, schemas, database, auth
from database import engine, SessionLocal
from datetime import datetime, timedelta

def seed_db():
    print("Recreating database tables...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Users...")
        # Demo Users
        admin_user = models.User(
            name="Admin User",
            email="admin@example.com",
            hashed_password=auth.get_password_hash("1234"),
            role=models.UserRole.ADMIN
        )
        db.add(admin_user)

        student_user = models.User(
            name="Student Intern",
            email="student@example.com",
            hashed_password=auth.get_password_hash("1234"),
            role=models.UserRole.STUDENT
        )
        db.add(student_user)

        student_user_2 = models.User(
            name="Another Intern",
            email="intern2@example.com",
            hashed_password=auth.get_password_hash("1234"),
            role=models.UserRole.STUDENT
        )
        db.add(student_user_2)

        db.commit()
        db.refresh(admin_user)
        db.refresh(student_user)

        print("Seeding Tasks...")
        tasks = [
            models.Task(
                title="Onboarding Setup",
                description="Complete environment setup and tool installations.",
                status=models.TaskStatus.DONE,
                priority=models.TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(days=1),
                assigned_to=student_user.id,
                created_by=admin_user.id
            ),
            models.Task(
                title="Frontend Architecture",
                description="Design the initial component structure for the React application.",
                status=models.TaskStatus.IN_PROGRESS,
                priority=models.TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(days=3),
                assigned_to=student_user.id,
                created_by=admin_user.id
            ),
            models.Task(
                title="API Integration",
                description="Connect frontend services to the FastAPI backend.",
                status=models.TaskStatus.TODO,
                priority=models.TaskPriority.MEDIUM,
                due_date=datetime.utcnow() + timedelta(days=5),
                assigned_to=student_user.id,
                created_by=admin_user.id
            ),
            models.Task(
                title="Write Unit Tests",
                description="Add unit tests for the authentication module.",
                status=models.TaskStatus.REVIEW,
                priority=models.TaskPriority.LOW,
                due_date=datetime.utcnow() + timedelta(days=7),
                assigned_to=student_user.id,
                created_by=student_user.id
            )
        ]
        db.add_all(tasks)
        db.commit()

        print("Seeding Reports...")
        reports = [
            models.Report(
                student_id=student_user.id,
                content="# Weekly Progress\n\n- Completed onboarding\n- Started frontend architecture",
                status=models.ReportStatus.REVIEWED,
                feedback="Good start! Make sure to follow the design docs.",
                submitted_at=datetime.utcnow() - timedelta(days=2),
                reviewed_at=datetime.utcnow() - timedelta(days=1)
            ),
            models.Report(
                student_id=student_user.id,
                content="# Day 3 Update\n\nWorking on API integration issues. Need help with CORS.",
                status=models.ReportStatus.PENDING,
                submitted_at=datetime.utcnow()
            )
        ]
        db.add_all(reports)
        db.commit()

        print("Seeding Notifications...")
        notifications = [
            models.Notification(
                user_id=student_user.id,
                message="Welcome to the Learning Platform!",
                is_read=False
            ),
            models.Notification(
                user_id=student_user.id,
                message="Your task 'Onboarding Setup' was marked as Done.",
                is_read=True
            )
        ]
        db.add_all(notifications)
        db.commit()

        print("Seeding Activity Logs...")
        logs = [
            models.ActivityLog(user_id=student_user.id, action="Logged in", timestamp=datetime.utcnow() - timedelta(hours=5)),
            models.ActivityLog(user_id=student_user.id, action="Updated task status", timestamp=datetime.utcnow() - timedelta(hours=4)),
            models.ActivityLog(user_id=admin_user.id, action="Created new task", timestamp=datetime.utcnow() - timedelta(hours=3))
        ]
        db.add_all(logs)
        db.commit()

        print("Seeding Events...")
        events = [
            models.Event(
                user_id=student_user.id,
                title="Sprint Planning",
                start_time=datetime.utcnow() + timedelta(days=2, hours=10),
                end_time=datetime.utcnow() + timedelta(days=2, hours=11),
                description="Planning for the next two weeks."
            ),
            models.Event(
                user_id=admin_user.id,
                title="Board Meeting",
                start_time=datetime.utcnow() + timedelta(days=1, hours=14),
                end_time=datetime.utcnow() + timedelta(days=1, hours=15),
                description="Discussion on project progress."
            )
        ]
        db.add_all(events)
        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
