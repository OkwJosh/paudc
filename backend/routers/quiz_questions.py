import json
import logging
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.quiz_questions import QuizQuestionsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/quiz_questions", tags=["quiz_questions"])

# Pydantic Schemas
class QuizQuestionsData(BaseModel):
    quiz_id: int
    question_text: str
    question_type: str
    options: str
    correct_answer: str
    points: int
    order_index: int

class QuizQuestionsUpdateData(BaseModel):
    quiz_id: Optional[int] = None
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    options: Optional[str] = None
    correct_answer: Optional[str] = None
    points: Optional[int] = None
    order_index: Optional[int] = None

class QuizQuestionsResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    question_type: str
    options: str
    correct_answer: str
    points: int
    order_index: int

    class Config:
        from_attributes = True

class QuizQuestionsListResponse(BaseModel):
    items: List[QuizQuestionsResponse]
    total: int
    skip: int
    limit: int

# Routes
@router.get("/", response_model=QuizQuestionsListResponse)
async def query_quiz_questions(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    service = QuizQuestionsService(db)
    try:
        query_dict = json.loads(query) if query else None
        return await service.get_list(skip=skip, limit=limit, query=query_dict, sort=sort)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid query JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")