import os
from sqlalchemy.orm import Session
from database import get_db
from models import Skill
from bs4 import BeautifulSoup

OUTPUT_DIR = "output"

def export_skills():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    db: Session = next(get_db())

    skills = db.query(Skill).all()
    for skill in skills:
        # Convert HTML back to readable text
        soup = BeautifulSoup(skill.content, "html.parser")
        text_content = soup.get_text(separator="\n", strip=True)

        # File name pattern: attack_f2p.txt, defence_p2p.txt, etc.
        filename = f"{skill.name.lower()}_{skill.mode}.txt"
        filepath = os.path.join(OUTPUT_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"--- Skill: {skill.name} ({skill.mode.upper()}) ---\n\n")
            f.write(text_content)

        print(f"📄 Exported {skill.name} ({skill.mode}) → {filepath}")

if __name__ == "__main__":
    export_skills()
