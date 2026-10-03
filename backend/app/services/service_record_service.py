from datetime import datetime, timezone
from typing import Optional, List
from prisma import Prisma
from app.schemas.service import ServiceRecordCreate, ServiceRecordUpdate, ServiceRecordResponse
from app.utils.exceptions import NotFoundException, BadRequestException


class ServiceRecordService:
    def __init__(self, db: Prisma):
        self.db = db

    async def create_record(
        self,
        record_in: ServiceRecordCreate,
        user_id: str,
        organization_id: Optional[str] = None,
        source_type: str = "APPROVED_GARAGE"
    ) -> ServiceRecordResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": record_in.vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", record_in.vehicle_id)

        service_date = record_in.service_date or datetime.now(timezone.utc)

        record = await self.db.servicerecord.create(
            data={
                "vehicle_id": record_in.vehicle_id,
                "organization_id": organization_id,
                "mileage": record_in.mileage,
                "service_type": record_in.service_type.upper(),
                "description": record_in.description.strip(),
                "service_date": service_date,
                "source_type": source_type,  # type: ignore
                "created_by": user_id,
            },
            include={"organization": True, "creator": True},
        )

        # Record mileage entry simultaneously
        await self.db.mileagerecord.create(
            data={
                "vehicle_id": record_in.vehicle_id,
                "mileage": record_in.mileage,
                "recorded_at": service_date,
                "source_type": "SERVICE_RECORD",
                "source_id": record.id,
            }
        )

        org_name = record.organization.name if record.organization else None
        creator_name = f"{record.creator.first_name} {record.creator.last_name}" if record.creator else None

        return ServiceRecordResponse(
            id=record.id,
            vehicle_id=record.vehicle_id,
            organization_id=record.organization_id,
            mileage=record.mileage,
            service_type=record.service_type,
            description=record.description,
            service_date=record.service_date,
            source_type=record.source_type,
            created_by=record.created_by,
            created_at=record.created_at,
            organization_name=org_name,
            creator_name=creator_name,
        )

    async def get_record_by_id(self, record_id: str) -> ServiceRecordResponse:
        record = await self.db.servicerecord.find_unique(
            where={"id": record_id},
            include={"organization": True, "creator": True},
        )
        if not record:
            raise NotFoundException("Service record", record_id)

        org_name = record.organization.name if record.organization else None
        creator_name = f"{record.creator.first_name} {record.creator.last_name}" if record.creator else None

        return ServiceRecordResponse(
            id=record.id,
            vehicle_id=record.vehicle_id,
            organization_id=record.organization_id,
            mileage=record.mileage,
            service_type=record.service_type,
            description=record.description,
            service_date=record.service_date,
            source_type=record.source_type,
            created_by=record.created_by,
            created_at=record.created_at,
            organization_name=org_name,
            creator_name=creator_name,
        )

    async def list_vehicle_service_records(self, vehicle_id: str) -> List[ServiceRecordResponse]:
        records = await self.db.servicerecord.find_many(
            where={"vehicle_id": vehicle_id},
            include={"organization": True, "creator": True},
            order={"service_date": "desc"},
        )
        results = []
        for record in records:
            org_name = record.organization.name if record.organization else None
            creator_name = f"{record.creator.first_name} {record.creator.last_name}" if record.creator else None
            results.append(
                ServiceRecordResponse(
                    id=record.id,
                    vehicle_id=record.vehicle_id,
                    organization_id=record.organization_id,
                    mileage=record.mileage,
                    service_type=record.service_type,
                    description=record.description,
                    service_date=record.service_date,
                    source_type=record.source_type,
                    created_by=record.created_by,
                    created_at=record.created_at,
                    organization_name=org_name,
                    creator_name=creator_name,
                )
            )
        return results
