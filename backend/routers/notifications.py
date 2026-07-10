from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas, database, models, auth

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[schemas.NotificationResponse])
def get_notifications(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_notifications(db, user_id=current_user.id)

@router.patch("/{notif_id}/read", response_model=schemas.NotificationResponse)
def mark_read(notif_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_notif = crud.update_notification_read(db, notif_id)
    if not db_notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notif
