import logging
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

# Note: If your model class is named 'Notifications' (plural), add an 's' to the end of Notifications here!
from models.notifications import Notifications 

logger = logging.getLogger(__name__)

class NotificationsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_list(self, skip: int = 0, limit: int = 20) -> Dict[str, Any]:
        try:
            count_query = select(func.count(Notifications.id))
            total = (await self.db.execute(count_query)).scalar()
            
            data_query = select(Notifications).offset(skip).limit(limit)
            items = (await self.db.execute(data_query)).scalars().all()
            
            return {"items": items, "total": total, "skip": skip, "limit": limit}
        except Exception as e:
            logger.error(f"Error fetching notifications: {str(e)}")
            raise