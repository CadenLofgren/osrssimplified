import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import app
from database import Base, get_db
from models import Skill

# -------------------- TEST DATABASE SETUP -------------------- #

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override FastAPI dependency to use the test DB
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create all tables in the test DB
Base.metadata.create_all(bind=engine)

client = TestClient(app)


# -------------------- TESTS -------------------- #

def test_ping_route():
    """Check that the /ping endpoint returns database connection success."""
    response = client.get("/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "Database connected" in data["message"]


def test_about_route():
    """Verify the /about endpoint returns expected keys."""
    response = client.get("/about")
    assert response.status_code == 200
    data = response.json()
    assert data["project_name"] == "OSRS Simplified"
    assert "tech_stack" in data
    assert data["credits"]["video_creator"] == "Melankola"


def test_get_skills_empty():
    """Check behavior when no skills exist in DB."""
    response = client.get("/skills")
    assert response.status_code == 200
    data = response.json()
    assert "No skills found" in data["message"]


def test_get_skills_with_data():
    """Insert a mock skill and ensure it returns correctly."""
    db = TestingSessionLocal()
    skill = Skill(
        name="Attack",
        category="f2p",
        content="Full wiki content",
        hash="fakehash123",
        summary="Basic Attack guide",
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)
    db.close()

    response = client.get("/skills")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Attack"
    assert data[0]["summary"] == "Basic Attack guide"
