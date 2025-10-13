import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from bs4 import BeautifulSoup

from database import Base, get_db
from models import Skill
import skill_fetcher


# -------------------- TEST DATABASE SETUP -------------------- #

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

skill_fetcher.get_db = override_get_db  # override dependency
Base.metadata.create_all(bind=engine)


# -------------------- TESTS -------------------- #

def test_fetch_html_content_basic(monkeypatch):
    """Ensure fetch_html_content returns cleaned HTML."""
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "parse": {"text": {"*": "<div><p>Test HTML</p></div>"}}
    }

    monkeypatch.setattr(skill_fetcher.requests, "get", lambda *a, **k: mock_response)

    html = skill_fetcher.fetch_html_content("Test_Page")
    assert "<p>Test HTML</p>" in html
    assert isinstance(html, str)


def test_fetch_html_content_redirect(monkeypatch):
    """Ensure redirect is followed recursively."""
    def mock_get(url, params):
        if params["page"] == "Redirect_Page":
            return MagicMock(json=lambda: {
                "parse": {"text": {"*": '<div class="redirectMsg"><a>Target_Page</a></div>'}}
            })
        else:
            return MagicMock(json=lambda: {
                "parse": {"text": {"*": "<p>Target Content</p>"}}
            })

    monkeypatch.setattr(skill_fetcher.requests, "get", mock_get)

    html = skill_fetcher.fetch_html_content("Redirect_Page")
    assert "Target Content" in html


def test_fetch_with_fallback(monkeypatch):
    """Ensure fallback triggers when an error is raised."""
    def mock_fetch_html_content(page_title, _depth=0):
        if page_title == "Bad_Page":
            raise Exception("missingtitle")
        return "<p>Good content</p>"

    monkeypatch.setattr(skill_fetcher, "fetch_html_content", mock_fetch_html_content)

    result = skill_fetcher.fetch_with_fallback("Attack", "f2p", "Bad_Page")
    assert "Good content" in result


def test_store_skills_inserts(monkeypatch):
    """Test that store_skills adds new skills into the database."""
    # Mock the HTML fetcher to return dummy content
    monkeypatch.setattr(skill_fetcher, "fetch_with_fallback", lambda s, m, p: "<p>Dummy content</p>")

    # Clear any existing records
    db = TestingSessionLocal()
    db.query(Skill).delete()
    db.commit()
    db.close()

    # Run the store function with just one skill
    skill_fetcher.SKILLS = {"Attack": {"f2p": "Free-to-play_melee_training"}}
    skill_fetcher.store_skills()

    db = TestingSessionLocal()
    skills = db.query(Skill).all()
    db.close()

    assert len(skills) == 1
    assert skills[0].name == "Attack"
    assert skills[0].category == "f2p"
    assert "Dummy content" in skills[0].content
