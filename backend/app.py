from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import subprocess

from database import get_db, engine
from models import Base, Skill

#-------------------- APP LIFECYCLE / DB CONNECTION --------------------#

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # ✅ Create tables if they don’t exist
        Base.metadata.create_all(bind=engine)

        # ✅ Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully and tables created.")
    except Exception as e:
        print("❌ Database connection failed:", e)
        raise e
    yield
    engine.dispose()
    print("🔒 Database connection closed.")

app = FastAPI(lifespan=lifespan)

#-------------------- CORS CONFIG --------------------#

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://osrssimplified-frontend.onrender.com",
        "https://osrssimplified.com",  # ✅ your Render frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#-------------------- ROUTES --------------------#

@app.get("/ping")
async def ping():
    """Health check route for testing DB connection"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Database connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/skills")
def get_skills(db: Session = Depends(get_db)):
    """Return all skills and summaries from the database"""
    skills = db.query(Skill).all()
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


@app.get("/about")
async def get_about():
    """Basic about page for OSRS Simplified"""
    return {
        "project_name": "OSRS Simplified",
        "description": (
            "OSRS Simplified is a fan-made project built to make Old School RuneScape "
            "easier to understand and navigate. It presents clear, fast-loading data "
            "sourced from the official OSRS Wiki."
        ),
        "tech_stack": ["Next.js", "FastAPI", "PostgreSQL"],
        "credits": {
            "wiki": "Old School RuneScape Wiki",
            "video_creator": "Melankola",
            "video_link": "https://www.youtube.com/watch?v=D7EGZDfTWO0",
            "developer": "Caden",
        },
        "links": {
            "frontend": "https://your-frontend-domain.com",  # replace once deployed
            "github": "https://github.com/",  # optional link
        },
        "status": "success",
    }

#-------------------- RUN SCRIPTS ENDPOINT --------------------#

@app.post("/run-skill-scripts")
async def run_skill_scripts():
    """
    Manually trigger skill_fetcher.py and summarize_skills.py
    after the database has been setup.
    """
    try:
        # Run skill_fetcher.py
        subprocess.run(["python", "skill_fetcher.py"], cwd="backend", check=True)

        # Run summarize_skills.py
        subprocess.run(["python", "summarize_skills.py"], cwd="backend", check=True)

        return {"status": "success", "message": "Scripts executed successfully."}

    except subprocess.CalledProcessError as e:
        # Return error if the scripts fail
        raise HTTPException(status_code=500, detail=f"Script failed: {e}")
