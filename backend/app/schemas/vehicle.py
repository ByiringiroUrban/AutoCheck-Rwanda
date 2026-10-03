from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from app.utils.normalizers import normalize_vin, normalize_plate_number, validate_vin


class VehiclePlateCreate(BaseModel):
    plate_number: str
    is_current: bool = True


class VehiclePlateResponse(BaseModel):
    id: str
    vehicle_id: str
    plate_number: str
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool

    class Config:
        from_attributes = True


class VehicleCreate(BaseModel):
    vin: str = Field(..., min_length=17, max_length=17, description="17-character normalized VIN")
    make: str = Field(..., min_length=1)
    model: str = Field(..., min_length=1)
    year: int = Field(..., ge=1900, le=2100)
    body_type: str = "SEDAN"
    fuel_type: str = "PETROL"
    color: str = "UNKNOWN"
    initial_plate: Optional[str] = None

    @field_validator("vin")
    @classmethod
    def validate_and_normalize_vin(cls, v: str) -> str:
        normalized = normalize_vin(v)
        valid, err = validate_vin(normalized or "")
        if not valid:
            raise ValueError(err)
        return normalized  # type: ignore

    @field_validator("initial_plate")
    @classmethod
    def clean_plate(cls, v: Optional[str]) -> Optional[str]:
        return normalize_plate_number(v) if v else None


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    body_type: Optional[str] = None
    fuel_type: Optional[str] = None
    color: Optional[str] = None
    status: Optional[str] = None


class VehicleResponse(BaseModel):
    id: str
    vin: str
    make: str
    model: str
    year: int
    body_type: str
    fuel_type: str
    color: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    current_plate: Optional[str] = None
    plates: Optional[List[VehiclePlateResponse]] = None
    latest_mileage: Optional[int] = None

    class Config:
        from_attributes = True


class MileageRecordCreate(BaseModel):
    mileage: int = Field(..., ge=0, description="Odometer reading in kilometers")
    recorded_at: Optional[datetime] = None
    source_type: str = "MANUAL_ENTRY"
    source_id: Optional[str] = None


class MileageRecordResponse(BaseModel):
    id: str
    vehicle_id: str
    mileage: int
    recorded_at: datetime
    source_type: str
    source_id: Optional[str] = None
    has_rollback_warning: bool = False

    class Config:
        from_attributes = True


class MileageHistoryResponse(BaseModel):
    vehicle_id: str
    records: List[MileageRecordResponse]
    has_rollback_anomaly: bool = False
    anomaly_details: Optional[str] = None
    latest_mileage: Optional[int] = None


class VehicleTimelineItem(BaseModel):
    id: str
    event_type: str  # "REGISTRATION", "PLATE_ASSIGNMENT", "SERVICE", "INSPECTION", "AI_INSPECTION", "INCIDENT", "DISPUTE"
    date: datetime
    title: str
    description: str
    source_type: str
    source_name: Optional[str] = None
    mileage: Optional[int] = None
    severity: Optional[str] = None
    metadata: Optional[Any] = None
