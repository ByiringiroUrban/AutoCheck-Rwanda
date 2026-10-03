from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.vehicle_service import VehicleService
from app.services.mileage_service import MileageService
from app.services.audit_service import AuditService
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    VehiclePlateCreate,
    VehiclePlateResponse,
    MileageRecordCreate,
    MileageRecordResponse,
    MileageHistoryResponse,
    VehicleTimelineItem,
)
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role
from app.utils.exceptions import NotFoundException

router = APIRouter(prefix="/vehicles", tags=["Vehicles & Search"])


@router.get("/search", response_model=VehicleResponse)
async def search_vehicle(
    vin: Optional[str] = Query(None, description="Vehicle Identification Number (17 chars)"),
    plate: Optional[str] = Query(None, description="Rwanda Plate Number (e.g. RAA 123 A)"),
    db: Prisma = Depends(get_db)
):
    """
    Search vehicle identity by VIN or Rwanda plate number.
    Publicly accessible endpoint.
    """
    service = VehicleService(db)
    result = await service.search_vehicle(vin=vin, plate=plate)
    if not result:
        search_term = vin or plate or ""
        raise NotFoundException("Vehicle", search_term)
    return result


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    vehicle_in: VehicleCreate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "DEALER", "ADMIN", "SUPER_ADMIN", "OWNER"])),
    db: Prisma = Depends(get_db)
):
    """
    Create canonical vehicle identity.
    Accessible to authorized roles (Garages, Dealers, Admins, and Owners).
    """
    service = VehicleService(db)
    vehicle = await service.create_vehicle(vehicle_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="VEHICLE_CREATED",
        entity_type="VEHICLE",
        entity_id=vehicle.id,
        metadata={"vin": vehicle.vin, "make": vehicle.make, "model": vehicle.model},
        ip_address=request.client.host if request.client else None
    )
    return vehicle


@router.get("/{id}", response_model=VehicleResponse)
async def get_vehicle_details(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get vehicle details by internal vehicle ID."""
    service = VehicleService(db)
    return await service.get_vehicle_by_id(id)


@router.patch("/{id}", response_model=VehicleResponse)
async def update_vehicle(
    id: str,
    update_in: VehicleUpdate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN", "GARAGE_MANAGER"])),
    db: Prisma = Depends(get_db)
):
    """Update controlled vehicle master fields."""
    service = VehicleService(db)
    updated = await service.update_vehicle(id, update_in)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="VEHICLE_UPDATED",
        entity_type="VEHICLE",
        entity_id=id,
        metadata=update_in.model_dump(exclude_none=True),
        ip_address=request.client.host if request.client else None
    )
    return updated


@router.get("/{id}/timeline", response_model=List[VehicleTimelineItem])
async def get_vehicle_timeline(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get unified chronological history of all vehicle events."""
    service = VehicleService(db)
    return await service.get_vehicle_timeline(id)


@router.get("/{id}/mileage", response_model=MileageHistoryResponse)
async def get_vehicle_mileage(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get chronological odometer history and rollback anomaly status."""
    mileage_service = MileageService(db)
    return await mileage_service.get_vehicle_mileage_history(id)


@router.post("/{id}/mileage", response_model=MileageRecordResponse, status_code=status.HTTP_201_CREATED)
async def record_vehicle_mileage(
    id: str,
    mileage_in: MileageRecordCreate,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN", "OWNER"])),
    db: Prisma = Depends(get_db)
):
    """Manually add a verified odometer reading."""
    mileage_service = MileageService(db)
    return await mileage_service.record_mileage(id, mileage_in)


@router.post("/{id}/plates", response_model=VehiclePlateResponse, status_code=status.HTTP_201_CREATED)
async def assign_vehicle_plate(
    id: str,
    plate_in: VehiclePlateCreate,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Assign or transition to a new Rwanda license plate."""
    service = VehicleService(db)
    return await service.assign_plate(id, plate_in)
