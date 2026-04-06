import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.quiz_questions import QuizQuestions

logger = logging.getLogger(__name__)

class QuizQuestionsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[QuizQuestions]:
        obj = QuizQuestions(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            return obj
        except Exception as e:
            await self.db.rollback()
            raise

    async def get_by_id(self, obj_id: int) -> Optional[QuizQuestions]:
        query = select(QuizQuestions).where(QuizQuestions.id == obj_id)
        return (await self.db.execute(query)).scalar_one_or_none()

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None) -> Dict[str, Any]:
        try:
            count_query = select(func.count(QuizQuestions.id))
            if query:
                for field, value in query.items():
                    if hasattr(QuizQuestions, field):
                        count_query = count_query.where(getattr(QuizQuestions, field) == value)
            total = (await self.db.execute(count_query)).scalar()
            
            data_query = select(QuizQuestions)
            if query:
                for field, value in query.items():
                    if hasattr(QuizQuestions, field):
                        data_query = data_query.where(getattr(QuizQuestions, field) == value)
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr(QuizQuestions, field_name):
                        data_query = data_query.order_by(getattr(QuizQuestions, field_name).desc())
                else:
                    if hasattr(QuizQuestions, sort):
                        data_query = data_query.order_by(getattr(QuizQuestions, sort).asc())
                        
            data_query = data_query.offset(skip).limit(limit)
            items = (await self.db.execute(data_query)).scalars().all()
            return {"items": items, "total": total, "skip": skip, "limit": limit}
        except Exception as e:
            logger.error(f"Error fetching quiz_questions: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[QuizQuestions]:
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
