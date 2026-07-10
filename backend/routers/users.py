from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import crud, schemas, database, models
from auth import check_role

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(database.get_db), current_user: models.User = Depends(check_role([models.UserRole.ADMIN, models.UserRole.TEACHER]))):
    return crud.get_users(db)

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(check_role([models.UserRole.ADMIN]))):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
