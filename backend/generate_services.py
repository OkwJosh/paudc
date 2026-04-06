import os

services = [
    ("content_pages", "ContentPages"), 
    ("course_modules", "CourseModules"), 
    ("course_materials", "CourseMaterials"), 
    ("faqs", "Faqs"), 
    ("notifications", "Notifications"), 
    ("quiz_questions", "QuizQuestions"), 
    ("quizzes", "Quizzes"), 
    ("schedules", "Schedules")
]

template = """import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.{module_name} import {model_name}

logger = logging.getLogger(__name__)

class {model_name}Service:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[{model_name}]:
        obj = {model_name}(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            return obj
        except Exception as e:
            await self.db.rollback()
            raise

    async def get_by_id(self, obj_id: int) -> Optional[{model_name}]:
        query = select({model_name}).where({model_name}.id == obj_id)
        return (await self.db.execute(query)).scalar_one_or_none()

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None) -> Dict[str, Any]:
        try:
            count_query = select(func.count({model_name}.id))
            if query:
                for field, value in query.items():
                    if hasattr({model_name}, field):
                        count_query = count_query.where(getattr({model_name}, field) == value)
            total = (await self.db.execute(count_query)).scalar()
            
            data_query = select({model_name})
            if query:
                for field, value in query.items():
                    if hasattr({model_name}, field):
                        data_query = data_query.where(getattr({model_name}, field) == value)
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr({model_name}, field_name):
                        data_query = data_query.order_by(getattr({model_name}, field_name).desc())
                else:
                    if hasattr({model_name}, sort):
                        data_query = data_query.order_by(getattr({model_name}, sort).asc())
                        
            data_query = data_query.offset(skip).limit(limit)
            items = (await self.db.execute(data_query)).scalars().all()
            return {{"items": items, "total": total, "skip": skip, "limit": limit}}
        except Exception as e:
            logger.error(f"Error fetching {module_name}: {{str(e)}}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[{model_name}]:
        obj = await self.get_by_id(obj_id)
        if not obj:
            return None
        for key, value in update_data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            return obj
        except Exception as e:
            await self.db.rollback()
            raise

    async def delete(self, obj_id: int) -> bool:
        obj = await self.get_by_id(obj_id)
        if not obj:
            return False
        try:
            await self.db.delete(obj)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            raise
"""

# Ensure the services directory exists
os.makedirs("services", exist_ok=True)

for module_name, model_name in services:
    filepath = f"services/{module_name}.py"
    if not os.path.exists(filepath): # Prevent overwriting files if they exist
        with open(filepath, "w") as f:
            f.write(template.format(module_name=module_name, model_name=model_name))
        print(f"Successfully generated {filepath}")
    else:
        print(f"Skipped {filepath} (file already exists)")