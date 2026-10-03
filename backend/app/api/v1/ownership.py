from typing import List
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.ownership_service import OwnershipService
from app.services.audit_service import AuditService
from app.schemas.ownership import OwnershipClaimCreate, OwnershipClaimReview, OwnershipResponse
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(prefix="/ownership", tags=["Ownership"])


@router.post("/claims", response_model=OwnershipResponse, status_code=status.HTTP_201_CREATED)
async def submit_ownership_claim(
    claim_in: OwnershipClaimCreate,
    request: Request,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Submit vehicle ownership claim with supporting evidence URL."""
    service = OwnershipService(db)
    claim = await service.submit_claim(current_user.id, claim_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="OWNERSHIP_CLAIM_SUBMITTED",
        entity_type="OWNERSHIP_CLAIM",
        entity_id=claim.id,
        metadata={"vehicle_id": claim.vehicle_id},
        ip_address=request.client.host if request.client else None
    )
    return claim


@router.get("/my-vehicles", response_model=List[OwnershipResponse])
async def get_my_vehicles(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """List vehicles registered/claimed by the authenticated user."""
    service = OwnershipService(db)
    return await service.get_user_vehicles(current_user.id)


@router.get("/claims/{id}", response_model=OwnershipResponse)
async def get_claim_details(
    id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Get ownership claim status."""
    service = OwnershipService(db)
    return await service.get_claim_by_id(id)


@router.post("/claims/{id}/approve", response_model=OwnershipResponse)
async def approve_ownership_claim(
    id: str,
    request: Request,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin endpoint to approve vehicle ownership claim."""
    service = OwnershipService(db)
    claim = await service.review_claim(id, OwnershipClaimReview(status="APPROVED"))

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="OWNERSHIP_CLAIM_APPROVED",
        entity_type="OWNERSHIP_CLAIM",
        entity_id=id,
        metadata={"reviewer": current_user.id},
        ip_address=request.client.host if request.client else None
    )
    return claim


@router.post("/claims/{id}/reject", response_model=OwnershipResponse)
async def reject_ownership_claim(
    id: str,
    request: Request,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Admin endpoint to reject vehicle ownership claim."""
    service = OwnershipService(db)
    claim = await service.review_claim(id, OwnershipClaimReview(status="REJECTED"))

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="OWNERSHIP_CLAIM_REJECTED",
        entity_type="OWNERSHIP_CLAIM",
        entity_id=id,
        metadata={"reviewer": current_user.id},
        ip_address=request.client.host if request.client else None
    )
    return claim
