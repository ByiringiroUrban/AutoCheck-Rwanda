from typing import List, Optional
from fastapi import APIRouter, Depends, status, Request, UploadFile, File, Form
from prisma import Prisma
from app.db.session import get_db
from app.services.ai_service import AIService
from app.services.audit_service import AuditService
from app.utils.file_storage import save_uploaded_file
from app.schemas.ai import (
    AIInspectionCreate,
    AIInspectionResponse,
    PresignedUploadResponse,
)
from app.schemas.auth import UserResponse
from app.api.deps import get_current_user, require_role

router = APIRouter(tags=["AI Inspections & Vision"])


@router.post("/vehicles/{id}/images", response_model=PresignedUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_vehicle_image(
    id: str,
    file: UploadFile = File(...),
    view_type: str = Form("FRONT"),
    source_type: str = Form("GARAGE"),
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Upload vehicle image for evidence / AI damage processing."""
    rel_url, abs_path = await save_uploaded_file(file, subfolder="vehicle_images")

    img_rec = await db.vehicleimage.create(
        data={
            "vehicle_id": id,
            "uploaded_by": current_user.id,
            "image_url": rel_url,
            "view_type": view_type.upper(),
            "source_type": source_type.upper(),
        }
    )

    return PresignedUploadResponse(
        upload_url=rel_url,
        file_id=img_rec.id,
        view_type=img_rec.view_type,
    )


@router.post("/ai-inspections", response_model=AIInspectionResponse, status_code=status.HTTP_201_CREATED)
async def create_ai_inspection(
    job_in: AIInspectionCreate,
    request: Request,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN", "OWNER"])),
    db: Prisma = Depends(get_db)
):
    """Create and trigger an AI visible damage analysis pipeline."""
    service = AIService(db)
    result = await service.create_and_run_inspection(job_in, uploaded_by=current_user.id)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=current_user.id,
        action="AI_INSPECTION_RUN",
        entity_type="AI_INSPECTION",
        entity_id=result.id,
        metadata={"vehicle_id": result.vehicle_id, "defects_detected": result.total_defects_found},
        ip_address=request.client.host if request.client else None
    )
    return result


@router.get("/ai-inspections/{id}", response_model=AIInspectionResponse)
async def get_ai_inspection_status(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Get AI inspection processing status and localized findings."""
    service = AIService(db)
    return await service.get_ai_inspection_by_id(id)


@router.get("/vehicles/{id}/ai-inspections", response_model=List[AIInspectionResponse])
async def list_vehicle_ai_inspections(
    id: str,
    db: Prisma = Depends(get_db)
):
    """List historical AI damage scans for a vehicle."""
    service = AIService(db)
    return await service.list_vehicle_ai_inspections(id)


@router.post("/ai-inspections/{id}/retry", response_model=AIInspectionResponse)
async def retry_ai_inspection(
    id: str,
    current_user: UserResponse = Depends(require_role(["GARAGE_STAFF", "GARAGE_MANAGER", "ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Retry an AI analysis job."""
    service = AIService(db)
    return await service.retry_ai_inspection(id, current_user.id)
