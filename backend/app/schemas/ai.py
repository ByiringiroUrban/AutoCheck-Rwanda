from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field


class AIFindingResponse(BaseModel):
    id: str
    ai_inspection_id: str
    image_id: Optional[str] = None
    defect_type: str  # SCRATCH, DENT, RUST, CRACKED_LIGHT, BROKEN_LIGHT, PANEL_DAMAGE, PAINT_CHIP
    location: str     # FRONT_BUMPER, HOOD, REAR_BUMPER, LEFT_DOOR, RIGHT_FENDER, etc.
    severity: str     # MINOR, MODERATE, SEVERE
    confidence: float
    bbox: Optional[List[float]] = None  # [ymin, xmin, ymax, xmax]
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class AIInspectionCreate(BaseModel):
    vehicle_id: str
    inspection_id: Optional[str] = None
    image_urls: Optional[List[str]] = None


class AIInspectionResponse(BaseModel):
    id: str
    vehicle_id: str
    inspection_id: Optional[str] = None
    model_version: str
    status: str
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    findings: List[AIFindingResponse] = []
    total_defects_found: int = 0

    class Config:
        from_attributes = True


class PresignedUploadRequest(BaseModel):
    view_type: str = "FRONT"  # FRONT, REAR, LEFT_SIDE, RIGHT_SIDE, ROOF, INTERIOR, ENGINE_BAY, DAMAGE_DETAIL
    source_type: str = "GARAGE"


class PresignedUploadResponse(BaseModel):
    upload_url: str
    file_id: str
    view_type: str
