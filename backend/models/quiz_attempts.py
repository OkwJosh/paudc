from core.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String

class QuizAttempts(Base):
    __tablename__ = "quiz_attempts"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    quiz_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    attempt_number = Column(Integer, nullable=True)
    passed = Column(Boolean, nullable=True)