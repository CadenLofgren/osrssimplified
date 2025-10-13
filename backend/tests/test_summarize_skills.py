# tests/test_summarize_skills.py
import pytest
from unittest.mock import patch, MagicMock
from summarize_skills import summarize_content, main
from models import Skill

# ---- UNIT TESTS ----

@patch("summarize_skills.client.chat.completions.create")
def test_summarize_content_returns_clean_text(mock_create):
    """Ensure summarize_content returns the stripped text from OpenAI."""
    mock_create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="  ### Level 1–20\nTrain chickens  "))]
    )

    result = summarize_content("some wiki content", "Attack", "f2p")

    mock_create.assert_called_once()
    assert result == "### Level 1–20\nTrain chickens"
    assert "Attack" in mock_create.call_args[1]["messages"][0]["content"]
    assert "f2p" in mock_create.call_args[1]["messages"][0]["content"]


# ---- INTEGRATION-STYLE TEST ----

@patch("summarize_skills.summarize_content")
@patch("summarize_skills.get_db")
def test_main_updates_skill_summaries(mock_get_db, mock_summarize_content):
    """Simulate summarizing skills and committing results."""
    # Mock DB session and skill objects
    mock_db = MagicMock()
    mock_skill = Skill(id=1, name="Mining", category="f2p", content="rocks", summary=None)
    mock_db.query.return_value.all.return_value = [mock_skill]
    mock_get_db.return_value = iter([mock_db])

    # Mock summarization output
    mock_summarize_content.return_value = "### Level 1–20\nMine copper and tin."

    # Run the main function
    main()

    # Assertions
    mock_summarize_content.assert_called_once_with("rocks", "Mining", "f2p")
    assert mock_skill.summary == "### Level 1–20\nMine copper and tin."
    mock_db.commit.assert_called_once()
