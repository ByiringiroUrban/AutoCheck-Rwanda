from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from prisma import Prisma
from app.db.session import get_db
from app.services.audit_service import AuditService
from app.schemas.audit import AuditLogResponse
from app.schemas.auth import UserResponse
from app.api.deps import require_role

router = APIRouter(prefix="/admin", tags=["Administration & Audit"])


@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    limit: int = Query(100, ge=1, le=500),
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
):
    """Retrieve immutable system audit logs for administrative review."""
    service = AuditService(db)
    return await service.get_audit_logs(limit=limit)


@router.get("/stats")
async def get_system_stats(
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db)
) -> Dict[str, Any]:
    """Retrieve system overview statistics."""
    total_vehicles = await db.vehicle.count() if db.is_connected() else 0
    total_users = await db.user.count() if db.is_connected() else 0
    total_garages = await db.organization.count() if db.is_connected() else 0
    total_reports = await db.report.count() if db.is_connected() else 0
    total_inspections = await db.inspection.count() if db.is_connected() else 0
    open_disputes = await db.dispute.count(where={"status": "OPEN"}) if db.is_connected() else 0

    return {
        "total_vehicles": total_vehicles,
        "total_users": total_users,
        "total_garages": total_garages,
        "total_reports_generated": total_reports,
        "total_inspections": total_inspections,
        "open_disputes": open_disputes,
        "system_status": "OPERATIONAL",
    }
