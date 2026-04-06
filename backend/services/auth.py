import logging
from datetime import datetime, timezone
from typing import Optional, Tuple

from core.config import settings
from models.auth import User
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def get_or_create_user(self, platform_sub: str, email: str, name: Optional[str] = None) -> User:
        """Get existing user or create new one."""
        stmt = select(User).where(User.id == platform_sub)
        result = await self.db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            # Create new user
            user = User(
                id=platform_sub,
                email=email,
                name=name,
                last_login=datetime.now(timezone.utc).isoformat()
            )
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
        else:
            # Update last login
            user.last_login = datetime.now(timezone.utc).isoformat()
            await self.db.commit()
            
        return user

async def initialize_admin_user():
    """Initialize admin user if not exists"""
    from core.database import get_db_manager
    
    db_manager = get_db_manager()
    if not db_manager._initialized:
        await db_manager.init_db()
        
    admin_user_id = getattr(settings, "admin_user_id", None)
    admin_user_email = getattr(settings, "admin_user_email", None)
    
    if not admin_user_id or not admin_user_email:
        return
        
    async with db_manager.session_maker() as db:
        stmt = select(User).where(User.id == admin_user_id)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            admin_user = User(
                id=admin_user_id,
                email=admin_user_email,
                role="admin",
                last_login=datetime.now(timezone.utc).isoformat()
            )
            db.add(admin_user)
            await db.commit()
            logger.info(f"Created initial admin user: {admin_user_email}")
        elif user.role != "admin":
            user.role = "admin"
            await db.commit()
            logger.info(f"Updated existing user to admin: {admin_user_email}")