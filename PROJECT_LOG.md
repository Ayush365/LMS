# 📘 LMS Smart Planner - Comprehensive Project Log & Technical Documentation

## 1. Project Overview
**Project Name**: LMS Smart Planner (Learning Management System)  
**Industry**: EdTech / Productivity SaaS  
**Core Objective**: A feature-rich platform for students and educators to manage courses, track study progress via real-time analytics, organize tasks using Kanban methodologies, and generate data-driven reports.

---

## 2. Technical Stack (Deep Dive)

### 🎨 Frontend (Client Side)
- **Engine**: React 19 (Vite)
- **State Management**: React Context API (Auth, Theme, and Notifications)
- **Styling**: Vanilla CSS3 (Custom Design System with CSS Variables, HSL Color Palettes, and Glassmorphism)
- **Animations**: Framer Motion (Page transitions, Kanban drag-effects)
- **Charts**: Recharts (Customized area, bar, and pie charts for analytics)
- **HTTP Client**: Axios (with Interceptors for JWT handling)
- **Routing**: React Router DOM v7 (Nested routes, Protected routes, Role-based guards)

### ⚙️ Backend (Server Side)
- **Framework**: FastAPI (Asynchronous Python)
- **Security**: 
    - JWT (JSON Web Tokens) for stateless authentication.
    - Passlib with PBKDF2-SHA256 for industrial-grade password hashing.
    - CORS Middleware for secure cross-origin communication.
- **ORM**: SQLAlchemy (Relational mapping for MySQL)
- **Validation**: Pydantic V2 (Strict typing and auto-documentation)
- **API Documentation**: Swagger UI / ReDoc (Automatically generated)

### 🗄️ Database (Persistence Layer)
- **Engine**: MySQL 8.0.46
- **Architecture**: Relational schema with indexed lookups for high performance.
- **Migration Path**: Successfully migrated from PostgreSQL to MySQL.

---

## 3. Database Schema & Data Models

| Table Name | Description | Key Fields |
| :--- | :--- | :--- |
| `users` | User profiles & authentication | `id`, `email`, `hashed_password`, `role` (student/teacher/admin), `is_active` |
| `courses` | Academic course metadata | `id`, `title`, `description`, `department`, `semester`, `owner_id` |
| `tasks` | Actionable study items | `id`, `title`, `status` (Todo/In-Progress/Review/Done), `priority`, `deadline` |
| `study_sessions`| Real-time focus tracking | `id`, `task_id`, `start_time`, `end_time`, `duration_minutes` |
| `reports` | Student performance logs | `id`, `content` (Markdown), `feedback`, `status` (Pending/Reviewed) |
| `notifications` | System alerts | `id`, `user_id`, `message`, `is_read` |
| `activity_logs` | Audit trail for actions | `id`, `user_id`, `action`, `timestamp` |
| `events` | Calendar schedules | `id`, `title`, `start_time`, `end_time`, `event_type` |

---

## 4. Development Timeline (Chronological Log)

### Phase 1: Environment Setup & Infrastructure (Days 1-3)
- Initialized monorepo with `backend/` and `frontend/` directories.
- Set up Python Virtual Environment and Vite-React boilerplate.
- Configured `.env` management and early CORS settings in `main.py`.

### Phase 2: Core API & Auth Implementation (Days 4-7)
- Developed `auth.py` for JWT issuance and validation.
- Created `models.py` defining the initial database structure.
- Implemented `crud.py` with the first set of operations for User registration and Login.
- Integrated Swagger UI for API testing.

### Phase 3: Premium UI Design System (Days 8-12)
- Built `index.css` from scratch—replacing the need for Tailwind/Bootstrap.
- Implemented **Glassmorphism** (backdrop-blur) and custom scrollbars.
- Developed the `Sidebar` and `Header` layout components for a persistent SaaS feel.
- Integrated `Framer Motion` for smooth component mount/unmount animations.

### Phase 4: Task Management & Focus Mode (Days 13-18)
- Built the `Tasks.jsx` page with a Kanban-style layout.
- Developed the **Focus Mode (Pomodoro)** overlay component with a countdown timer.
- Created `study_sessions.py` router to track focus time directly linked to tasks.

### Phase 5: Analytics & Visualization (Days 19-22)
- Integrated `Recharts` into `Analytics.jsx`.
- Developed backend aggregation logic in `analytics.py` to calculate completion rates and study trends.
- Designed custom tooltip components for charts to match the site's dark theme.

### Phase 6: PostgreSQL to MySQL Migration (Days 23-25)
- Switched database drivers from `psycopg2` to `pymysql`.
- Refactored `database.py` and connection strings.
- Executed a project-wide audit to ensure compatibility with MySQL-specific data types (e.g., `ENUM`).
- Created `init_db.sql` for one-click database setup.

### Phase 7: System Optimization & Pydantic V2 Migration (Days 26-28)
- Updated all `schemas.py` definitions to comply with Pydantic V2 (`from_attributes` instead of `orm_mode`).
- Resolved migration warnings and improved JSON serialization speeds.
- Refactored `auth.py` to use `pbkdf2_sha256` as the primary hashing algorithm.

---

## 5. Key Features & Business Logic

- **Smart Planner**: Automatically suggests study tasks based on deadlines and priority.
- **Kanban Flow**: Interactive task movement from 'To Do' to 'Done' with database sync.
- **Markdown Reporting**: Students submit reports in Markdown; Teachers provide feedback in real-time.
- **Role-Based Access (RBAC)**: Distinct dashboards for Students (study focus), Teachers (content management), and Admins (system logs).
- **Activity Audit**: Every significant action (task completion, course enrollment) is logged in the `activity_logs` table for administrative review.

---

## 6. Critical Technical Decisions

1. **Vanilla CSS over Tailwind**: Chosen to demonstrate a deeper understanding of CSS architecture, specificity, and performance optimization, resulting in a unique, non-generic UI.
2. **FastAPI over Django/Flask**: Selected for its native support for asynchronous requests, which is critical for the real-time focus timers and notification systems.
3. **JWT for Auth**: Implemented to keep the backend stateless and scalable, making it easier to integrate with future mobile applications.
4. **Custom Pomodoro Timer**: Built as a React component using `useEffect` and `setInterval`, ensuring the timer persists even when the user navigates between dashboard sections.

---

## 7. Operational Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8.0

### Running the Project
1. **Database**: Create `lms_db` and run `init_db.sql`.
2. **Backend**: 
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

*This log is updated as of April 29, 2026. Prepared for technical interview walkthroughs.*
