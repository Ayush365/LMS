from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    users = crud.get_users(db)
    return {
        "total_users": len(users),
        "total_courses": db.query(models.Course).count(),
        "total_tasks": db.query(models.Task).count()
    }

@router.get("/users", response_model=list[schemas.UserResponse])
def list_users(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    return crud.get_users(db)

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

@router.post("/backup")
def trigger_backup(
    current_user: models.User = Depends(auth.check_role([models.UserRole.ADMIN]))
):
    import subprocess
    try:
        subprocess.run(["python", "backup.py"], check=True)
        return {"message": "Backup successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
