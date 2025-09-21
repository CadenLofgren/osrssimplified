from sqlalchemy import Column, Integer, String, Text
from database import Base

class TrainingSummary(Base):
    __tablename__ = "training_summaries"

    id = Column(Integer, primary_key=True, index=True)
    skill = Column(String(50), unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
