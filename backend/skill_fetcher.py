import requests
import mwparserfromhell
import os

skills = [
    "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic", "Runecrafting",
    "Construction", "Hitpoints", "Agility", "Herblore", "Thieving", "Crafting",
    "Fletching", "Slayer", "Hunter", "Mining", "Smithing", "Fishing", "Cooking",
    "Firemaking", "Woodcutting", "Farming"
]

f2p_skills = {
    "Attack", "Strength", "Defence", "Ranged", "Prayer", "Magic",
    "Hitpoints", "Mining", "Smithing", "Fishing", "Cooking",
    "Firemaking", "Woodcutting", "Crafting", "Agility"
}

GROUP_REPLACEMENTS = {
    "Attack": "Free-to-play melee training",
    "Strength": "Free-to-play melee training",
    "Defence": "Free-to-play melee training"
}

OUTPUT_DIR = "skill_pages"
os.makedirs(OUTPUT_DIR, exist_ok=True)  # create folder if it doesn't exist

def fetch_page(page: str):
    url = "https://oldschool.runescape.wiki/api.php"
    params = {
        "action": "parse",
        "page": page,
        "format": "json",
        "prop": "wikitext",
        "redirects": 1
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    page_title = data["parse"]["title"]
    wikitext = data["parse"]["wikitext"]["*"]

    wikicode = mwparserfromhell.parse(wikitext)
    clean_text = wikicode.strip_code()
    return page_title, clean_text


def fetch_skill_pages(skill: str):
    pages = []
    seen_titles = set()

    # Base page
    try:
        title, text = fetch_page(f"{skill}_training")
        if title not in seen_titles:
            pages.append((title, text))
            seen_titles.add(title)
    except Exception as e:
        print(f"⚠️ Could not fetch {skill}_training: {e}")

    if skill in f2p_skills:
        # Pay-to-play
        try:
            title, text = fetch_page(f"Pay-to-play {skill} training")
            if title not in seen_titles:
                pages.append((title, text))
                seen_titles.add(title)
        except Exception as e:
            print(f"⚠️ Could not fetch Pay-to-play {skill} training: {e}")

        # Free-to-play
        try:
            title, text = fetch_page(f"Free-to-play {skill} training")
            if title not in seen_titles:
                pages.append((title, text))
                seen_titles.add(title)
        except Exception as e:
            group = GROUP_REPLACEMENTS.get(skill)
            if group:
                try:
                    title, text = fetch_page(group)
                    if title not in seen_titles:
                        pages.append((title, text))
                        seen_titles.add(title)
                        print(f"ℹ️ Used group page '{group}' for {skill}")
                except Exception as e2:
                    print(f"⚠️ Could not fetch group page {group} for {skill}: {e2}")
            else:
                print(f"⚠️ Could not fetch Free-to-play {skill} training: {e}")

    return pages


if __name__ == "__main__":
    for skill in skills:
        print(f"Fetching {skill}...")
        pages = fetch_skill_pages(skill)
        for page_title, text in pages:
            # Sanitize filename
            filename = f"{page_title.replace(' ', '_')}.txt"
            filepath = os.path.join(OUTPUT_DIR, filename)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(text)
    print(f"✅ All skills saved to individual files in '{OUTPUT_DIR}'")
