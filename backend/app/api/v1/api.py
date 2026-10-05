from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.vehicles import router as vehicles_router
from app.api.v1.ownership import router as ownership_router
from app.api.v1.garages import router as garages_router
from app.api.v1.service_records import router as service_records_router
from app.api.v1.inspections import router as inspections_router
from app.api.v1.ai_inspections import router as ai_inspections_router
from app.api.v1.reports import router as reports_router
from app.api.v1.disputes import router as disputes_router
from app.api.v1.support import router as support_router
from app.api.v1.admin import router as admin_router
from app.api.v1.users import router as users_router
from app.api.v1.uploads import router as uploads_router

api_router = APIRouter()

# Register modular routers
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(uploads_router)
api_router.include_router(vehicles_router)
api_router.include_router(ownership_router)
api_router.include_router(garages_router)
api_router.include_router(service_records_router)
api_router.include_router(inspections_router)
api_router.include_router(ai_inspections_router)
api_router.include_router(reports_router)
api_router.include_router(disputes_router)
api_router.include_router(support_router)
api_router.include_router(admin_router)

