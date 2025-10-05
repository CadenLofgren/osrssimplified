from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from contextlib import asynccontextmanager

from database import get_db, engine
import models
from fastapi.middleware.cors import CORSMiddleware

#-------------------- APP LIFECYCLE / DB CONNECTION --------------------#

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully.")
    except Exception as e:
        print("❌ Database connection failed:", e)
        raise e
    yield
    engine.dispose()
    print("🔒 Database connection closed.")

app = FastAPI(lifespan=lifespan)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#-------------------- ROUTES --------------------#

@app.get("/ping")
async def ping():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Database connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/skills")
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(models.Skill).all()
    if not skills:
        return {"message": "No skills found in the database."}

    return [
        {
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "summary": skill.summary,
        }
        for skill in skills
    ]
