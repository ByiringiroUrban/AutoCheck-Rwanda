from typing import List
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.service_record_service import ServiceRecordService
from app.services.garage_service import GarageService
from app.services.audit_service import AuditService
from app.schemas.service import ServiceRecordCreate, ServiceRecordResponse
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(tags=["Service & Maintenance Records"])


@router.post("/service-records", response_model=ServiceRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_service_record(
    record_in: ServiceRecordCreate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN", "OWNER"])),
    db: Prisma = Depends(get_db)
):
    """
    Create maintenance or repair record.
    Automatically assigns organizational provenance if user belongs to an approved garage.
    """
    garage_service = GarageService(db)
    user_garage = await garage_service.get_user_garage(current_user.id)
    
    org_id = user_garage.id if user_garage else None
    source_type = "APPROVED_GARAGE" if user_garage else ("SYSTEM_ADMIN" if current_user.role in ["ADMIN", "SUPER_ADMIN"] else "VEHICLE_OWNER")

    service = ServiceRecordService(db)
    record = await service.create_record(
        record_in=record_in,
        user_id=current_user.id,
        organization_id=org_id,
        source_type=source_type,
    )

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="SERVICE_RECORD_CREATED",
        entity_type="SERVICE_RECORD",
        entity_id=record.id,
        metadata={"vehicle_id": record.vehicle_id, "mileage": record.mileage, "service_type": record.service_type},
        ip_address=request.client.host if request.client else None
    )
    return record


@router.get("/vehicles/{id}/service-records", response_model=List[ServiceRecordResponse])
async def list_vehicle_service_records(
    id: str,
    db: Prisma = Depends(get_db)
):
    """List chronological service history for a specific vehicle."""
    service = ServiceRecordService(db)
    return await service.list_vehicle_service_records(id)


@router.get("/service-records/{id}", response_model=ServiceRecordResponse)
async def get_service_record_details(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get service record details and provenance."""
    service = ServiceRecordService(db)
    return await service.get_record_by_id(id)
