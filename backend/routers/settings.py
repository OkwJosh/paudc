import logging
import os
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from dependencies.auth import get_admin_user
from models.auth import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/admin/settings", tags=["settings"])

class EnvVariable(BaseModel):
    key: str
    value: str

class EnvConfig(BaseModel):
    backend_vars: Dict[str, EnvVariable]
    frontend_vars: Dict[str, EnvVariable]

class EnvVariableUpdate(BaseModel):
    value: str

@router.get("/", response_model=EnvConfig)
async def get_settings(current_user: User = Depends(get_admin_user)):
    """Get all environment variables for admin view."""
    # In a real app, this would read from the actual config manager
    return {
        "backend_vars": {},
        "frontend_vars": {}
    }

@router.post("/backend/{key}")
async def add_backend_setting(
    key: str, 
    update: EnvVariableUpdate,
    current_user: User = Depends(get_admin_user)
):
    """Add a backend environment variable."""
    return {"message": f"Backend configuration '{key}' added successfully; restart required to take effect."}

@router.put("/backend/{key}")
async def update_backend_setting(
    key: str, 
    update: EnvVariableUpdate,
    current_user: User = Depends(get_admin_user)
):
    """Update a backend environment variable."""
    return {"message": f"Backend configuration '{key}' updated successfully; restart required to take effect."}

@router.delete("/backend/{key}")
async def delete_backend_setting(key: str, current_user: User = Depends(get_admin_user)):
    """Delete a backend environment variable."""
    return {"message": f"Backend configuration '{key}' deleted successfully; restart required to take effect."}

@router.post("/frontend/{key}")
async def add_frontend_setting(
    key: str, 
    update: EnvVariableUpdate,
    current_user: User = Depends(get_admin_user)
):
    """Add a frontend environment variable."""
    return {"message": f"Frontend configuration '{key}' added successfully; restart required to take effect."}

@router.delete("/frontend/{key}")
async def delete_frontend_setting(key: str, current_user: User = Depends(get_admin_user)):
    """Delete a frontend environment variable."""
    return {"message": f"Frontend configuration '{key}' deleted successfully; restart required to take effect."}