import requests
from bs4 import BeautifulSoup
from database import get_db
from models import Skill
from sqlalchemy.orm import Session
import hashlib

API_URL = "https://oldschool.runescape.wiki/api.php"

# Full OSRS skills with their free-to-play (f2p) and pay-to-play (p2p) training pages
SKILLS = {
    "Attack": {
        "f2p": "Free-to-play_melee_training",
        "p2p": "Pay-to-play_melee_training",
    },
    "Strength": {
        "f2p": "Free-to-play_melee_training",
        "p2p": "Pay-to-play_melee_training",
    },
    "Defence": {
        "f2p": "Free-to-play_melee_training",
        "p2p": "Pay-to-play_melee_training",
    },
    "Hitpoints": {
        "f2p": "Free-to-play_melee_training",  # shared melee page
        "p2p": "Pay-to-play_melee_training",
    },
    "Ranged": {
        "f2p": "Free-to-play_ranged_training",
        "p2p": "Pay-to-play_ranged_training",
    },
    "Prayer": {
        "f2p": "Free-to-play_prayer_training",
        "p2p": "Pay-to-play_prayer_training",
    },
    "Magic": {
        "f2p": "Free-to-play_magic_training",
        "p2p": "Pay-to-play_magic_training",
    },
    "Runecraft": {
        "f2p": "Free-to-play_Runecraft_training",
        "p2p": "Pay-to-play_Runecraft_training",
    },
    "Construction": {
        "p2p": "Pay-to-play_Construction_training",  # will fallback to Construction_training
    },
    "Agility": {
        "p2p": "Agility_training",
    },
    "Herblore": {
        "p2p": "Herblore_training",
    },
    "Thieving": {
        "p2p": "Thieving_training",
    },
    "Crafting": {
        "f2p": "Free-to-play_Crafting_training",
        "p2p": "Pay-to-play_Crafting_training",
    },
    "Fletching": {
        "p2p": "Fletching_training",
    },
    "Slayer": {
        "p2p": "Slayer_training",
    },
    "Hunter": {
        "p2p": "Hunter_training",
    },
    "Mining": {
        "f2p": "Free-to-play_Mining_training",
        "p2p": "Pay-to-play_Mining_training",
    },
    "Smithing": {
        "f2p": "Free-to-play_Smithing_training",
        "p2p": "Pay-to-play_Smithing_training",
    },
    "Fishing": {
        "f2p": "Free-to-play_Fishing_training",
        "p2p": "Pay-to-play_Fishing_training",
    },
    "Cooking": {
        "f2p": "Free-to-play_Cooking_training",
        "p2p": "Pay-to-play_Cooking_training",
    },
    "Firemaking": {
        "f2p": "Free-to-play_Firemaking_training",
        "p2p": "Pay-to-play_Firemaking_training",
    },
    "Woodcutting": {
        "f2p": "Free-to-play_Woodcutting_training",
        "p2p": "Pay-to-play_Woodcutting_training",
    },
    "Farming": {
        "p2p": "Farming_training",
    },
}


def fetch_html_content(page_title: str) -> str:
    """Fetch rendered HTML from OSRS Wiki, with BeautifulSoup cleanup."""
    params = {
        "action": "parse",
        "page": page_title,
        "prop": "text",
        "format": "json",
    }
    response = requests.get(API_URL, params=params)
    data = response.json()

    if "error" in data:
        raise Exception(f"Error fetching {page_title}: {data['error']}")

    html_content = data["parse"]["text"]["*"]
    soup = BeautifulSoup(html_content, "html.parser")

    # Strip edit links
    for el in soup.select(".mw-editsection"):
        el.decompose()

    return str(soup)


def fetch_with_fallback(skill: str, mode: str, page: str) -> str:
    """
    Try fetching the given page.
    If it's missing, retry with a simplified '<Skill>_training'.
    """
    try:
        return fetch_html_content(page)
    except Exception as e:
        if "missingtitle" in str(e):
            fallback = f"{skill}_training"
            print(f"⚠️ Falling back to {fallback} for {skill} ({mode}).")
            return fetch_html_content(fallback)
        else:
            raise


def store_skills():
    db: Session = next(get_db())
    for skill, pages in SKILLS.items():
        for mode, page in pages.items():
            try:
                # fetch with fallback support
                content = fetch_with_fallback(skill, mode, page)
                content_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()

                existing = (
                    db.query(Skill)
                    .filter(Skill.name == skill, Skill.mode == mode)
                    .first()
                )

                if existing:
                    if existing.hash == content_hash:
                        print(f"↔️ No change for {skill} ({mode}).")
                    else:
                        existing.content = content
                        existing.hash = content_hash
                        db.commit()
                        print(f"🔄 Updated {skill} ({mode}).")
                else:
                    new_skill = Skill(
                        name=skill,
                        mode=mode,
                        content=content,
                        hash=content_hash,
                    )
                    db.add(new_skill)
                    db.commit()
                    print(f"✅ Added {skill} ({mode}).")

            except Exception as e:
                print(f"❌ Failed for {skill} ({mode}): {e}")


if __name__ == "__main__":
    store_skills()
