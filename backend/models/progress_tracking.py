from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String

class ProgressTracking(Base):
    __tablename__ = "progress_tracking"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    course_id = Column(Integer, nullable=False)
    module_id = Column(Integer, nullable=True)
    material_id = Column(Integer, nullable=True)
    status = Column(String, nullable=False)
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)