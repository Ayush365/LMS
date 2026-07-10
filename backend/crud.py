from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
import auth

# --- Users ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    # Check if this is the first user, make them admin if so
    role = user.role
    if db.query(models.User).count() == 0:
        role = models.UserRole.ADMIN
    
    db_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

# --- Tasks ---
def get_tasks(db: Session, user_id: int = None):
    query = db.query(models.Task)
    if user_id is not None:
        query = query.filter((models.Task.assigned_to == user_id) | (models.Task.created_by == user_id))
    return query.all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.model_dump(), created_by=user_id)
    if not db_task.assigned_to:
        db_task.assigned_to = user_id
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    log_activity(db, user_id, f"Created task: {task.title}")
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        update_data = task_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
        log_activity(db, user_id, f"Updated task: {db_task.title}")
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        log_activity(db, user_id, f"Deleted task: {db_task.title}")
    return db_task

# --- Reports ---
def get_reports(db: Session, user_id: int = None):
    query = db.query(models.Report)
    if user_id is not None:
        query = query.filter(models.Report.student_id == user_id)
    return query.all()

def create_report(db: Session, report: schemas.ReportCreate, user_id: int):
    db_report = models.Report(**report.model_dump(), student_id=user_id)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    log_activity(db, user_id, "Submitted a report")
    return db_report

def review_report(db: Session, report_id: int, feedback: str, reviewer_id: int):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if db_report:
        db_report.feedback = feedback
        db_report.status = models.ReportStatus.REVIEWED
        db_report.reviewed_at = datetime.utcnow()
        db.commit()
        db.refresh(db_report)
        log_activity(db, reviewer_id, f"Reviewed report {report_id}")
        create_notification(db, db_report.student_id, f"Your report has been reviewed")
    return db_report

# --- Notifications ---
def get_notifications(db: Session, user_id: int):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.id.desc()).all()

def create_notification(db: Session, user_id: int, message: str):
    db_notif = models.Notification(user_id=user_id, message=message)
    db.add(db_notif)
    db.commit()
    db.refresh(db_notif)
    return db_notif

def update_notification_read(db: Session, notif_id: int):
    db_notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if db_notif:
        db_notif.is_read = True
        db.commit()
        db.refresh(db_notif)
    return db_notif

# --- Activity Logs ---
def log_activity(db: Session, user_id: int, action: str):
    db_log = models.ActivityLog(user_id=user_id, action=action)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_activity_logs(db: Session, user_id: int = None, limit: int = 50):
    query = db.query(models.ActivityLog)
    if user_id is not None:
        query = query.filter(models.ActivityLog.user_id == user_id)
    return query.order_by(models.ActivityLog.timestamp.desc()).limit(limit).all()

# --- Analytics ---
def get_analytics_overview(db: Session):
    total_interns = db.query(models.User).filter(models.User.role == models.UserRole.STUDENT).count()
    total_tasks = db.query(models.Task).count()
    completed_tasks = db.query(models.Task).filter(models.Task.status == models.TaskStatus.DONE).count()
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    total_reviews = db.query(models.Report).filter(models.Report.status == models.ReportStatus.REVIEWED).count()
    
    return {
        "total_interns": total_interns,
        "total_tasks": total_tasks,
        "completion_rate": completion_rate,
        "total_reviews": total_reviews
    }

# --- Events ---
def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(**event.model_dump(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    log_activity(db, user_id, f"Added event: {event.title}")
    return db_event

def get_user_events(db: Session, user_id: int):
    return db.query(models.Event).filter(models.Event.user_id == user_id).all()
