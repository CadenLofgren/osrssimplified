from fastapi import FastAPI, HTTPException, Depends
import requests
import mwparserfromhell
import os
from dotenv import load_dotenv
from openai import OpenAI

from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db, engine
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = FastAPI()

# Fetch raw wikitext from OSRS Wiki
def fetch_wiki_page(page_title: str) -> str:
    url = "https://oldschool.runescape.wiki/api.php"
    params = {
        "action": "parse",
        "page": page_title,
        "format": "json",
        "prop": "wikitext"
    }
    response = requests.get(url, params=params)
    data = response.json()

    if "error" in data:
        raise HTTPException(status_code=404, detail=f"Wiki page '{page_title}' not found")

    return data["parse"]["wikitext"]["*"]

# Clean wikitext
def clean_wikitext(wikitext: str) -> str:
    wikicode = mwparserfromhell.parse(wikitext)
    return wikicode.strip_code()  # removes wiki markup

# API endpoint
@app.get("/training/{skill}")
def get_training_summary(skill: str):
    try:
        raw_wikitext = fetch_wiki_page(f"{skill} training")
        clean_text = clean_wikitext(raw_wikitext)

        # Send to OpenAI for summarization
        prompt = f"Summarize this Old School RuneScape skill guide in simple steps:\n\n{clean_text}"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # use your new key
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        summary = response.choices[0].message.content
        return {"skill": skill, "summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
#----------------------------------DATABASE
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connected successfully.")
    except Exception as e:
        print("❌ Database connection failed:", e)
        raise e
    yield
    # Shutdown
    engine.dispose()
    print("🔒 Database connection closed.")

app = FastAPI(lifespan=lifespan)

# Healthcheck route
@app.get("/ping")
async def ping():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Database connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
#-----------------------------------DATABASE----------------------------------------