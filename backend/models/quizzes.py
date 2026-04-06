from core.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String

class Quizzes(Base):
    __tablename__ = "quizzes"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    course_id = Column(Integer, nullable=False)
    module_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    time_limit_minutes = Column(Integer, nullable=True)
    max_attempts = Column(Integer, nullable=True)
    passing_score = Column(Integer, nullable=True)
    is_published = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)