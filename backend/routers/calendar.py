from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

@router.post("/events", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_event(db, event, current_user.id)

@router.get("/events", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == models.UserRole.ADMIN:
        return db.query(models.Event).all()
    return crud.get_user_events(db, current_user.id)
