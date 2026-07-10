from database import SessionLocal
import models
import auth

def fix_users():
    from database import engine
    print("Resetting database to clear all data...")
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("Creating admin and ayush accounts...")
    hashed_pw = auth.get_password_hash("1234")
    
    admin = models.User(
        username="admin", 
        email="admin@lms.com", 
        hashed_password=hashed_pw, 
        role=models.UserRole.ADMIN, 
        is_admin=True
    )
    
    ayush = models.User(
        username="ayush", 
        email="ayush@lms.com", 
        hashed_password=hashed_pw, 
        role=models.UserRole.ADMIN, 
        is_admin=True
    )
    
    db.add_all([admin, ayush])
    db.commit()
    
    print("Successfully created accounts with password '1234'")
    db.close()

if __name__ == "__main__":
    fix_users()
