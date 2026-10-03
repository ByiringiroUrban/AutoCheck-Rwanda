from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ServiceRecordCreate(BaseModel):
    vehicle_id: str
    mileage: int = Field(..., ge=0)
    service_type: str = Field(..., description="e.g., ROUTINE_MAINTENANCE, BRAKE_SERVICE, OIL_CHANGE, MAJOR_REPAIR")
    description: str = Field(..., min_length=3)
    service_date: Optional[datetime] = None


class ServiceRecordUpdate(BaseModel):
    service_type: Optional[str] = None
    description: Optional[str] = None
    service_date: Optional[datetime] = None


class ServiceRecordResponse(BaseModel):
    id: str
    vehicle_id: str
    organization_id: Optional[str] = None
    mileage: int
    service_type: str
    description: str
    service_date: datetime
    source_type: str
    created_by: str
    created_at: datetime
    organization_name: Optional[str] = None
    creator_name: Optional[str] = None

    class Config:
        from_attributes = True
