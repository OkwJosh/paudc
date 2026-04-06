import json
import logging
from typing import Optional, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from dependencies.auth import get_current_user
from models.auth import User
from services.progress_tracking import ProgressTrackingService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/progress_tracking", tags=["progress_tracking"])

# Pydantic Schemas
class ProgressTrackingData(BaseModel):
    course_id: int
    module_id: Optional[int] = None
    material_id: Optional[int] = None
    status: str
    last_accessed_at: Optional[datetime] = None

class ProgressTrackingUpdateData(BaseModel):
    course_id: Optional[int] = None
    module_id: Optional[int] = None
    material_id: Optional[int] = None
    status: Optional[str] = None
    last_accessed_at: Optional[datetime] = None

class ProgressTrackingResponse(BaseModel):
    id: int
    user_id: str
    course_id: int
    module_id: Optional[int] = None
    material_id: Optional[int] = None
    status: str
    last_accessed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProgressTrackingListResponse(BaseModel):
    items: List[ProgressTrackingResponse]
    total: int
    skip: int
    limit: int

# Routes
@router.get("/", response_model=ProgressTrackingListResponse)
async def query_progress_tracking(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    logger.debug(f"Querying progress_tracking: query={query}, sort={sort}, skip={skip}, limit={limit}")
    service = ProgressTrackingService(db)
    try:
        query_dict = json.loads(query) if query else None
        return await service.get_list(
            skip=skip, 
            limit=limit, 
            query=query_dict, 
            sort=sort, 
            user_id=str(current_user.id)
        )
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid query JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=ProgressTrackingResponse, status_code=201)
async def create_progress_tracking(
    data: ProgressTrackingData,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ProgressTrackingService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create progress_tracking")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.put("/{id}", response_model=ProgressTrackingResponse)
async def update_progress_tracking(
    id: int,
    data: ProgressTrackingUpdateData,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ProgressTrackingService(db)
    try:
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=404, detail="Progress_tracking not found for update")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{id}")
async def delete_progress_tracking(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ProgressTrackingService(db)
    try:
        if not await service.delete(id, user_id=str(current_user.id)):
            raise HTTPException(status_code=404, detail="Progress tracking not found or unauthorized")
        return {"message": "Successfully deleted progress tracking"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")