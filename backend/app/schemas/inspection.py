from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class InspectionItemCreate(BaseModel):
    category: str = Field(..., description="ENGINE, BRAKES, SUSPENSION, TIRES_WHEELS, ELECTRICAL, EXTERIOR_BODY, INTERIOR")
    item: str = Field(..., description="e.g. Brake pad thickness, Engine oil condition")
    condition: str = "PASS"  # PASS, FAIL, WARNING, NOT_APPLICABLE
    severity: str = "NONE"   # NONE, LOW, MEDIUM, HIGH, CRITICAL
    notes: Optional[str] = None


class InspectionItemResponse(BaseModel):
    id: str
    inspection_id: str
    category: str
    item: str
    condition: str
    severity: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class InspectionCreate(BaseModel):
    vehicle_id: str
    mileage: int = Field(..., ge=0)
    inspection_type: str = "STANDARD_SAFETY"  # STANDARD_SAFETY, PRE_PURCHASE, COMPREHENSIVE
    summary: Optional[str] = None
    items: Optional[List[InspectionItemCreate]] = None


class InspectionComplete(BaseModel):
    summary: Optional[str] = None


class InspectionResponse(BaseModel):
    id: str
    vehicle_id: str
    organization_id: Optional[str] = None
    mileage: int
    inspection_type: str
    status: str
    summary: Optional[str] = None
    inspected_at: datetime
    created_by: str
    created_at: datetime
    items: Optional[List[InspectionItemResponse]] = None
    organization_name: Optional[str] = None

    class Config:
        from_attributes = True
