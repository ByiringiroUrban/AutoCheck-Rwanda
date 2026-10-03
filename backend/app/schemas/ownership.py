from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.vehicle import VehicleResponse
from app.schemas.auth import UserResponse


class OwnershipClaimCreate(BaseModel):
    vehicle_id: str
    evidence_url: Optional[str] = None


class OwnershipClaimReview(BaseModel):
    status: str  # "APPROVED", "REJECTED"
    notes: Optional[str] = None


class OwnershipResponse(BaseModel):
    id: str
    vehicle_id: str
    user_id: str
    verified: bool
    start_date: datetime
    end_date: Optional[datetime] = None
    evidence_url: Optional[str] = None
    status: str
    created_at: datetime
    vehicle: Optional[VehicleResponse] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
