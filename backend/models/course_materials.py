from core.database import Base
from sqlalchemy import Column, Integer, String

class CourseMaterials(Base):
    __tablename__ = "course_materials"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    module_id = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    material_type = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(String, nullable=True)