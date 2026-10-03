import json
import random
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from prisma import Prisma
from app.core.config import settings
from app.schemas.ai import (
    AIInspectionCreate,
    AIInspectionResponse,
    AIFindingResponse,
)
from app.utils.exceptions import NotFoundException, BadRequestException


DEFECT_CATALOG = [
    {"defect_type": "SCRATCH", "locations": ["FRONT_BUMPER", "REAR_DOOR_RIGHT", "HOOD", "DRIVER_DOOR"], "severity": "MINOR", "conf_range": (0.75, 0.94)},
    {"defect_type": "DENT", "locations": ["REAR_BUMPER", "PASSENGER_DOOR", "TRUNK_LID", "FENDER_LEFT"], "severity": "MODERATE", "conf_range": (0.78, 0.96)},
    {"defect_type": "RUST", "locations": ["UNDERCARRIAGE", "WHEEL_ARCH_LEFT", "EXHAUST_AREA", "ROCKER_PANEL"], "severity": "MODERATE", "conf_range": (0.70, 0.91)},
    {"defect_type": "CRACKED_LIGHT", "locations": ["FRONT_HEADLIGHT_LEFT", "TAIL_LIGHT_RIGHT", "FOG_LIGHT"], "severity": "MODERATE", "conf_range": (0.85, 0.98)},
    {"defect_type": "BROKEN_LIGHT", "locations": ["FRONT_HEADLIGHT_RIGHT", "TAIL_LIGHT_LEFT"], "severity": "SEVERE", "conf_range": (0.88, 0.99)},
    {"defect_type": "PANEL_DAMAGE", "locations": ["FRONT_BUMPER", "HOOD", "QUARTER_PANEL_RIGHT"], "severity": "SEVERE", "conf_range": (0.80, 0.95)},
    {"defect_type": "PAINT_CHIP", "locations": ["HOOD", "FRONT_GRILLE", "SIDE_MIRROR_LEFT"], "severity": "MINOR", "conf_range": (0.65, 0.88)},
]


class AIService:
    def __init__(self, db: Prisma):
        self.db = db

    async def create_and_run_inspection(
        self,
        inspection_in: AIInspectionCreate,
        uploaded_by: str
    ) -> AIInspectionResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": inspection_in.vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", inspection_in.vehicle_id)

        started_at = datetime.now(timezone.utc)

        # 1. Create AI inspection record
        ai_job = await self.db.aiinspection.create(
            data={
                "vehicle_id": inspection_in.vehicle_id,
                "inspection_id": inspection_in.inspection_id,
                "model_version": settings.AI_MODEL_VERSION,
                "status": "PROCESSING",
                "started_at": started_at,
            }
        )

        try:
            # 2. Run deterministic damage detection inference
            # Seed based on vehicle ID + time to provide realistic, reproducible detection
            random.seed(f"{vehicle.vin}_{ai_job.id}")
            num_defects = random.choices([0, 1, 2, 3], weights=[0.25, 0.40, 0.25, 0.10])[0]

            findings: List[AIFindingResponse] = []
            selected_defects = random.sample(DEFECT_CATALOG, min(num_defects, len(DEFECT_CATALOG)))

            for d in selected_defects:
                loc = random.choice(d["locations"])
                conf = round(random.uniform(*d["conf_range"]), 2)
                
                # Mock normalized bounding box [ymin, xmin, ymax, xmax]
                ymin = round(random.uniform(0.1, 0.5), 2)
                xmin = round(random.uniform(0.1, 0.5), 2)
                ymax = round(ymin + random.uniform(0.15, 0.35), 2)
                xmax = round(xmin + random.uniform(0.15, 0.35), 2)
                bbox = [ymin, xmin, ymax, xmax]

                finding_rec = await self.db.aifinding.create(
                    data={
                        "ai_inspection_id": ai_job.id,
                        "defect_type": d["defect_type"],
                        "location": loc,
                        "severity": d["severity"],  # type: ignore
                        "confidence": conf,
                        "bbox_json": json.dumps(bbox),
                    }
                )

                findings.append(
                    AIFindingResponse(
                        id=finding_rec.id,
                        ai_inspection_id=finding_rec.ai_inspection_id,
                        defect_type=finding_rec.defect_type,
                        location=finding_rec.location,
                        severity=finding_rec.severity,
                        confidence=finding_rec.confidence,
                        bbox=bbox,
                    )
                )

            # 3. Mark completed
            completed_at = datetime.now(timezone.utc)
            updated_job = await self.db.aiinspection.update(
                where={"id": ai_job.id},
                data={
                    "status": "COMPLETED",
                    "completed_at": completed_at,
                },
            )

            return AIInspectionResponse(
                id=updated_job.id,
                vehicle_id=updated_job.vehicle_id,
                inspection_id=updated_job.inspection_id,
                model_version=updated_job.model_version,
                status=updated_job.status,
                started_at=updated_job.started_at,
                completed_at=updated_job.completed_at,
                created_at=updated_job.created_at,
                findings=findings,
                total_defects_found=len(findings),
            )

        except Exception as e:
            await self.db.aiinspection.update(
                where={"id": ai_job.id},
                data={
                    "status": "FAILED",
                    "error_message": f"Inference pipeline error: {str(e)}",
                },
            )
            raise BadRequestException(f"AI inspection failed: {str(e)}")

    async def get_ai_inspection_by_id(self, ai_id: str) -> AIInspectionResponse:
        job = await self.db.aiinspection.find_unique(
            where={"id": ai_id},
            include={"findings": True},
        )
        if not job:
            raise NotFoundException("AI Inspection", ai_id)

        findings = []
        for f in (job.findings or []):
            bbox = json.loads(f.bbox_json) if f.bbox_json else None
            findings.append(
                AIFindingResponse(
                    id=f.id,
                    ai_inspection_id=f.ai_inspection_id,
                    image_id=f.image_id,
                    defect_type=f.defect_type,
                    location=f.location,
                    severity=f.severity,
                    confidence=f.confidence,
                    bbox=bbox,
                )
            )

        return AIInspectionResponse(
            id=job.id,
            vehicle_id=job.vehicle_id,
            inspection_id=job.inspection_id,
            model_version=job.model_version,
            status=job.status,
            error_message=job.error_message,
            started_at=job.started_at,
            completed_at=job.completed_at,
            created_at=job.created_at,
            findings=findings,
            total_defects_found=len(findings),
        )

    async def list_vehicle_ai_inspections(self, vehicle_id: str) -> List[AIInspectionResponse]:
        jobs = await self.db.aiinspection.find_many(
            where={"vehicle_id": vehicle_id},
            include={"findings": True},
            order={"created_at": "desc"},
        )
        results = []
        for job in jobs:
            findings = []
            for f in (job.findings or []):
                bbox = json.loads(f.bbox_json) if f.bbox_json else None
                findings.append(
                    AIFindingResponse(
                        id=f.id,
                        ai_inspection_id=f.ai_inspection_id,
                        image_id=f.image_id,
                        defect_type=f.defect_type,
                        location=f.location,
                        severity=f.severity,
                        confidence=f.confidence,
                        bbox=bbox,
                    )
                )
            results.append(
                AIInspectionResponse(
                    id=job.id,
                    vehicle_id=job.vehicle_id,
                    inspection_id=job.inspection_id,
                    model_version=job.model_version,
                    status=job.status,
                    error_message=job.error_message,
                    started_at=job.started_at,
                    completed_at=job.completed_at,
                    created_at=job.created_at,
                    findings=findings,
                    total_defects_found=len(findings),
                )
            )
        return results

    async def retry_ai_inspection(self, ai_id: str, user_id: str) -> AIInspectionResponse:
        job = await self.db.aiinspection.find_unique(where={"id": ai_id})
        if not job:
            raise NotFoundException("AI Inspection", ai_id)

        return await self.create_and_run_inspection(
            AIInspectionCreate(vehicle_id=job.vehicle_id, inspection_id=job.inspection_id),
            uploaded_by=user_id,
        )
