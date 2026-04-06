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
from services.quiz_attempts import QuizAttemptsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/quiz_attempts", tags=["quiz_attempts"])

# Pydantic Schemas
class QuizAttemptsData(BaseModel):
    quiz_id: int
    score: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    attempt_number: Optional[int] = None
    passed: Optional[bool] = None

class QuizAttemptsUpdateData(BaseModel):
    quiz_id: Optional[int] = None
    score: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    attempt_number: Optional[int] = None
    passed: Optional[bool] = None

class QuizAttemptsResponse(BaseModel):
    id: int
    user_id: str
    quiz_id: int
    score: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    attempt_number: Optional[int] = None
    passed: Optional[bool] = None

    class Config:
        from_attributes = True

class QuizAttemptsListResponse(BaseModel):
    items: List[QuizAttemptsResponse]
    total: int
    skip: int
    limit: int

# Routes
@router.get("/", response_model=QuizAttemptsListResponse)
async def query_quiz_attempts(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuizAttemptsService(db)
    try:
        query_dict = json.loads(query) if query else None
        return await service.get_list(
            skip=skip, limit=limit, query=query_dict, sort=sort, user_id=str(current_user.id)
        )
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid query JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/", response_model=QuizAttemptsResponse, status_code=201)
async def create_quiz_attempts(
    data: QuizAttemptsData,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuizAttemptsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create quiz attempt")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")