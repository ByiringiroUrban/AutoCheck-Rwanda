from typing import List, Optional
from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.report_service import ReportService
from app.services.audit_service import AuditService
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.schemas.auth import UserResponse
from app.api.deps import get_optional_user_payload, get_current_user

router = APIRouter(prefix="/reports", tags=["Vehicle History Reports"])


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_vehicle_report(
    req: ReportGenerateRequest,
    request: Request,
    user_payload: Optional[dict] = Depends(get_optional_user_payload),
    db: Prisma = Depends(get_db)
):
    """
    Generate an immutable vehicle history report snapshot.
    Accessible to public buyers as well as authenticated users.
    """
    requested_by = user_payload.get("sub") if user_payload else None
    service = ReportService(db)
    report = await service.generate_report(req.vehicle_id, requested_by=requested_by)

    audit = AuditService(db)
    await audit.log_action(
        actor_user_id=requested_by,
        action="REPORT_GENERATED",
        entity_type="REPORT",
        entity_id=report.id,
        metadata={"vehicle_id": req.vehicle_id, "score": report.score},
        ip_address=request.client.host if request.client else None
    )
    return report


@router.get("/my", response_model=List[ReportResponse])
async def get_my_reports(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """List historical reports requested by the current user."""
    service = ReportService(db)
    return await service.list_user_reports(current_user.id)


@router.get("/{id}", response_model=ReportResponse)
async def get_report_by_id(
    id: str,
    db: Prisma = Depends(get_db)
):
    """Fetch an existing report snapshot by ID."""
    service = ReportService(db)
    return await service.get_report_by_id(id)
