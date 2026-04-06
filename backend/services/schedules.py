import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.schedules import Schedules

logger = logging.getLogger(__name__)

class SchedulesService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Schedules]:
        obj = Schedules(**data)
        self.db.add(obj)
        try:
            await self.db.commit()
            await self.db.refresh(obj)
            return obj
        except Exception as e:
            await self.db.rollback()
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Schedules]:
        query = select(Schedules).where(Schedules.id == obj_id)
        return (await self.db.execute(query)).scalar_one_or_none()

    async def get_list(self, skip: int = 0, limit: int = 20, query: Optional[Dict[str, Any]] = None, sort: Optional[str] = None) -> Dict[str, Any]:
        try:
            count_query = select(func.count(Schedules.id))
            if query:
                for field, value in query.items():
                    if hasattr(Schedules, field):
                        count_query = count_query.where(getattr(Schedules, field) == value)
            total = (await self.db.execute(count_query)).scalar()
            
            data_query = select(Schedules)
            if query:
                for field, value in query.items():
                    if hasattr(Schedules, field):
                        data_query = data_query.where(getattr(Schedules, field) == value)
            if sort:
                if sort.startswith("-"):
                    field_name = sort[1:]
                    if hasattr(Schedules, field_name):
                        data_query = data_query.order_by(getattr(Schedules, field_name).desc())
                else:
                    if hasattr(Schedules, sort):
                        data_query = data_query.order_by(getattr(Schedules, sort).asc())
                        
            data_query = data_query.offset(skip).limit(limit)
            items = (await self.db.execute(data_query)).scalars().all()
            return {"items": items, "total": total, "skip": skip, "limit": limit}
        except Exception as e:
            logger.error(f"Error fetching schedules: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Schedules]:
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
