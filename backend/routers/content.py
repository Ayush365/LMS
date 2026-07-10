import shutil
import os
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/content", tags=["Content"])

@router.post("/modules", response_model=schemas.ModuleResponse)
def create_module(
    module: schemas.ModuleCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.TEACHER, models.UserRole.ADMIN]))
):
    course = crud.get_course(db, module.course_id)
    if not course or (course.owner_id != current_user.id and not current_user.is_admin):
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_module(db, module)

@router.get("/courses/{course_id}/modules", response_model=list[schemas.ModuleResponse])
def get_modules(course_id: int, db: Session = Depends(database.get_db)):
    return crud.get_course_modules(db, course_id)

@router.post("/materials", response_model=schemas.MaterialResponse)
async def upload_material(
    title: str = Form(...),
    material_type: str = Form(...),
    module_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.TEACHER, models.UserRole.ADMIN]))
):
    file_location = f"uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    material_data = schemas.MaterialCreate(
        title=title,
        material_type=material_type,
        file_path=f"/uploads/{file.filename}",
        module_id=module_id
    )
    return crud.create_material(db, material_data)

@router.get("/materials/{material_id}/view")
def view_material(material_id: int, db: Session = Depends(database.get_db)):
    return crud.track_material_view(db, material_id)
