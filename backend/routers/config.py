from fastapi import APIRouter, Request

from core.config import settings

router = APIRouter(tags=["config"])


@router.get("/api/config")
async def get_runtime_config(request: Request):
    """Expose minimal runtime config consumed by the frontend."""
    api_base_url = settings.backend_url.rstrip("/") if settings.backend_url else str(request.base_url).rstrip("/")
    return {"API_BASE_URL": api_base_url}
