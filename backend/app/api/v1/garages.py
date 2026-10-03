from typing import List
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.garage_service import GarageService
from app.services.audit_service import AuditService
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationStatusUpdate,
    StaffInvite,
    StaffRoleUpdate,
    OrganizationMemberResponse,
)
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role
from app.utils.exceptions import NotFoundException, ForbiddenException

router = APIRouter(prefix="/garages", tags=["Garages & Organizations"])


@router.post("/applications", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def submit_garage_application(
    app_in: OrganizationCreate,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Submit garage/dealer onboarding application."""
    service = GarageService(db)
    org = await service.submit_application(current_user.id, app_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="GARAGE_APPLICATION_SUBMITTED",
        entity_type="ORGANIZATION",
        entity_id=org.id,
        metadata={"tin": org.tin, "name": org.name},
        ip_address=request.client.host if request.client else None
    )
    return org


@router.get("/me", response_model=OrganizationResponse)
async def get_my_garage_profile(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Get organization profile for authenticated garage/dealer member."""
    service = GarageService(db)
    org = await service.get_user_garage(current_user.id)
    if not org:
        raise NotFoundException("Garage association for current user", current_user.id)
    return org


@router.get("/staff", response_model=List[OrganizationMemberResponse])
async def list_garage_staff(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """List staff members of current user's garage."""
    service = GarageService(db)
    org = await service.get_user_garage(current_user.id)
    if not org:
        raise ForbiddenException("User is not associated with an approved garage.")
    return await service.list_staff(org.id)


@router.post("/staff", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED)
async def invite_garage_staff(
    invite_in: StaffInvite,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN", "OWNER"])),
    db: Prisma = Depends(get_db)
):
    """Invite/create staff member for current user's garage."""
    service = GarageService(db)
    org = await service.get_user_garage(current_user.id)
    if not org:
        raise ForbiddenException("User is not associated with an organization.")
    
    member = await service.invite_staff(org.id, invite_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="GARAGE_STAFF_INVITED",
        entity_type="ORGANIZATION_MEMBER",
        entity_id=member.id,
        metadata={"invited_email": invite_in.email, "role": invite_in.role},
        ip_address=request.client.host if request.client else None
    )
    return member


@router.patch("/staff/{id}", response_model=OrganizationMemberResponse)
async def update_staff_status(
    id: str,
    update_in: StaffRoleUpdate,
    current_user: UserResponse = Depends(require_role(["GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Change staff member role or status (Active/Inactive)."""
    service = GarageService(db)
    return await service.update_staff(id, update_in)


@router.get("/pending", response_model=List[OrganizationResponse])
async def list_pending_garages(
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin endpoint to list pending organization applications."""
    service = GarageService(db)
    return await service.list_pending_organizations()


@router.patch("/{id}/status", response_model=OrganizationResponse)
async def update_organization_status(
    id: str,
    status_in: OrganizationStatusUpdate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin endpoint to approve, reject, or suspend an organization."""
    service = GarageService(db)
    org = await service.update_organization_status(id, status_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="ORGANIZATION_STATUS_UPDATED",
        entity_type="ORGANIZATION",
        entity_id=id,
        metadata={"new_status": status_in.status},
        ip_address=request.client.host if request.client else None
    )
    return org
