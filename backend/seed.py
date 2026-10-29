"""
Seed script for AutoCheck Rwanda.
Populates standard users across all roles, sample garages, vehicles,
plates, service records, multi-point inspections, and AI damage scans.

Run with:
    python seed.py
"""

import asyncio
from datetime import datetime, timezone, timedelta
from app.db.session import db, connect_db, disconnect_db
from app.core.security import get_password_hash

async def seed():
    print("Connecting to database...")
    await connect_db()
    if not db.is_connected():
        print("Error: Could not connect to database. Check your DATABASE_URL in .env")
        return
    print("Database connected.")

    default_password = "Password123!"
    hashed_pwd = get_password_hash(default_password)

    # -------------------------------------------------------------
    # 1. USERS & ROLES
    # -------------------------------------------------------------
    users_data = [
        {
            "email": "admin@autocheck.rw",
            "first_name": "Eric",
            "last_name": "Mugisha",
            "phone": "+250788111222",
            "role": "ADMIN",
            "status": "ACTIVE",
        },
        {
            "email": "garage@kigaligarage.rw",
            "first_name": "Jean-Pierre",
            "last_name": "Habimana",
            "phone": "+250788333444",
            "role": "GARAGE_MANAGER",
            "status": "ACTIVE",
        },
        {
            "email": "mechanic@kigaligarage.rw",
            "first_name": "Alexis",
            "last_name": "Kamanzi",
            "phone": "+250788555666",
            "role": "GARAGE_STAFF",
            "status": "ACTIVE",
        },
        {
            "email": "dealer@kigalicarhub.rw",
            "first_name": "Christian",
            "last_name": "Bizimana",
            "phone": "+250788777888",
            "role": "DEALER",
            "status": "ACTIVE",
        },
        {
            "email": "owner@gmail.com",
            "first_name": "Alice",
            "last_name": "Uwase",
            "phone": "+250788999000",
            "role": "OWNER",
            "status": "ACTIVE",
        },
    ]

    created_users = {}
    for u in users_data:
        existing = await db.user.find_unique(where={"email": u["email"]})
        if not existing:
            created = await db.user.create(
                data={
                    "email": u["email"],
                    "password_hash": hashed_pwd,
                    "first_name": u["first_name"],
                    "last_name": u["last_name"],
                    "phone": u["phone"],
                    "role": u["role"],
                    "status": u["status"],
                }
            )
            created_users[u["email"]] = created
            print(f"Created user: {u['email']} ({u['role']})")
        else:
            created_users[u["email"]] = existing
            print(f"User exists: {u['email']}")

    # -------------------------------------------------------------
    # 2. ORGANIZATIONS (Garages / Dealers)
    # -------------------------------------------------------------
    garage_user = created_users["garage@kigaligarage.rw"]
    mechanic_user = created_users["mechanic@kigaligarage.rw"]

    garage = await db.organization.find_unique(where={"tin": "100234567"})
    if not garage:
        garage = await db.organization.create(
            data={
                "name": "Kigali Premier Auto Service",
                "type": "GARAGE",
                "tin": "100234567",
                "location": "Gikondo Industrial Zone, Kigali",
                "email": "contact@kigaligarage.rw",
                "phone": "+250788333444",
                "status": "APPROVED",
            }
        )
        print("Created Garage: Kigali Premier Auto Service")

        # Add staff memberships
        await db.organizationmember.create(
            data={
                "organization_id": garage.id,
                "user_id": garage_user.id,
                "role": "MANAGER",
                "status": "ACTIVE",
            }
        )
        await db.organizationmember.create(
            data={
                "organization_id": garage.id,
                "user_id": mechanic_user.id,
                "role": "STAFF",
                "status": "ACTIVE",
            }
        )
    else:
        print("Garage exists: Kigali Premier Auto Service")

    # -------------------------------------------------------------
    # 3. SAMPLE VEHICLES FOR PITCHING & SEARCH
    # -------------------------------------------------------------
    # Vehicle 1: Perfect condition Toyota RAV4 (High Score ~94)
    v1_vin = "JT3HP10V277019284"
    v1_plate = "RAC 123A"
    
    # Vehicle 2: Toyota Hilux with Accidents & Rollback Flag (Caution Score ~58)
    v2_vin = "AHTFR22G908123456"
    v2_plate = "RAD 456B"

    # Vehicle 3: Clean Hyundai Tucson recently inspected
    v3_vin = "KM8J33A48LU112233"
    v3_plate = "RAE 789C"

    vehicles_data = [
        {
            "vin": v1_vin,
            "make": "Toyota",
            "model": "RAV4 Limited 4WD",
            "year": 2020,
            "body_type": "SUV",
            "fuel_type": "Petrol",
            "color": "Silver Metallic",
            "plate": v1_plate,
            "owner": created_users["owner@gmail.com"],
        },
        {
            "vin": v2_vin,
            "make": "Toyota",
            "model": "Hilux Double Cab D-4D",
            "year": 2018,
            "body_type": "Pickup",
            "fuel_type": "Diesel",
            "color": "White",
            "plate": v2_plate,
            "owner": created_users["dealer@kigalicarhub.rw"],
        },
        {
            "vin": v3_vin,
            "make": "Hyundai",
            "model": "Tucson GL",
            "year": 2021,
            "body_type": "SUV",
            "fuel_type": "Petrol",
            "color": "Dark Gray",
            "plate": v3_plate,
            "owner": created_users["owner@gmail.com"],
        },
    ]

    for item in vehicles_data:
        v = await db.vehicle.find_unique(where={"vin": item["vin"]})
        if not v:
            v = await db.vehicle.create(
                data={
                    "vin": item["vin"],
                    "make": item["make"],
                    "model": item["model"],
                    "year": item["year"],
                    "body_type": item["body_type"],
                    "fuel_type": item["fuel_type"],
                    "color": item["color"],
                    "status": "ACTIVE",
                }
            )
            print(f"Created Vehicle: {item['make']} {item['model']} (VIN: {item['vin']})")

            # Create current plate
            await db.vehicleplate.create(
                data={
                    "vehicle_id": v.id,
                    "plate_number": item["plate"],
                    "is_current": True,
                }
            )

            # Assign ownership
            await db.vehicleownership.create(
                data={
                    "vehicle_id": v.id,
                    "user_id": item["owner"].id,
                    "verified": True,
                    "status": "APPROVED",
                }
            )

            # Mileage records & Service for Vehicle 1 (Clean trajectory)
            if item["vin"] == v1_vin:
                # Mileages
                await db.mileagerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "mileage": 32000,
                        "source_type": "APPROVED_GARAGE",
                        "recorded_at": datetime.now(timezone.utc) - timedelta(days=280),
                    }
                )
                await db.mileagerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "mileage": 45000,
                        "source_type": "APPROVED_GARAGE",
                        "recorded_at": datetime.now(timezone.utc) - timedelta(days=120),
                    }
                )
                await db.mileagerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "mileage": 52100,
                        "source_type": "APPROVED_GARAGE",
                        "recorded_at": datetime.now(timezone.utc) - timedelta(days=20),
                    }
                )

                # Service records
                await db.servicerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "organization_id": garage.id,
                        "created_by": mechanic_user.id,
                        "mileage": 52100,
                        "service_type": "Periodic Maintenance & Oil Change",
                        "description": "Replaced synthetic engine oil, oil filter, air filter, and checked brake pads (80% remaining).",
                        "source_type": "APPROVED_GARAGE",
                    }
                )

                # Multi-point inspection
                insp = await db.inspection.create(
                    data={
                        "vehicle_id": v.id,
                        "organization_id": garage.id,
                        "created_by": mechanic_user.id,
                        "mileage": 52100,
                        "inspection_type": "Comprehensive 150-Point Inspection",
                        "status": "COMPLETED",
                        "summary": "Vehicle in pristine mechanical and cosmetic condition. Clean title, no structural repairs.",
                    }
                )
                await db.inspectionitem.create(
                    data={
                        "inspection_id": insp.id,
                        "category": "Braking System",
                        "item": "Front & Rear Discs and Pads",
                        "condition": "PASS",
                        "severity": "NONE",
                        "notes": "Excellent response, no uneven wear.",
                    }
                )
                await db.inspectionitem.create(
                    data={
                        "inspection_id": insp.id,
                        "category": "Engine & Transmission",
                        "item": "Fluid Leaks & Transmission shifting",
                        "condition": "PASS",
                        "severity": "NONE",
                        "notes": "No active leaks detected. Smooth automatic engagement.",
                    }
                )

            # Mileage & Incidents for Vehicle 2 (Has accident & rollback warning)
            if item["vin"] == v2_vin:
                # Prior high mileage
                await db.mileagerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "mileage": 140000,
                        "source_type": "APPROVED_GARAGE",
                        "recorded_at": datetime.now(timezone.utc) - timedelta(days=365),
                    }
                )
                # Tampered low mileage (Rollback!)
                await db.mileagerecord.create(
                    data={
                        "vehicle_id": v.id,
                        "mileage": 85000,
                        "source_type": "APPROVED_GARAGE",
                        "recorded_at": datetime.now(timezone.utc) - timedelta(days=30),
                    }
                )
                # Incident
                await db.incidentrecord.create(
                    data={
                        "vehicle_id": v.id,
                        "incident_type": "ACCIDENT",
                        "severity": "MODERATE",
                        "occurred_at": datetime.now(timezone.utc) - timedelta(days=180),
                        "source_type": "INSURANCE_POLICE_REPORT",
                        "description": "Front-right bumper and fender collision at Nyabugogo intersection. Airbags did not deploy.",
                    }
                )

    await disconnect_db()
    print("\n=======================================================")
    print("             SEEDING COMPLETED SUCCESSFULLY!           ")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(seed())

