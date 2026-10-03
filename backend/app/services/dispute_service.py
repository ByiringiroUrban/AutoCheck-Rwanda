from datetime import datetime, timezone
from typing import Optional, List
from prisma import Prisma
from app.schemas.dispute import DisputeCreate, DisputeResolve, DisputeResponse
from app.utils.exceptions import NotFoundException, BadRequestException


class DisputeService:
    def __init__(self, db: Prisma):
        self.db = db

    async def create_dispute(self, user_id: str, dispute_in: DisputeCreate) -> DisputeResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": dispute_in.vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", dispute_in.vehicle_id)

        target_type = dispute_in.target_type.upper()
        if target_type not in ["SERVICE_RECORD", "INSPECTION", "MILEAGE", "INCIDENT", "VEHICLE_DETAILS"]:
            raise BadRequestException("Invalid dispute target type")

        dispute = await self.db.dispute.create(
            data={
                "vehicle_id": dispute_in.vehicle_id,
                "user_id": user_id,
                "target_type": target_type,  # type: ignore
                "target_id": dispute_in.target_id,
                "reason": dispute_in.reason.strip(),
                "details": dispute_in.details.strip(),
                "evidence_url": dispute_in.evidence_url,
                "status": "OPEN",  # type: ignore
            }
        )
        return DisputeResponse.model_validate(dispute)

    async def get_user_disputes(self, user_id: str) -> List[DisputeResponse]:
        disputes = await self.db.dispute.find_many(
            where={"user_id": user_id},
            order={"created_at": "desc"},
        )
        return [DisputeResponse.model_validate(d) for d in disputes]

    async def get_admin_disputes(self, status_filter: Optional[str] = None) -> List[DisputeResponse]:
        where_clause = {}
        if status_filter:
            where_clause["status"] = status_filter.upper()

        disputes = await self.db.dispute.find_many(
            where=where_clause,  # type: ignore
            order={"created_at": "desc"},
        )
        return [DisputeResponse.model_validate(d) for d in disputes]

    async def resolve_dispute(
        self,
        dispute_id: str,
        admin_user_id: str,
        resolve_in: DisputeResolve
    ) -> DisputeResponse:
        dispute = await self.db.dispute.find_unique(where={"id": dispute_id})
        if not dispute:
            raise NotFoundException("Dispute", dispute_id)

        status_val = resolve_in.status.upper()
        if status_val not in ["RESOLVED", "REJECTED", "UNDER_REVIEW"]:
            raise BadRequestException("Invalid dispute resolution status")

        now = datetime.now(timezone.utc)
        updated = await self.db.dispute.update(
            where={"id": dispute_id},
            data={
                "status": status_val,  # type: ignore
                "resolution_notes": resolve_in.resolution_notes.strip(),
                "resolved_by": admin_user_id,
                "resolved_at": now,
            },
        )
        return DisputeResponse.model_validate(updated)
