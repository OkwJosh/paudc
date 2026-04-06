from core.database import Base
from sqlalchemy import Column, Integer, String, Boolean

class Notifications(Base):
    __tablename__ = "notifications"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=False)
    target_audience = Column(String, nullable=False)
    is_urgent = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)
    created_by = Column(String, nullable=True)