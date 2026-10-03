from typing import List
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.audit_service import AuditService
from app.schemas.audit import (
    SupportTicketCreate,
    SupportTicketResponse,
    SupportTicketStatusUpdate,
)
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(prefix="/support", tags=["Support & Help Desk"])


@router.post("/tickets", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
async def create_support_ticket(
    ticket_in: SupportTicketCreate,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Submit a support ticket."""
    service = AuditService(db)
    ticket = await service.create_support_ticket(current_user.id, ticket_in)
    return ticket


@router.get("/my-tickets", response_model=List[SupportTicketResponse])
async def list_my_tickets(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """List tickets opened by current user."""
    service = AuditService(db)
    return await service.get_user_tickets(current_user.id)


@router.get("/admin/tickets", response_model=List[SupportTicketResponse])
async def list_all_tickets(
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin queue of all user support tickets."""
    service = AuditService(db)
    return await service.list_all_tickets()


@router.patch("/admin/tickets/{id}", response_model=SupportTicketResponse)
async def update_ticket_status(
    id: str,
    status_in: SupportTicketStatusUpdate,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin endpoint to update support ticket status."""
    service = AuditService(db)
    return await service.update_ticket_status(id, status_in)
