import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.quizzes import Quizzes

logger = logging.getLogger(__name__)

class QuizzesService:
    """Service layer for Quizzes operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Quizzes]:
        """Create a new quiz"""
        obj = Quizzes(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created quiz with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating quiz: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Quizzes]:
        """Get quiz by ID"""
        try:
            query = select(Quizzes).where(Quizzes.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching quiz {obj_id}: {str(e)}")
            raise

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None) -> Dict[str, Any]:
        """Get paginated list of quiz"""
        try:
            # Count query
            count_query = select(func.count(Quizzes.id))
            
            if query:
                for field, value in query.items():
                    if hasattr(Quizzes, field):
                        count_query = count_query.where(getattr(Quizzes, field) == value)
                        
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()
            
            # Data query
            data_query = select(Quizzes)
            
            if query:
                for field, value in query.items():
                    if hasattr(Quizzes, field):
                        data_query = data_query.where(getattr(Quizzes, field) == value)
                        
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr(Quizzes, field_name):
                        data_query = data_query.order_by(getattr(Quizzes, field_name).desc())
                else:
                    if hasattr(Quizzes, sort):
                        data_query = data_query.order_by(getattr(Quizzes, sort).asc())
                        
            data_query = data_query.offset(skip).limit(limit)
            
            result = await self.db.execute(data_query)
            items = result.scalars().all()
            
            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit
            }
        except Exception as e:
            logger.error(f"Error fetching quiz list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Quizzes]:
        """Update quiz"""
        obj = await self.get_by_id(obj_id)
        if not obj:
            return None
            
        for key, value in update_data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
                
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated quiz: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating quiz: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete quiz"""
        obj = await self.get_by_id(obj_id)
        if not obj:
            return False
            
        try:
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted quiz: {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting quiz: {str(e)}")
            raise