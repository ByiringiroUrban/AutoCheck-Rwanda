import asyncio
import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from datetime import datetime, timezone, timedelta
from prisma import Prisma
from app.core.security import get_password_hash
from app.services.scoring_service import ScoringService
from app.schemas.report import VehicleReportSnapshot, ScoreBreakdown
from app.schemas.vehicle import VehicleResponse, VehicleTimelineItem
from app.schemas.service import ServiceRecordResponse
from app.schemas.inspection import InspectionResponse, InspectionItemResponse
from app.schemas.ai import AIFindingResponse


async def seed():
    db = Prisma()
    print("Connecting to Neon PostgreSQL for database seeding...")
    await db.connect()

    print("Clearing old seed data (if any)...")
    # Note: cascading deletes handle relational tables

    print("1. Creating Users with different roles...")
    # Admin
    admin_user = await db.user.upsert(
        where={"email": "admin@autocheck.rw"},
        data={
            "create": {
                "email": "admin@autocheck.rw",
                "password_hash": get_password_hash("Admin@2026!"),
                "first_name": "System",
                "last_name": "Admin",
                "phone": "+250788111222",
                "role": "SUPER_ADMIN",
                "status": "ACTIVE",
            },
            "update": {"role": "SUPER_ADMIN", "status": "ACTIVE"},
        },
    )

    # Garage Manager
    garage_manager = await db.user.upsert(
        where={"email": "manager@kigaligarage.rw"},
        data={
            "create": {
                "email": "manager@kigaligarage.rw",
                "password_hash": get_password_hash("Garage@2026!"),
                "first_name": "Jean-Pierre",
                "last_name": "Nshimiyimana",
                "phone": "+250788333444",
                "role": "GARAGE_MANAGER",
                "status": "ACTIVE",
            },
            "update": {"role": "GARAGE_MANAGER", "status": "ACTIVE"},
        },
    )

    # Vehicle Owner
    owner_user = await db.user.upsert(
        where={"email": "owner@autocheck.rw"},
        data={
            "create": {
                "email": "owner@autocheck.rw",
                "password_hash": get_password_hash("Owner@2026!"),
                "first_name": "Emmanuel",
                "last_name": "Kayitana",
                "phone": "+250788555666",
                "role": "OWNER",
                "status": "ACTIVE",
            },
            "update": {"role": "OWNER", "status": "ACTIVE"},
        },
    )

    print("2. Creating Approved Garages & Inspection Centers...")
    garage = await db.organization.upsert(
        where={"tin": "100234567"},
        data={
            "create": {
                "name": "Kigali Premier Motors & Inspection Center",
                "type": "GARAGE",
                "tin": "100234567",
                "location": "Gikondo Industrial Zone, Kigali",
                "email": "service@kigaligarage.rw",
                "phone": "+250788999888",
                "status": "APPROVED",
            },
            "update": {"status": "APPROVED"},
        },
    )

    # Add Manager to Garage
    await db.organizationmember.upsert(
        where={"organization_id_user_id": {"organization_id": garage.id, "user_id": garage_manager.id}},
        data={
            "create": {
                "organization_id": garage.id,
                "user_id": garage_manager.id,
                "role": "MANAGER",
                "status": "ACTIVE",
            },
            "update": {"role": "MANAGER", "status": "ACTIVE"},
        },
    )

    print("3. Creating Sample Vehicles with Rwandan Plates...")
    # Vehicle 1: Clean History (Toyota RAV4 - RAD 123 A)
    v1 = await db.vehicle.upsert(
        where={"vin": "1HGCR2F83HA123456"},
        data={
            "create": {
                "vin": "1HGCR2F83HA123456",
                "make": "TOYOTA",
                "model": "RAV4 HYBRID",
                "year": 2022,
                "body_type": "SUV",
                "fuel_type": "HYBRID",
                "color": "PEARL WHITE",
                "status": "ACTIVE",
            },
            "update": {},
        },
    )

    # Assign Plate to V1
    await db.vehicleplate.delete_many(where={"vehicle_id": v1.id})
    await db.vehicleplate.create(
        data={
            "vehicle_id": v1.id,
            "plate_number": "RAD 123 A",
            "is_current": True,
            "start_date": datetime.now(timezone.utc) - timedelta(days=365),
        }
    )

    # Ownership claim for V1
    await db.vehicleownership.delete_many(where={"vehicle_id": v1.id})
    await db.vehicleownership.create(
        data={
            "vehicle_id": v1.id,
            "user_id": owner_user.id,
            "verified": True,
            "status": "APPROVED",
            "start_date": datetime.now(timezone.utc) - timedelta(days=300),
        }
    )

    # Mileage records for V1
    await db.mileagerecord.delete_many(where={"vehicle_id": v1.id})
    await db.mileagerecord.create(
        data={
            "vehicle_id": v1.id,
            "mileage": 15000,
            "recorded_at": datetime.now(timezone.utc) - timedelta(days=200),
            "source_type": "SERVICE_RECORD",
        }
    )
    await db.mileagerecord.create(
        data={
            "vehicle_id": v1.id,
            "mileage": 32000,
            "recorded_at": datetime.now(timezone.utc) - timedelta(days=40),
            "source_type": "INSPECTION",
        }
    )

    # Service record for V1
    await db.servicerecord.delete_many(where={"vehicle_id": v1.id})
    await db.servicerecord.create(
        data={
            "vehicle_id": v1.id,
            "organization_id": garage.id,
            "mileage": 15000,
            "service_type": "ROUTINE_MAINTENANCE",
            "description": "Scheduled 15,000 km routine maintenance. Synthetic oil change, oil filter, air filter and tire rotation.",
            "service_date": datetime.now(timezone.utc) - timedelta(days=200),
            "source_type": "APPROVED_GARAGE",
            "created_by": garage_manager.id,
        }
    )

    # Inspection for V1
    await db.inspection.delete_many(where={"vehicle_id": v1.id})
    insp1 = await db.inspection.create(
        data={
            "vehicle_id": v1.id,
            "organization_id": garage.id,
            "mileage": 32000,
            "inspection_type": "STANDARD_SAFETY",
            "status": "COMPLETED",
            "summary": "Full multi-point safety inspection completed. Excellent mechanical and structural condition.",
            "inspected_at": datetime.now(timezone.utc) - timedelta(days=40),
            "created_by": garage_manager.id,
        }
    )

    # Checklist items for insp1
    checklist_items = [
        ("ENGINE", "Engine Oil Condition & Level", "PASS", "NONE"),
        ("BRAKES", "Front & Rear Brake Pads Wear", "PASS", "NONE"),
        ("SUSPENSION", "Shock Absorbers & Bushings", "PASS", "NONE"),
        ("TIRES_WHEELS", "Tire Tread Depth & Pressure", "PASS", "NONE"),
        ("ELECTRICAL", "Battery Health & Alternator Voltage", "PASS", "NONE"),
        ("EXTERIOR_BODY", "Chassis Alignment & Rust Inspection", "PASS", "NONE"),
    ]
    for cat, item, cond, sev in checklist_items:
        await db.inspectionitem.create(
            data={
                "inspection_id": insp1.id,
                "category": cat,
                "item": item,
                "condition": cond,  # type: ignore
                "severity": sev,    # type: ignore
            }
        )

    # AI Inspection for V1
    await db.aiinspection.delete_many(where={"vehicle_id": v1.id})
    ai1 = await db.aiinspection.create(
        data={
            "vehicle_id": v1.id,
            "inspection_id": insp1.id,
            "model_version": "autocheck-vision-v1.0",
            "status": "COMPLETED",
            "started_at": datetime.now(timezone.utc) - timedelta(days=40),
            "completed_at": datetime.now(timezone.utc) - timedelta(days=40),
        }
    )

    # Small scratch finding
    await db.aifinding.create(
        data={
            "ai_inspection_id": ai1.id,
            "defect_type": "PAINT_CHIP",
            "location": "FRONT_BUMPER",
            "severity": "MINOR",
            "confidence": 0.88,
            "bbox_json": json.dumps([0.15, 0.20, 0.25, 0.35]),
        }
    )

    # Vehicle 2: Vehicle with Prior Major History (Hyundai Tucson - RAC 789 B)
    v2 = await db.vehicle.upsert(
        where={"vin": "KM8J33A46NU654321"},
        data={
            "create": {
                "vin": "KM8J33A46NU654321",
                "make": "HYUNDAI",
                "model": "TUCSON",
                "year": 2020,
                "body_type": "SUV",
                "fuel_type": "DIESEL",
                "color": "MIDNIGHT BLUE",
                "status": "ACTIVE",
            },
            "update": {},
        },
    )

    # Plates for V2
    await db.vehicleplate.delete_many(where={"vehicle_id": v2.id})
    await db.vehicleplate.create(
        data={
            "vehicle_id": v2.id,
            "plate_number": "RAC 789 B",
            "is_current": True,
            "start_date": datetime.now(timezone.utc) - timedelta(days=700),
        }
    )

    # Incident for V2
    await db.incidentrecord.delete_many(where={"vehicle_id": v2.id})
    await db.incidentrecord.create(
        data={
            "vehicle_id": v2.id,
            "incident_type": "ACCIDENT",
            "severity": "MAJOR",
            "occurred_at": datetime.now(timezone.utc) - timedelta(days=150),
            "source_type": "POLICE_REPORT",
            "description": "Front right side collision reported. Right fender and headlight replaced.",
        }
    )

    # Mileage for V2
    await db.mileagerecord.delete_many(where={"vehicle_id": v2.id})
    await db.mileagerecord.create(
        data={
            "vehicle_id": v2.id,
            "mileage": 85000,
            "recorded_at": datetime.now(timezone.utc) - timedelta(days=100),
            "source_type": "SERVICE_RECORD",
        }
    )

    print("Seeding completed successfully!")
    print("\n-------------------------------------------")
    print("Demo Credentials Created in Neon PostgreSQL:")
    print("  1. Admin User:")
    print("     - Email:    admin@autocheck.rw")
    print("     - Password: Admin@2026!")
    print("     - Role:     SUPER_ADMIN")
    print("\n  2. Garage Manager:")
    print("     - Email:    manager@kigaligarage.rw")
    print("     - Password: Garage@2026!")
    print("     - Role:     GARAGE_MANAGER")
    print("\n  3. Vehicle Owner:")
    print("     - Email:    owner@autocheck.rw")
    print("     - Password: Owner@2026!")
    print("     - Role:     OWNER")
    print("\nSample Vehicles Ready for Search:")
    print("  - Search VIN:   1HGCR2F83HA123456  or Plate: RAD 123 A (Toyota RAV4)")
    print("  - Search VIN:   KM8J33A46NU654321  or Plate: RAC 789 B (Hyundai Tucson)")
    print("-------------------------------------------\n")

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(seed())
