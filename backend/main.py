from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models, database
from routers import auth_routes, users, tasks, reports, analytics, notifications, calendar

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="LMS Smart Planner API")

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(calendar.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LMS Platform API"}
