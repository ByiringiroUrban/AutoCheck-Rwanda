from typing import List, Optional
from fastapi import APIRouter, Depends, status, Request, Query
from prisma import Prisma
from app.db.session import get_db
from app.services.dispute_service import DisputeService
from app.services.audit_service import AuditService
from app.schemas.dispute import DisputeCreate, DisputeResolve, DisputeResponse
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(tags=["Disputes & Corrections"])


@router.post("/disputes", response_model=DisputeResponse, status_code=status.HTTP_201_CREATED)
async def create_dispute(
    dispute_in: DisputeCreate,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Create dispute regarding a vehicle record or inspection finding."""
    service = DisputeService(db)
    dispute = await service.create_dispute(current_user.id, dispute_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="DISPUTE_CREATED",
        entity_type="DISPUTE",
        entity_id=dispute.id,
        metadata={"vehicle_id": dispute.vehicle_id, "target_type": dispute.target_type},
        ip_address=request.client.host if request.client else None
    )
    return dispute


@router.get("/disputes/my", response_model=List[DisputeResponse])
async def get_my_disputes(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Get disputes submitted by the authenticated user."""
    service = DisputeService(db)
    return await service.get_user_disputes(current_user.id)


@router.get("/admin/disputes", response_model=List[DisputeResponse])
async def list_admin_disputes(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin queue of all customer and garage disputes."""
    service = DisputeService(db)
    return await service.get_admin_disputes(status_filter=status_filter)


@router.patch("/admin/disputes/{id}", response_model=DisputeResponse)
async def resolve_dispute(
    id: str,
    resolve_in: DisputeResolve,
    request: Request,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin resolution/rejection/update of a dispute with audit trail."""
    service = DisputeService(db)
    updated = await service.resolve_dispute(id, current_user.id, resolve_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="DISPUTE_RESOLVED",
        entity_type="DISPUTE",
        entity_id=id,
        metadata={"status": resolve_in.status, "notes": resolve_in.resolution_notes},
        ip_address=request.client.host if request.client else None
    )
    return updated
