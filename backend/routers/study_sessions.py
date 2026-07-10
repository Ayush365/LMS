from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/study-sessions", tags=["Study Sessions"])

@router.post("/", response_model=schemas.StudySessionResponse)
def log_study_session(session: schemas.StudySessionCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    crud.update_user_streak(db, current_user.id)
    return crud.create_study_session(db, session, current_user.id)

@router.get("/", response_model=list[schemas.StudySessionResponse])
def get_study_sessions(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_study_sessions(db, current_user.id)
