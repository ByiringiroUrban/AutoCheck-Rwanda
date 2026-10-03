from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class AuditLogResponse(BaseModel):
    id: str
    actor_user_id: Optional[str] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    metadata_json: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SupportTicketCreate(BaseModel):
    type: str = "GENERAL_INQUIRY"  # GENERAL_INQUIRY, BUG_REPORT, DISPUTE_HELP, BILLING
    subject: str = Field(..., min_length=3)
    message: str = Field(..., min_length=10)


class SupportTicketStatusUpdate(BaseModel):
    status: str  # OPEN, IN_PROGRESS, CLOSED


class SupportTicketResponse(BaseModel):
    id: str
    user_id: str
    type: str
    subject: str
    message: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
