from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String

class Schedules(Base):
    __tablename__ = "schedules"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    event_date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    category = Column(String, nullable=False)
    is_public = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)