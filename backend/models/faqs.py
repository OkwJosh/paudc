from core.database import Base
from sqlalchemy import Boolean, Column, Integer, String

class Faqs(Base):
    __tablename__ = "faqs"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    category = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    is_published = Column(Boolean, nullable=True)
    created_at = Column(String, nullable=True)