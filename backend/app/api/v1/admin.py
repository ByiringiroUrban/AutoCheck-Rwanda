from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from prisma import Prisma
from app.db.session import get_db
from app.services.audit_service import AuditService
from app.schemas.audit import AuditLogResponse
from app.schemas.auth import UserResponse, UserPage, AdminUserUpdate
from app.api.deps import require_role
from app.utils.exceptions import BadRequestException, NotFoundException

router = APIRouter(prefix="/admin", tags=["Administration & Audit"])

ALLOWED_ROLES = {"OWNER", "GARAGE_STAFF", "GARAGE_MANAGER", "DEALER", "ADMIN", "SUPER_ADMIN"}
ALLOWED_STATUS = {"ACTIVE", "SUSPENDED", "PENDING"}


@router.get("/users", response_model=UserPage)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: UserResponse = Depends(require_role(["ADMIN", "SUPER_ADMIN"])),
    db: Prisma = Depends(get_db),
):
    """Paginated user directory for platform administrators."""
    where: Dict[str, Any] = {}
    if role:
        role_name = role.upper()
        if role_name not in ALLOWED_ROLES:
            raise BadRequestException("Unknown role filter.")
        where["role"] = role_name
    if search and search.strip():
        term = search.strip()
        where["OR"] = [
            {"email": {"contains": term, "mode": "insensitive"}},
            {"first_name": {"contains": term, "mode": "insensitive"}},
            {"last_name": {"contains": term, "mode": "insensitive"}},
        ]
    total = await db.user.count(where=where)
    rows = await db.user.find_many(
        where=where,
        skip=(page - 1) * limit,
        take=limit,
        order={"created_at": "desc"},
    )
    pages = max(1, (total + limit - 1) // limit)
    return UserPage(
        items=[UserResponse.model_validate(row) for row in rows],
        total=total,
        page=page,
        pages=pages,
    )


@router.patch("/users/{id}", response_model=UserResponse)
async def update_user_role(
    id: str,
    body: AdminUserUpdate,
    current_user: UserResponse = Depends(require_role(["SUPER_ADMIN"])),
    db: Prisma = Depends(get_db),
):
    """Assign a platform role or account status. Super admin only."""
    data: Dict[str, Any] = {}
    if body.role:
        role_name = body.role.upper()
        if role_name not in ALLOWED_ROLES:
            raise BadRequestException("Unknown role.")
        data["role"] = role_name
    if body.status:
        status_name = body.status.upper()
        if status_name not in ALLOWED_STATUS:
            raise BadRequestException("Unknown status.")
        data["status"] = status_name
    if not data:
        raise BadRequestException("Provide a role or a status.")
    existing = await db.user.find_unique(where={"id": id})
    if not existing:
        raise NotFoundException("User", id)
    updated = await db.user.update(where={"id": id}, data=data)
    return UserResponse.model_validate(updated)


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
