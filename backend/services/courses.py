import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.courses import Courses

logger = logging.getLogger(__name__)

class CoursesService:
    """Service layer for Courses operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Courses]:
        """Create a new courses"""
        obj = Courses(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created courses with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating courses: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Courses]:
        """Get courses by ID"""
        try:
            query = select(Courses).where(Courses.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching courses {obj_id}: {str(e)}")
            raise

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None) -> Dict[str, Any]:
        """Get paginated list of courses"""
        try:
            # Count query
            count_query = select(func.count(Courses.id))
            
            if query:
                for field, value in query.items():
                    if hasattr(Courses, field):
                        count_query = count_query.where(getattr(Courses, field) == value)
                        
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()
            
            # Data query
            data_query = select(Courses)
            
            if query:
                for field, value in query.items():
                    if hasattr(Courses, field):
                        data_query = data_query.where(getattr(Courses, field) == value)
                        
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr(Courses, field_name):
                        data_query = data_query.order_by(getattr(Courses, field_name).desc())
                else:
                    if hasattr(Courses, sort):
                        data_query = data_query.order_by(getattr(Courses, sort).asc())
                        
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
            logger.error(f"Error fetching courses list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Courses]:
        """Update courses"""
        obj = await self.get_by_id(obj_id)
        if not obj:
            return None
            
        for key, value in update_data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
                
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated courses: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating courses: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete courses"""
        obj = await self.get_by_id(obj_id)
        if not obj:
            return False
            
        try:
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted courses: {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting courses: {str(e)}")
            raise