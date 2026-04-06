from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from core.enums import ParticipantRole, Status

class RegistrationsBase(BaseModel):
    """Base properties shared across multiple schemas"""
    registration_type: str
    participant_role: ParticipantRole
    status: Status
    institution_name: Optional[str] = None
    institution_country: Optional[str] = None
    institution_email: Optional[str] = None
    institution_phone: Optional[str] = None
    number_of_participants: Optional[int] = None
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    country: Optional[str] = None
    university: Optional[str] = None
    dietary_requirements: Optional[str] = None
    special_needs: Optional[str] = None

class RegistrationsData(RegistrationsBase):
    """Schema for creating a new registration"""
    pass

class RegistrationsUpdateData(BaseModel):
    """Schema for partial updates (all fields optional)"""
    registration_type: Optional[str] = None
    participant_role: Optional[ParticipantRole] = None
    status: Optional[Status] = None
    institution_name: Optional[str] = None
    institution_country: Optional[str] = None
    institution_email: Optional[str] = None
    institution_phone: Optional[str] = None
    number_of_participants: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    university: Optional[str] = None
    dietary_requirements: Optional[str] = None
    special_needs: Optional[str] = None

class RegistrationsResponse(RegistrationsBase):
    """Schema for returning a registration to the client"""
    id: int
    user_id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class RegistrationsListResponse(BaseModel):
    """Schema for paginated list responses"""
    items: List[RegistrationsResponse]
    total: int
    skip: int
    limit: int

# --- Batch Operation Schemas ---

class RegistrationsBatchCreateRequest(BaseModel):
    items: List[RegistrationsData]

class RegistrationsBatchUpdateItem(BaseModel):
    id: int
    updates: RegistrationsUpdateData

class RegistrationsBatchUpdateRequest(BaseModel):
    items: List[RegistrationsBatchUpdateItem]

class RegistrationsBatchDeleteRequest(BaseModel):
    ids: List[int]