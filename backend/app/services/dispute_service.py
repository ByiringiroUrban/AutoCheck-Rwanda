import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
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
        correction = None
        if status_val == "RESOLVED" and resolve_in.corrected_payload:
            correction = await self._apply_correction(dispute, resolve_in, admin_user_id)

        updated = await self.db.dispute.update(
            where={"id": dispute_id},
            data={
                "status": status_val,  # type: ignore
                "resolution_notes": resolve_in.resolution_notes.strip(),
                "resolved_by": admin_user_id,
                "resolved_at": now,
            },
        )
        if correction:
            from app.services.audit_service import AuditService

            await AuditService(self.db).log_action(
                actor_user_id=admin_user_id,
                action="DISPUTE_DATA_CORRECTED",
                entity_type=correction["entity_type"],
                entity_id=correction["entity_id"],
                metadata={
                    "dispute_id": dispute_id,
                    "original": correction["original"],
                    "corrected": correction["corrected"],
                },
            )
        return DisputeResponse.model_validate(updated)

    async def _apply_correction(self, dispute, resolve_in, admin_user_id: str) -> Optional[Dict[str, Any]]:
        payload = resolve_in.corrected_payload or {}
        target_type = (resolve_in.target_type or dispute.target_type or "").upper()
        if target_type == "MILEAGE_RECORD":
            target_type = "MILEAGE"
        target_id = resolve_in.target_id or dispute.target_id
        if target_type == "SERVICE_RECORD":
            row = await self.db.servicerecord.find_unique(where={"id": target_id})
            if not row:
                raise NotFoundException("Service record", target_id)
            original = {"description": row.description, "service_type": row.service_type, "mileage": row.mileage}
            data: Dict[str, Any] = {}
            if payload.get("description"):
                data["description"] = str(payload["description"]).strip()
            if payload.get("service_type"):
                data["service_type"] = str(payload["service_type"]).strip()
            if payload.get("mileage") is not None and str(payload.get("mileage")) != "":
                mileage = int(payload["mileage"])
                if mileage < 0:
                    raise BadRequestException("Mileage cannot be negative.")
                data["mileage"] = mileage
            if not data:
                return None
            await self.db.servicerecord.update(where={"id": row.id}, data=data)
            if "mileage" in data:
                await self._sync_mileage(row.vehicle_id, row.id, data["mileage"], "SERVICE_RECORD")
            await self._refresh_report_snapshots(dispute.vehicle_id, row.id, data)
            return {"entity_type": "SERVICE_RECORD", "entity_id": row.id, "original": original, "corrected": data}

        if target_type == "MILEAGE":
            row = await self.db.mileagerecord.find_unique(where={"id": target_id})
            if not row:
                raise NotFoundException("Mileage record", target_id)
            if payload.get("mileage") is None:
                return None
            mileage = int(payload["mileage"])
            if mileage < 0:
                raise BadRequestException("Mileage cannot be negative.")
            original = {"mileage": row.mileage}
            await self.db.mileagerecord.update(where={"id": row.id}, data={"mileage": mileage})
            return {"entity_type": "MILEAGE_RECORD", "entity_id": row.id, "original": original, "corrected": {"mileage": mileage}}
        return None

    async def _sync_mileage(self, vehicle_id: str, source_id: str, mileage: int, source_type: str) -> None:
        linked = await self.db.mileagerecord.find_many(where={"source_id": source_id})
        if linked:
            for item in linked:
                await self.db.mileagerecord.update(where={"id": item.id}, data={"mileage": mileage})
            return
        await self.db.mileagerecord.create(
            data={
                "vehicle_id": vehicle_id,
                "mileage": mileage,
                "source_type": source_type,
                "source_id": source_id,
            }
        )

    async def _refresh_report_snapshots(self, vehicle_id: str, service_id: str, changes: Dict[str, Any]) -> None:
        reports = await self.db.report.find_many(where={"vehicle_id": vehicle_id})
        for report in reports:
            try:
                snapshot = json.loads(report.snapshot_json)
            except Exception:
                continue
            changed = False
            for item in snapshot.get("service_history") or []:
                if item.get("id") == service_id:
                    item.update({key: value for key, value in changes.items() if key in item or key in changes})
                    changed = True
            if changed:
                await self.db.report.update(
                    where={"id": report.id},
                    data={"snapshot_json": json.dumps(snapshot)},
                )
