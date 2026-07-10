import models, database, auth
from database import engine, SessionLocal
from datetime import datetime, timedelta

def seed_v2():
    print("Starting Significant Data Seeding...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Get Admin and ABC User
        admin_user = db.query(models.User).filter(models.User.email == "admin@example.com").first()
        abc_user = db.query(models.User).filter(models.User.email == "abc@gmail.com").first()

        if not admin_user:
            print("Admin user not found. Creating...")
            admin_user = models.User(
                name="Admin User",
                email="admin@example.com",
                hashed_password=auth.get_password_hash("1234"),
                role=models.UserRole.ADMIN
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        if not abc_user:
            print("ABC user not found. Creating...")
            abc_user = models.User(
                name="abc",
                email="abc@gmail.com",
                hashed_password=auth.get_password_hash("1234"),
                role=models.UserRole.STUDENT
            )
            db.add(abc_user)
            db.commit()
            db.refresh(abc_user)

        # 2. Create a Teacher
        teacher_user = db.query(models.User).filter(models.User.email == "teacher@example.com").first()
        if not teacher_user:
            print("Creating Teacher...")
            teacher_user = models.User(
                name="Dr. Smith",
                email="teacher@example.com",
                hashed_password=auth.get_password_hash("1234"),
                role=models.UserRole.TEACHER
            )
            db.add(teacher_user)
            db.commit()
            db.refresh(teacher_user)

        # 3. Create Courses
        print("Seeding Courses...")
        course1 = models.Course(
            title="Full Stack Web Development",
            description="Master React, Node.js, and SQL from scratch. Build real-world projects.",
            owner_id=teacher_user.id
        )
        course2 = models.Course(
            title="Data Science and ML",
            description="Learn Python, Pandas, Scikit-Learn and build predictive models.",
            owner_id=admin_user.id
        )
        course3 = models.Course(
            title="UI/UX Design Masterclass",
            description="Principles of design, Figma essentials, and user research techniques.",
            owner_id=teacher_user.id
        )
        db.add_all([course1, course2, course3])
        db.commit()
        db.refresh(course1)
        db.refresh(course2)
        db.refresh(course3)

        # 4. Add Modules and Materials
        print("Seeding Modules and Materials...")
        m1 = models.Module(title="Introduction to React", course_id=course1.id)
        m2 = models.Module(title="Advanced State Management", course_id=course1.id)
        db.add_all([m1, m2])
        db.commit()
        db.refresh(m1)
        
        mat1 = models.Material(title="React Basics PDF", material_type="pdf", file_path="/uploads/react_basics.pdf", module_id=m1.id)
        mat2 = models.Material(title="State Mgmt Video", material_type="video", file_path="/uploads/state.mp4", module_id=m1.id)
        db.add_all([mat1, mat2])

        # 5. Enroll ABC User
        print("Enrolling ABC user...")
        enroll1 = models.Enrollment(user_id=abc_user.id, course_id=course1.id)
        enroll2 = models.Enrollment(user_id=abc_user.id, course_id=course2.id)
        db.add_all([enroll1, enroll2])

        # 6. Add Tasks for ABC
        print("Seeding Tasks...")
        tasks = [
            models.Task(
                title="Finish React Module 1",
                description="Complete the introduction and do the quiz.",
                status=models.TaskStatus.IN_PROGRESS,
                priority=models.TaskPriority.HIGH,
                due_date=datetime.utcnow() + timedelta(days=2),
                assigned_to=abc_user.id,
                created_by=admin_user.id
            ),
            models.Task(
                title="Database Schema Design",
                description="Draft the schema for the final project.",
                status=models.TaskStatus.TODO,
                priority=models.TaskPriority.MEDIUM,
                due_date=datetime.utcnow() + timedelta(days=5),
                assigned_to=abc_user.id,
                created_by=abc_user.id
            ),
            models.Task(
                title="Weekly Sync Meeting",
                description="Prepare progress report for the sync.",
                status=models.TaskStatus.DONE,
                priority=models.TaskPriority.LOW,
                due_date=datetime.utcnow() - timedelta(days=1),
                assigned_to=abc_user.id,
                created_by=admin_user.id
            )
        ]
        db.add_all(tasks)

        # 7. Add Events
        print("Seeding Events...")
        events = [
            models.Event(
                user_id=abc_user.id,
                title="Group Study Session",
                start_time=datetime.utcnow() + timedelta(days=1, hours=10),
                end_time=datetime.utcnow() + timedelta(days=1, hours=12),
                description="Reviewing ML basics."
            ),
            models.Event(
                user_id=admin_user.id,
                title="Admin Policy Review",
                start_time=datetime.utcnow() + timedelta(hours=2),
                end_time=datetime.utcnow() + timedelta(hours=3),
                description="Internal admin meeting."
            )
        ]
        db.add_all(events)

        # 8. Add Reports
        print("Seeding Reports...")
        r1 = models.Report(
            student_id=abc_user.id,
            content="# Week 1 Progress\n\n- Completed React introduction.\n- Setup MySQL database.",
            status=models.ReportStatus.REVIEWED,
            feedback="Excellent progress! Keep focusing on the database normalization.",
            submitted_at=datetime.utcnow() - timedelta(days=3),
            reviewed_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(r1)

        # 9. Add More Users and Data (Requested at least 10 more)
        print("Seeding 10+ extra data entries...")
        extra_users = []
        for i in range(1, 6):
            u = models.User(
                name=f"Student {i}",
                email=f"student{i}@example.com",
                hashed_password=auth.get_password_hash("1234"),
                role=models.UserRole.STUDENT
            )
            extra_users.append(u)
        db.add_all(extra_users)
        db.commit()

        extra_tasks = []
        for u in extra_users:
            extra_tasks.append(models.Task(
                title=f"Initial Setup for {u.name}",
                description="Follow the project setup guide.",
                status=models.TaskStatus.TODO,
                priority=models.TaskPriority.MEDIUM,
                assigned_to=u.id,
                created_by=admin_user.id
            ))
        
        # Add a few more courses
        course4 = models.Course(title="Cloud Architecture", description="AWS, Azure and GCP comparison.", owner_id=admin_user.id)
        course5 = models.Course(title="Cybersecurity Fundamentals", description="Learn how to protect your assets.", owner_id=teacher_user.id)
        db.add_all([course4, course5])
        
        db.add_all(extra_tasks)
        db.commit()
        print("Extra data seeded!")

        db.commit()
        print("Seeding Completed Successfully!")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_v2()
