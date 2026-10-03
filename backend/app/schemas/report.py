from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.vehicle import VehicleResponse, VehicleTimelineItem
from app.schemas.service import ServiceRecordResponse
from app.schemas.inspection import InspectionResponse
from app.schemas.ai import AIFindingResponse


class ScoreDeduction(BaseModel):
    category: str
    reason: str
    points_deducted: int


class ScoreBreakdown(BaseModel):
    total_score: int = Field(..., ge=0, le=100)
    rating: str  # "EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL_RISK"
    formula_version: str = "autocheck-score-v1.0"
    base_score: int = 100
    deductions: List[ScoreDeduction] = []
    summary: str


class VehicleReportSnapshot(BaseModel):
    vehicle: VehicleResponse
    current_plate: Optional[str] = None
    plate_history: List[Dict[str, Any]] = []
    ownership_count: int = 0
    verified_ownership: bool = False
    latest_mileage: Optional[int] = None
    mileage_rollback_warning: bool = False
    score: ScoreBreakdown
    service_history: List[ServiceRecordResponse] = []
    inspection_history: List[InspectionResponse] = []
    ai_visible_defects: List[AIFindingResponse] = []
    timeline: List[VehicleTimelineItem] = []
    dispute_count: int = 0
    disclaimer: str


class ReportGenerateRequest(BaseModel):
    vehicle_id: str


class ReportResponse(BaseModel):
    id: str
    vehicle_id: str
    requested_by: Optional[str] = None
    generated_at: datetime
    score: int
    score_breakdown: ScoreBreakdown
    snapshot: VehicleReportSnapshot
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
