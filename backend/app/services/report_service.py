import json
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from prisma import Prisma
from app.services.vehicle_service import VehicleService
from app.services.mileage_service import MileageService
from app.services.scoring_service import ScoringService
from app.schemas.report import (
    ReportResponse,
    VehicleReportSnapshot,
    ScoreBreakdown,
    ReportGenerateRequest,
)
from app.schemas.vehicle import VehicleResponse
from app.schemas.service import ServiceRecordResponse
from app.schemas.inspection import InspectionResponse, InspectionItemResponse
from app.schemas.ai import AIFindingResponse
from app.utils.exceptions import NotFoundException


class ReportService:
    def __init__(self, db: Prisma):
        self.db = db
        self.vehicle_service = VehicleService(db)
        self.mileage_service = MileageService(db)

    async def generate_report(self, vehicle_id: str, requested_by: Optional[str] = None) -> ReportResponse:
        # Load comprehensive vehicle graph
        vehicle = await self.db.vehicle.find_unique(
            where={"id": vehicle_id},
            include={
                "plates": True,
                "ownerships": True,
                "service_records": {"include": {"organization": True, "creator": True}},
                "inspections": {"include": {"organization": True, "items": True}},
                "ai_inspections": {"include": {"findings": True}},
                "incident_records": True,
                "disputes": True,
            },
        )
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        # 1. Mileage & Rollback Analysis
        mileage_data = await self.mileage_service.get_vehicle_mileage_history(vehicle_id)

        # 2. Extract inspection items & AI findings for scoring
        all_inspection_items = []
        for insp in (vehicle.inspections or []):
            if insp.items:
                all_inspection_items.extend(insp.items)

        latest_ai_findings = []
        if vehicle.ai_inspections:
            for ai in vehicle.ai_inspections:
                if ai.status == "COMPLETED" and ai.findings:
                    latest_ai_findings.extend(ai.findings)

        # 3. Calculate Score
        score_breakdown = ScoringService.calculate_score(
            has_mileage_rollback=mileage_data.has_rollback_anomaly,
            incident_records=vehicle.incident_records or [],
            inspection_items=all_inspection_items,
            ai_findings=latest_ai_findings,
            service_record_count=len(vehicle.service_records or []),
            is_stolen_or_flagged=(vehicle.status in ["FLAGGED", "STOLEN"]),
        )

        # 4. Compile plate history
        plate_history = [
            {
                "plate_number": p.plate_number,
                "start_date": p.start_date.isoformat(),
                "end_date": p.end_date.isoformat() if p.end_date else None,
                "is_current": p.is_current,
            }
            for p in (vehicle.plates or [])
        ]
        current_plate = None
        for p in (vehicle.plates or []):
            if p.is_current:
                current_plate = p.plate_number
                break

        # 5. Compile timeline
        timeline = await self.vehicle_service.get_vehicle_timeline(vehicle_id)

        # 6. Build structured Snapshot
        service_responses = [
            ServiceRecordResponse(
                id=s.id,
                vehicle_id=s.vehicle_id,
                organization_id=s.organization_id,
                mileage=s.mileage,
                service_type=s.service_type,
                description=s.description,
                service_date=s.service_date,
                source_type=s.source_type,
                created_by=s.created_by,
                created_at=s.created_at,
                organization_name=s.organization.name if s.organization else None,
                creator_name=f"{s.creator.first_name} {s.creator.last_name}" if s.creator else None,
            )
            for s in (vehicle.service_records or [])
        ]

        inspection_responses = [
            InspectionResponse(
                id=i.id,
                vehicle_id=i.vehicle_id,
                organization_id=i.organization_id,
                mileage=i.mileage,
                inspection_type=i.inspection_type,
                status=i.status,
                summary=i.summary,
                inspected_at=i.inspected_at,
                created_by=i.created_by,
                created_at=i.created_at,
                items=[InspectionItemResponse.model_validate(it) for it in (i.items or [])],
                organization_name=i.organization.name if i.organization else None,
            )
            for i in (vehicle.inspections or [])
        ]

        ai_defect_responses = []
        for f in latest_ai_findings:
            bbox_coords = None
            if f.bbox_json:
                try:
                    bbox_coords = json.loads(f.bbox_json)
                except Exception:
                    pass
            ai_defect_responses.append(
                AIFindingResponse(
                    id=f.id,
                    ai_inspection_id=f.ai_inspection_id,
                    image_id=f.image_id,
                    defect_type=f.defect_type,
                    location=f.location,
                    severity=f.severity,
                    confidence=f.confidence,
                    bbox=bbox_coords,
                )
            )

        ownership_count = len(vehicle.ownerships or [])
        has_verified_ownership = any(o.verified for o in (vehicle.ownerships or []))

        snapshot = VehicleReportSnapshot(
            vehicle=VehicleResponse(
                id=vehicle.id,
                vin=vehicle.vin,
                make=vehicle.make,
                model=vehicle.model,
                year=vehicle.year,
                body_type=vehicle.body_type,
                fuel_type=vehicle.fuel_type,
                color=vehicle.color,
                status=vehicle.status,
                created_at=vehicle.created_at,
                updated_at=vehicle.updated_at,
                current_plate=current_plate,
                latest_mileage=mileage_data.latest_mileage,
            ),
            current_plate=current_plate,
            plate_history=plate_history,
            ownership_count=ownership_count,
            verified_ownership=has_verified_ownership,
            latest_mileage=mileage_data.latest_mileage,
            mileage_rollback_warning=mileage_data.has_rollback_anomaly,
            score=score_breakdown,
            service_history=service_responses,
            inspection_history=inspection_responses,
            ai_visible_defects=ai_defect_responses,
            timeline=timeline,
            dispute_count=len(vehicle.disputes or []),
            disclaimer="AutoCheck Rwanda history reports are compiled from participating licensed garages, inspection centers, owner claims, and AI vision assessments. Score is calculated deterministically based on recorded data.",
        )

        # 7. Persist immutable Report record
        report_record = await self.db.report.create(
            data={
                "vehicle_id": vehicle_id,
                "requested_by": requested_by,
                "score": score_breakdown.total_score,
                "score_breakdown_json": score_breakdown.model_dump_json(),
                "snapshot_json": snapshot.model_dump_json(),
                "status": "GENERATED",
            }
        )

        return ReportResponse(
            id=report_record.id,
            vehicle_id=vehicle_id,
            requested_by=requested_by,
            generated_at=report_record.generated_at,
            score=score_breakdown.total_score,
            score_breakdown=score_breakdown,
            snapshot=snapshot,
            status=report_record.status,
            created_at=report_record.created_at,
        )

    async def get_report_by_id(self, report_id: str) -> ReportResponse:
        report = await self.db.report.find_unique(where={"id": report_id})
        if not report:
            raise NotFoundException("Report", report_id)

        score_breakdown = ScoreBreakdown.model_validate_json(report.score_breakdown_json)
        snapshot = VehicleReportSnapshot.model_validate_json(report.snapshot_json)

        return ReportResponse(
            id=report.id,
            vehicle_id=report.vehicle_id,
            requested_by=report.requested_by,
            generated_at=report.generated_at,
            score=report.score,
            score_breakdown=score_breakdown,
            snapshot=snapshot,
            status=report.status,
            created_at=report.created_at,
        )

    async def list_user_reports(self, user_id: str) -> List[ReportResponse]:
        reports = await self.db.report.find_many(
            where={"requested_by": user_id},
            order={"created_at": "desc"},
        )
        results = []
        for r in reports:
            score_breakdown = ScoreBreakdown.model_validate_json(r.score_breakdown_json)
            snapshot = VehicleReportSnapshot.model_validate_json(r.snapshot_json)
            results.append(
                ReportResponse(
                    id=r.id,
                    vehicle_id=r.vehicle_id,
                    requested_by=r.requested_by,
                    generated_at=r.generated_at,
                    score=r.score,
                    score_breakdown=score_breakdown,
                    snapshot=snapshot,
                    status=r.status,
                    created_at=r.created_at,
                )
            )
        return results
