from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database, models, auth

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview", response_model=schemas.AnalyticsOverviewResponse)
def get_overview(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == models.UserRole.ADMIN:
        return crud.get_analytics_overview(db)
    
    # For students, return their specific stats
    total_tasks = db.query(models.Task).filter(models.Task.assigned_to == current_user.id).count()
    completed_tasks = db.query(models.Task).filter(models.Task.assigned_to == current_user.id, models.Task.status == models.TaskStatus.DONE).count()
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    total_reviews = db.query(models.Report).filter(models.Report.student_id == current_user.id, models.Report.status == models.ReportStatus.REVIEWED).count()
    
    return {
        "total_interns": 1, # Themselves
        "total_tasks": total_tasks,
        "completion_rate": completion_rate,
        "total_reviews": total_reviews
    }

@router.get("/performance", response_model=schemas.AnalyticsPerformanceResponse)
def get_performance(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Mock performance data for both admin and student
    return {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "datasets": [
            {
                "label": "Task Completion",
                "data": [65, 59, 80, 81, 56, 55]
            }
        ]
    }

@router.get("/activity", response_model=List[schemas.ActivityLogResponse])
def get_activity(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # If admin, fetch all, otherwise fetch own
    if current_user.role == models.UserRole.ADMIN:
        return crud.get_activity_logs(db, limit=10)
    return crud.get_activity_logs(db, user_id=current_user.id, limit=10)

@router.get("/student-progress")
def get_student_progress(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))):
    students = db.query(models.User).filter(models.User.role == models.UserRole.STUDENT).all()
    progress = []
    for s in students:
        total = db.query(models.Task).filter(models.Task.assigned_to == s.id).count()
        completed = db.query(models.Task).filter(models.Task.assigned_to == s.id, models.Task.status == models.TaskStatus.DONE).count()
        rate = (completed / total * 100) if total > 0 else 0
        progress.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "total_tasks": total,
            "completed_tasks": completed,
            "completion_rate": rate
        })
    return progress
