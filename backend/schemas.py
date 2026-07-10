from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class TaskStatus(str, enum.Enum):
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    DONE = "Done"

class TaskPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class ReportStatus(str, enum.Enum):
    PENDING = "Pending"
    REVIEWED = "Reviewed"

# --- Token ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.STUDENT

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# --- Task ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.TODO
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    created_by: int
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- Report ---
class ReportBase(BaseModel):
    content: str

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    student_id: int
    feedback: Optional[str] = None
    status: ReportStatus
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReportFeedback(BaseModel):
    feedback: str

# --- Notification ---
class NotificationBase(BaseModel):
    message: str
    is_read: bool = False

class NotificationResponse(NotificationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool

# --- Activity Log ---
class ActivityLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Analytics ---
class AnalyticsOverviewResponse(BaseModel):
    total_interns: int
    total_tasks: int
    completion_rate: float
    total_reviews: int

class AnalyticsPerformanceResponse(BaseModel):
    labels: List[str]
    datasets: List[dict]

# --- Event ---
class EventBase(BaseModel):
    title: str
    start_time: datetime
    end_time: datetime
    description: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- Course ---
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Module ---
class ModuleBase(BaseModel):
    title: str
    course_id: int

class ModuleCreate(ModuleBase):
    pass

class ModuleResponse(ModuleBase):
    id: int

    class Config:
        from_attributes = True

# --- Material ---
class MaterialBase(BaseModel):
    title: str
    material_type: str
    file_path: Optional[str] = None
    module_id: int

class MaterialCreate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    id: int

    class Config:
        from_attributes = True

# --- Enrollment ---
class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentResponse(EnrollmentBase):
    id: int
    user_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True
