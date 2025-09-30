from sqlalchemy import Column, Integer, String, Text
from database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)      # Skill name (e.g., Attack, Mining)
    category = Column(String, nullable=True)  # Combat, Gathering, etc.
    mode = Column(String, nullable=False)      # f2p or p2p
    content = Column(Text, nullable=False)     # Full wiki text content
    hash = Column(String, nullable=False)      # SHA256 hash for deduplication
