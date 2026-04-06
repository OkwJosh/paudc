import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.quiz_attempts import QuizAttempts

logger = logging.getLogger(__name__)

class QuizAttemptsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any], user_id: str) -> Optional[QuizAttempts]:
        data["user_id"] = user_id
        obj = QuizAttempts(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating quiz_attempt: {str(e)}")
            raise

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None, user_id: str = None) -> Dict[str, Any]:
        try:
            count_query = select(func.count(QuizAttempts.id))
            if user_id:
                count_query = count_query.where(QuizAttempts.user_id == user_id)
            if query:
                for field, value in query.items():
                    if hasattr(QuizAttempts, field):
                        count_query = count_query.where(getattr(QuizAttempts, field) == value)
            total = (await self.db.execute(count_query)).scalar()
            
            data_query = select(QuizAttempts)
            if user_id:
                data_query = data_query.where(QuizAttempts.user_id == user_id)
            if query:
                for field, value in query.items():
                    if hasattr(QuizAttempts, field):
                        data_query = data_query.where(getattr(QuizAttempts, field) == value)
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr(QuizAttempts, field_name):
                        data_query = data_query.order_by(getattr(QuizAttempts, field_name).desc())
                else:
                    if hasattr(QuizAttempts, sort):
                        data_query = data_query.order_by(getattr(QuizAttempts, sort).asc())
                        
            data_query = data_query.offset(skip).limit(limit)
            items = (await self.db.execute(data_query)).scalars().all()
            return {"items": items, "total": total, "skip": skip, "limit": limit}
        except Exception as e:
            logger.error(f"Error fetching quiz_attempts: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any], user_id: str = None) -> Optional[QuizAttempts]:
        query = select(QuizAttempts).where(QuizAttempts.id == obj_id)
        if user_id:
            query = query.where(QuizAttempts.user_id == user_id)
        obj = (await self.db.execute(query)).scalar_one_or_none()
        
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

    async def delete(self, obj_id: int, user_id: str = None) -> bool:
        query = select(QuizAttempts).where(QuizAttempts.id == obj_id)
        if user_id:
            query = query.where(QuizAttempts.user_id == user_id)
        obj = (await self.db.execute(query)).scalar_one_or_none()
        
        if not obj:
            return False
        try:
            await self.db.delete(obj)
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            raise