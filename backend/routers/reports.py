from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database, models, auth

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("", response_model=List[schemas.ReportResponse])
def get_reports(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == models.UserRole.ADMIN:
        return crud.get_reports(db)
    return crud.get_reports(db, user_id=current_user.id)

@router.post("", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_report(db=db, report=report, user_id=current_user.id)

@router.post("/{report_id}/review", response_model=schemas.ReportResponse)
def provide_feedback(report_id: int, feedback: schemas.ReportFeedback, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))):
    db_report = crud.review_report(db, report_id, feedback.feedback, reviewer_id=current_user.id)
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report

@router.post("/upload")
def upload_report_file():
    # Mock file upload
    return {"message": "File uploaded successfully"}
