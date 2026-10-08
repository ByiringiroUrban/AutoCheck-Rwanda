from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.auth import UserResponse


class OrganizationCreate(BaseModel):
    name: str = Field(..., min_length=2)
    type: str = "GARAGE"  # GARAGE, DEALER
    tin: str = Field(..., min_length=5, description="Tax Identification Number")
    location: str = Field(..., min_length=2)
    email: EmailStr
    phone: str = Field(..., min_length=6)


class OrganizationStatusUpdate(BaseModel):
    status: str  # "APPROVED", "REJECTED", "SUSPENDED"


class StaffInvite(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str = "STAFF"  # "STAFF", "MANAGER"


class StaffRoleUpdate(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None  # "ACTIVE", "INACTIVE"


class OrganizationMemberResponse(BaseModel):
    id: str
    organization_id: str
    user_id: str
    role: str
    status: str
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class OrganizationSelfUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    phone: Optional[str] = Field(None, min_length=6)
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    location: Optional[str] = None


class InventoryVehicle(BaseModel):
    id: str
    vin: str
    make: str
    model: str
    year: int
    current_plate: Optional[str] = None
    latest_mileage: Optional[int] = None


class OrganizationResponse(BaseModel):
    id: str
    name: str
    type: str
    tin: str
    location: str
    email: str
    phone: str
    status: str
    created_at: datetime
    members: Optional[List[OrganizationMemberResponse]] = None

    class Config:
        from_attributes = True
