from core.database import Base
from sqlalchemy import Column, Integer, String, Boolean

class ContentPages(Base):
    __tablename__ = "content_pages"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    page_key = Column(String, unique=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    meta_description = Column(String, nullable=True)
    is_published = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)