from typing import List
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.inspection_service import InspectionService
from app.services.garage_service import GarageService
from app.services.audit_service import AuditService
from app.schemas.inspection import (
    InspectionCreate,
    InspectionItemCreate,
    InspectionComplete,
    InspectionResponse,
    InspectionItemResponse,
)
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(tags=["Inspections"])


@router.post("/inspections", response_model=InspectionResponse, status_code=status.HTTP_201_CREATED)
async def create_inspection(
    insp_in: InspectionCreate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Create structured vehicle inspection."""
    garage_service = GarageService(db)
    user_garage = await garage_service.get_user_garage(current_user.id)
    org_id = user_garage.id if user_garage else None

    service = InspectionService(db)
    inspection = await service.create_inspection(insp_in, current_user.id, org_id)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="INSPECTION_CREATED",
        entity_type="INSPECTION",
        entity_id=inspection.id,
        metadata={"vehicle_id": inspection.vehicle_id, "type": inspection.inspection_type},
        ip_address=request.client.host if request.client else None
    )
    return inspection


@router.post("/inspections/{id}/items", response_model=InspectionItemResponse, status_code=status.HTTP_201_CREATED)
async def add_inspection_item(
    id: str,
    item_in: InspectionItemCreate,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Add structured checklist item finding to an inspection."""
    service = InspectionService(db)
    return await service.add_item(id, item_in)


@router.post("/inspections/{id}/complete", response_model=InspectionResponse)
async def complete_inspection(
    id: str,
    complete_in: InspectionComplete,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Finalize and complete an inspection."""
    service = InspectionService(db)
    inspection = await service.complete_inspection(id, complete_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="INSPECTION_COMPLETED",
        entity_type="INSPECTION",
        entity_id=id,
        metadata={"status": "COMPLETED"},
        ip_address=request.client.host if request.client else None
    )
    return inspection


@router.get("/vehicles/{id}/inspections", response_model=List[InspectionResponse])
async def list_vehicle_inspections(
    id: str,
    db: Prisma = Depends(get_db)
):
    """List inspection history for a vehicle."""
    service = InspectionService(db)
    return await service.list_vehicle_inspections(id)


@router.get("/inspections/{id}", response_model=InspectionResponse)
async def get_inspection_details(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get inspection details with item findings."""
    service = InspectionService(db)
    return await service.get_inspection_by_id(id)
