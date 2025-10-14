# backend/scripts.py
from fastapi import APIRouter, HTTPException
import subprocess

router = APIRouter()

@router.post("/run-skill-scripts")
def run_skill_scripts():
    """
    Run skill_fetcher.py and summarize_skills.py after the database is ready.
    """
    try:
        # Run skill_fetcher.py
        subprocess.run(["python", "skill_fetcher.py"], check=True)

        # Run summarize_skills.py
        subprocess.run(["python", "summarize_skills.py"], check=True)

        return {"status": "success", "message": "Scripts executed successfully."}

    except subprocess.CalledProcessError as e:
        # Capture any errors from the scripts
        raise HTTPException(status_code=500, detail=f"Script failed: {e}")
