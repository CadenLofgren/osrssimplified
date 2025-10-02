import os
from openai import OpenAI
from sqlalchemy.orm import Session
from database import get_db
from models import Skill

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_content(content: str, skill_name: str, mode: str) -> str:
    """Send wiki HTML to OpenAI and return a summarized version."""
    prompt = f"""
    You are an assistant that summarizes Old School RuneScape wiki pages.
    The content below is the training guide for the skill: {skill_name} ({mode}).

    Extract:
    - Important training methods
    - Relevant locations
    - The levels required for each activity

    Remove irrelevant details, formatting, and fluff. 
    Keep the summary clear and concise for players looking for efficient training.

    Content:
    {content[:50000]}
    """
    response = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip()

def main():
    db: Session = next(get_db())
    skills = db.query(Skill).all()
    for skill in skills:
        try:
            summary = summarize_content(skill.content, skill.name, skill.mode)
            skill.summary = summary
            db.commit()
            print(f"✅ Summarized {skill.name} ({skill.mode})")
        except Exception as e:
            print(f"❌ Failed to summarize {skill.name} ({skill.mode}): {e}")

if __name__ == "__main__":
    main()
