import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.db.session import connect_db, disconnect_db
from app.api.v1.api import api_router
from app.utils.exceptions import AppException

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("autocheck_backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AutoCheck Rwanda Backend...")
    # Connect database
    await connect_db()
    # Ensure upload directory exists
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    yield
    logger.info("Shutting down AutoCheck Rwanda Backend...")
    await disconnect_db()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# AutoCheck Rwanda - Centralized Vehicle History & Verification API

The backend platform for vehicle provenance, verified maintenance records, Rwanda plate history, AI-assisted visible damage inspections, and multi-point garage evaluations.

## Key Capabilities:
* **Vehicle Master Registry & Rwandan Plate History:** Track canonical VINs and historical plate assignments.
* **Service & Inspection Records:** Approved garages submit tamper-evident repair events and multi-point checklists.
* **Odometer History & Rollback Anomaly Detection:** Real-time analysis detecting mileage tampering.
* **AutoCheck Risk Score Engine:** Explainable 0-100 score formula evaluating accident, maintenance, and inspection health.
* **AI Visual Damage Inspection:** Automated defect detection (scratches, dents, rust, broken lights) with localized bounding boxes.
* **Dispute & Correction Workflow:** Transparent resolution pipeline maintaining full audit traceability.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Global Exception Handler
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code or "APPLICATION_ERROR",
            "detail": exc.detail,
        },
        headers=exc.headers,
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "detail": "An unexpected error occurred. Please try again later.",
        },
    )


# Mount static files for uploads
uploads_dir = Path(settings.UPLOAD_DIR)
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


# Root & Health Check Endpoints
@app.get("/", tags=["Health"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    from app.db.session import db
    db_connected = db.is_connected()
    return {
        "status": "healthy",
        "database": "connected" if db_connected else "disconnected",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }
