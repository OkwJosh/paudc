from core.database import Base
from sqlalchemy import Column, Integer, String, Boolean

class Resources(Base):
    __tablename__ = "resources"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    is_public = Column(Boolean, nullable=True)
    download_count = Column(Integer, nullable=True)
    created_at = Column(String, nullable=True)