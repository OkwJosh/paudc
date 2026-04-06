from core.database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime

class Courses(Base):
    __tablename__ = "courses"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    difficulty_level = Column(String, nullable=False)
    estimated_hours = Column(Integer, nullable=True)
    is_published = Column(Boolean, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)