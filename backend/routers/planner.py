from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/planner", tags=["Planner"])

@router.get("/daily")
def get_daily_plan(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    tasks = crud.get_tasks(db, current_user.id)
    incomplete_tasks = [t for t in tasks if not t.is_completed]
    incomplete_tasks.sort(key=lambda x: (x.deadline is None, x.deadline))
    
    return {
        "recommended_tasks": incomplete_tasks[:5],
        "total_estimated_hours": sum([t.estimated_hours for t in incomplete_tasks[:5] if t.estimated_hours])
    }
