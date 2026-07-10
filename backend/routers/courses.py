from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import auth, crud, schemas, database, models

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/", response_model=schemas.CourseResponse)
def create_course(
    course: schemas.CourseCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.TEACHER, models.UserRole.ADMIN]))
):
    return crud.create_course(db=db, course=course, user_id=current_user.id)

@router.get("/", response_model=list[schemas.CourseResponse])
def read_courses(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Students see enrolled, Teachers see owned
    if current_user.role == models.UserRole.TEACHER:
        return crud.get_courses_by_owner(db, user_id=current_user.id)
    return crud.get_enrolled_courses(db, user_id=current_user.id)

@router.get("/all", response_model=list[schemas.CourseResponse])
def read_all_courses(db: Session = Depends(database.get_db)):
    # Catalog view
    return crud.get_courses(db)

@router.get("/{course_id}", response_model=schemas.CourseResponse)
def read_course(course_id: int, db: Session = Depends(database.get_db)):
    course = crud.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/{course_id}/enroll")
def enroll_in_course(course_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.enroll_student(db, user_id=current_user.id, course_id=course_id)

@router.delete("/{course_id}")
def delete_course(
    course_id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.check_role([models.UserRole.TEACHER, models.UserRole.ADMIN]))
):
    course = crud.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if course.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this course")
    return crud.delete_course(db, course_id)
