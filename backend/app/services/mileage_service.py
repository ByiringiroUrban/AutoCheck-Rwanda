from datetime import datetime, timezone
from typing import Optional, List, Tuple
from prisma import Prisma
from app.schemas.vehicle import MileageRecordCreate, MileageRecordResponse, MileageHistoryResponse
from app.utils.exceptions import NotFoundException, BadRequestException


class MileageService:
    def __init__(self, db: Prisma):
        self.db = db

    async def record_mileage(
        self,
        vehicle_id: str,
        mileage_in: MileageRecordCreate
    ) -> MileageRecordResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        recorded_at = mileage_in.recorded_at or datetime.now(timezone.utc)

        record = await self.db.mileagerecord.create(
            data={
                "vehicle_id": vehicle_id,
                "mileage": mileage_in.mileage,
                "recorded_at": recorded_at,
                "source_type": mileage_in.source_type,
                "source_id": mileage_in.source_id,
            }
        )

        # Check if this new record causes a rollback
        history = await self.get_vehicle_mileage_history(vehicle_id)
        has_warning = any(r.id == record.id and r.has_rollback_warning for r in history.records)

        return MileageRecordResponse(
            id=record.id,
            vehicle_id=record.vehicle_id,
            mileage=record.mileage,
            recorded_at=record.recorded_at,
            source_type=record.source_type,
            source_id=record.source_id,
            has_rollback_warning=has_warning,
        )

    async def get_vehicle_mileage_history(self, vehicle_id: str) -> MileageHistoryResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        records = await self.db.mileagerecord.find_many(
            where={"vehicle_id": vehicle_id},
            order={"recorded_at": "asc"},
        )

        if not records:
            return MileageHistoryResponse(
                vehicle_id=vehicle_id,
                records=[],
                has_rollback_anomaly=False,
                latest_mileage=None,
            )

        # Analyze chronological progression for rollback detection
        annotated_records: List[MileageRecordResponse] = []
        max_seen_mileage = -1
        max_seen_date = None
        has_rollback = False
        anomaly_details: List[str] = []

        for rec in records:
            rec_warning = False
            if max_seen_mileage != -1 and rec.mileage < max_seen_mileage:
                rec_warning = True
                has_rollback = True
                date_str = rec.recorded_at.strftime("%Y-%m-%d")
                prev_date_str = max_seen_date.strftime("%Y-%m-%d") if max_seen_date else "prior date"
                anomaly_details.append(
                    f"Mileage rollback detected on {date_str}: Reading of {rec.mileage:,} km is lower than previous reading of {max_seen_mileage:,} km recorded on {prev_date_str}."
                )
            else:
                max_seen_mileage = rec.mileage
                max_seen_date = rec.recorded_at

            annotated_records.append(
                MileageRecordResponse(
                    id=rec.id,
                    vehicle_id=rec.vehicle_id,
                    mileage=rec.mileage,
                    recorded_at=rec.recorded_at,
                    source_type=rec.source_type,
                    source_id=rec.source_id,
                    has_rollback_warning=rec_warning,
                )
            )

        # Return latest reading
        latest_mileage = records[-1].mileage if records else None

        return MileageHistoryResponse(
            vehicle_id=vehicle_id,
            records=annotated_records,
            has_rollback_anomaly=has_rollback,
            anomaly_details="; ".join(anomaly_details) if anomaly_details else None,
            latest_mileage=latest_mileage,
        )
