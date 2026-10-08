from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import AliasChoices, BaseModel, Field


class DisputeCreate(BaseModel):
    vehicle_id: str
    target_type: str = Field(..., description="SERVICE_RECORD, INSPECTION, MILEAGE, INCIDENT, VEHICLE_DETAILS")
    target_id: str
    reason: str = Field(..., min_length=5)
    details: str = Field(..., min_length=10)
    evidence_url: Optional[str] = None


class DisputeResolve(BaseModel):
    status: str = Field(..., description="RESOLVED, REJECTED, UNDER_REVIEW")
    resolution_notes: str = Field(
        ...,
        min_length=3,
        validation_alias=AliasChoices("resolution_notes", "resolution_note"),
    )
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    corrected_payload: Optional[Dict[str, Any]] = None


class DisputeResponse(BaseModel):
    id: str
    vehicle_id: str
    user_id: str
    target_type: str
    target_id: str
    reason: str
    details: str
    evidence_url: Optional[str] = None
    status: str
    resolution_notes: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
