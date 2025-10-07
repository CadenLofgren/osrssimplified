import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Skill

OUTPUT_DIR = "ai_summary"

def export_summaries():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    db: Session = SessionLocal()

    try:
        skills = db.query(Skill).all()
        for skill in skills:
            # Use category instead of mode
            category = skill.category if skill.category else "general"

            if not skill.summary:
                print(f"⚠️ Skipping {skill.name} ({category}) - no summary yet")
                continue

            filename = f"{skill.name}_{category}.txt".replace(" ", "_")
            filepath = os.path.join(OUTPUT_DIR, filename)

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(skill.summary)

            print(f"✅ Saved summary for {skill.name} ({category}) → {filepath}")

    finally:
        db.close()

if __name__ == "__main__":
    export_summaries()
