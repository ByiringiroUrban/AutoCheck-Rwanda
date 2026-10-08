import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any
from PIL import Image, ImageFilter, ImageStat
from prisma import Prisma
from app.core.config import settings
from app.schemas.ai import (
    AIInspectionCreate,
    AIInspectionResponse,
    AIFindingResponse,
)
from app.utils.exceptions import NotFoundException, BadRequestException


SURFACE_MODEL = "autocheck-surface-v1.1"
VIEW_LOCATION = {
    "FRONT": "FRONT_BUMPER",
    "REAR": "REAR_DOOR",
    "LEFT_SIDE": "DRIVER_DOOR",
    "RIGHT_SIDE": "PASSENGER_DOOR",
    "DAMAGE_DETAIL": "SIDE_PANEL",
    "ROOF": "ROOF",
    "INTERIOR": "INTERIOR",
    "ENGINE_BAY": "ENGINE_BAY",
}


def image_file_path(image_url: str) -> Path:
    relative = image_url.lstrip("/")
    if relative.startswith("uploads/"):
        relative = relative[len("uploads/") :]
    return Path(settings.UPLOAD_DIR) / relative


def analyze_surface(path: Path, view_type: str) -> List[Dict[str, Any]]:
    """Find high-contrast patches on a real photo and return bounding boxes."""
    image = Image.open(path).convert("RGB")
    small = image.resize((48, 48))
    edges = small.convert("L").filter(ImageFilter.FIND_EDGES)
    cells = []
    for grid_y in range(4):
        for grid_x in range(4):
            box = (grid_x * 12, grid_y * 12, (grid_x + 1) * 12, (grid_y + 1) * 12)
            edge_mean = ImageStat.Stat(edges.crop(box)).mean[0]
            color = ImageStat.Stat(small.crop(box)).mean
            cells.append((edge_mean, grid_x, grid_y, color))
    average = sum(item[0] for item in cells) / len(cells)
    hot = [item for item in cells if item[0] > max(18, average * 1.35)]
    hot.sort(key=lambda item: item[0], reverse=True)
    findings = []
    for edge_mean, grid_x, grid_y, color in hot[:2]:
        red, green, blue = color
        if red > green + 25 and red > blue + 15:
            defect_type, severity = "RUST", "MODERATE"
        elif edge_mean > average * 1.8:
            defect_type, severity = "DENT", "MODERATE"
        else:
            defect_type, severity = "SCRATCH", "MINOR"
        findings.append(
            {
                "defect_type": defect_type,
                "location": VIEW_LOCATION.get(view_type, "BODY_PANEL"),
                "severity": severity,
                "confidence": round(min(0.97, 0.55 + (edge_mean - average) / 255), 2),
                "bbox": [
                    round(grid_y / 4, 2),
                    round(grid_x / 4, 2),
                    round(grid_y / 4 + 0.25, 2),
                    round(grid_x / 4 + 0.25, 2),
                ],
            }
        )
    return findings


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
                "model_version": SURFACE_MODEL,
                "status": "PROCESSING",
                "started_at": started_at,
            }
        )

        try:
            images = []
            if inspection_in.image_urls:
                images = await self.db.vehicleimage.find_many(
                    where={"vehicle_id": vehicle.id, "image_url": {"in": inspection_in.image_urls}}
                )
            if not images:
                images = await self.db.vehicleimage.find_many(
                    where={"vehicle_id": vehicle.id},
                    order={"created_at": "desc"},
                    take=6,
                )

            findings: List[AIFindingResponse] = []
            for image in images:
                path = image_file_path(image.image_url)
                if not path.is_file():
                    continue
                for detected in analyze_surface(path, image.view_type or "FRONT"):
                    finding_rec = await self.db.aifinding.create(
                        data={
                            "ai_inspection_id": ai_job.id,
                            "image_id": image.id,
                            "defect_type": detected["defect_type"],
                            "location": detected["location"],
                            "severity": detected["severity"],
                            "confidence": detected["confidence"],
                            "bbox_json": json.dumps(detected["bbox"]),
                        }
                    )
                    findings.append(
                        AIFindingResponse(
                            id=finding_rec.id,
                            ai_inspection_id=finding_rec.ai_inspection_id,
                            image_id=image.id,
                            defect_type=finding_rec.defect_type,
                            location=finding_rec.location,
                            severity=finding_rec.severity,
                            confidence=finding_rec.confidence,
                            bbox=detected["bbox"],
                            image_url=image.image_url,
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
            include={"findings": {"include": {"image": True}}},
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
                    image_url=f.image.image_url if getattr(f, "image", None) else None,
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
            include={"findings": {"include": {"image": True}}},
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
                    image_url=f.image.image_url if getattr(f, "image", None) else None,
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
