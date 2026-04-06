import logging
import time
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.auth import User

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    async def get_user_profile(db: AsyncSession, user_id: str) -> Optional[User]:
        """Get user profile by user ID."""
        start_time = time.time()
        logger.debug(f"[DB_OP] Starting get_user_profile - user_id: {user_id}")
        
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        
        logger.debug(f"[DB_OP] Get user profile completed in {time.time() - start_time:.4f}s - found: {user is not None}")
        return user

    @staticmethod
    async def update_user_profile(db: AsyncSession, user_id: str, update_data: dict) -> Optional[User]:
        """Update user profile."""
        start_time = time.time()
        logger.debug(f"[DB_OP] Starting user profile update")
        
        user = await UserService.get_user_profile(db, user_id)
        
        if user and update_data.get("name") is not None:
            user.name = update_data["name"]
            await db.commit()
            await db.refresh(user)
            
        logger.debug(f"[DB_OP] User profile update completed in {time.time() - start_time:.4f}s")
        return user