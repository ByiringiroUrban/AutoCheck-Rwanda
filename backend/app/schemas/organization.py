from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, model_validator
from app.schemas.auth import UserResponse


class OrganizationCreate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    type: str = "GARAGE"  # GARAGE, DEALER
    applicant_type: str = "ORGANIZATION"
    tin: Optional[str] = Field(None, min_length=5, description="Tax Identification Number")
    location: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=6)

    @model_validator(mode="after")
    def validate_application(self):
        organization_type = self.type.upper()
        applicant_type = self.applicant_type.upper()

        if organization_type not in {"GARAGE", "DEALER"}:
            raise ValueError("Application type must be GARAGE or DEALER.")
        if applicant_type not in {"INDIVIDUAL", "ORGANIZATION"}:
            raise ValueError("Applicant type must be INDIVIDUAL or ORGANIZATION.")
        if organization_type == "GARAGE" and applicant_type != "ORGANIZATION":
            raise ValueError("Garage applications must be submitted by an organization.")
        if organization_type == "GARAGE" or applicant_type == "ORGANIZATION":
            if not self.name or not self.tin or not self.location or not self.email or not self.phone:
                raise ValueError("Organization applications require a name, TIN, location, email, and phone.")
        return self


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
    applicant_type: str
    tin: Optional[str] = None
    location: Optional[str] = None
    email: str
    phone: str
    status: str
    created_at: datetime
    members: Optional[List[OrganizationMemberResponse]] = None

    class Config:
        from_attributes = True
