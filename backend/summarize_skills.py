import os
from openai import OpenAI
from sqlalchemy.orm import Session
from database import get_db
from models import Skill

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_content(content: str, skill_name: str, mode: str) -> str:
    """Send wiki HTML to OpenAI and return a concise Markdown-formatted summary."""
    prompt = f"""
    You are summarizing the Old School RuneScape wiki training guide for the skill: {skill_name} ({mode}).

    **Goal:**
    Create a clear, accurate Markdown summary for both beginners and experienced players, showing only the key training information.

    **Instructions:**
    - Write the summary in **Markdown** format.
    - Organize the content by **level ranges**, using level ranges as section headers.
      Example:
      ### Level 1–20
      ### Level 20–40
      ### Level 40+
    - For each range, include:
        • Main training methods  
        • Important locations  
        • Notable equipment or items  
        • Key unlocks or transitions  
    - Bold all important **training methods**, **locations**, or **items** for clarity.  
    - Keep the tone clear, factual, and efficient — like a simplified wiki guide.
    - Do NOT include any meta text, AI references, or helper language (e.g., “If you want, I can…”).
    - Do NOT add a conclusion or final paragraph — end naturally after the last level range.
    - Exclude lore, trivia, pricing, or unnecessary mechanics.
    - The output should be clean Markdown that renders well on a website.

    **Example format:**
    ### Level 1–20
    Train on **chickens** or **cows** near **Lumbridge** for early XP and feathers/hides.

    ### Level 20–40
    Move to **Hill Giants** in **Edgeville Dungeon** for faster XP and bones.

    ### Level 40+
    Use **Sand Crabs** or **Ammonite Crabs** for AFK training and consistent XP.

    Now summarize the following wiki content accordingly:

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
            summary = summarize_content(skill.content, skill.name, skill.category)
            skill.summary = summary
            db.commit()
            print(f"✅ Summarized {skill.name} ({skill.category})")
        except Exception as e:
            print(f"❌ Failed to summarize {skill.name} ({getattr(skill, 'category', 'unknown')}): {e}")


if __name__ == "__main__":
    main()
