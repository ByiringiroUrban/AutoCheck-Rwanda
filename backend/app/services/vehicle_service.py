from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from prisma import Prisma
from app.utils.normalizers import normalize_vin, normalize_plate_number, validate_vin
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    VehiclePlateCreate,
    VehiclePlateResponse,
    VehicleTimelineItem,
)
from app.utils.exceptions import NotFoundException, ConflictException, BadRequestException


class VehicleService:
    def __init__(self, db: Prisma):
        self.db = db

    async def create_vehicle(self, vehicle_in: VehicleCreate) -> VehicleResponse:
        vin = normalize_vin(vehicle_in.vin)
        if not vin:
            raise BadRequestException("Invalid VIN")

        existing = await self.db.vehicle.find_unique(where={"vin": vin})
        if existing:
            raise ConflictException(f"Vehicle with VIN '{vin}' already exists in database.")

        # Create vehicle
        vehicle = await self.db.vehicle.create(
            data={
                "vin": vin,
                "make": vehicle_in.make.strip().upper(),
                "model": vehicle_in.model.strip().upper(),
                "year": vehicle_in.year,
                "body_type": vehicle_in.body_type.upper(),
                "fuel_type": vehicle_in.fuel_type.upper(),
                "color": vehicle_in.color.upper(),
                "status": "ACTIVE",  # type: ignore
            }
        )

        # If an initial plate was provided, assign it
        current_plate_str = None
        if vehicle_in.initial_plate:
            plate_num = normalize_plate_number(vehicle_in.initial_plate)
            if plate_num:
                plate = await self.db.vehicleplate.create(
                    data={
                        "vehicle_id": vehicle.id,
                        "plate_number": plate_num,
                        "is_current": True,
                        "start_date": datetime.now(timezone.utc),
                    }
                )
                current_plate_str = plate.plate_number

        return VehicleResponse(
            id=vehicle.id,
            vin=vehicle.vin,
            make=vehicle.make,
            model=vehicle.model,
            year=vehicle.year,
            body_type=vehicle.body_type,
            fuel_type=vehicle.fuel_type,
            color=vehicle.color,
            status=vehicle.status,
            created_at=vehicle.created_at,
            updated_at=vehicle.updated_at,
            current_plate=current_plate_str,
        )

    async def get_vehicle_by_id(self, vehicle_id: str) -> VehicleResponse:
        vehicle = await self.db.vehicle.find_unique(
            where={"id": vehicle_id},
            include={
                "plates": True,
                "mileage_records": True,
            },
        )
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        current_plate = None
        if vehicle.plates:
            for p in vehicle.plates:
                if p.is_current:
                    current_plate = p.plate_number
                    break
            if not current_plate and vehicle.plates:
                current_plate = vehicle.plates[-1].plate_number

        # Sort mileage records descending
        sorted_mileage = sorted(vehicle.mileage_records or [], key=lambda r: r.recorded_at, reverse=True)
        latest_mileage = sorted_mileage[0].mileage if sorted_mileage else None

        return VehicleResponse(
            id=vehicle.id,
            vin=vehicle.vin,
            make=vehicle.make,
            model=vehicle.model,
            year=vehicle.year,
            body_type=vehicle.body_type,
            fuel_type=vehicle.fuel_type,
            color=vehicle.color,
            status=vehicle.status,
            created_at=vehicle.created_at,
            updated_at=vehicle.updated_at,
            current_plate=current_plate,
            plates=[VehiclePlateResponse.model_validate(p) for p in vehicle.plates] if vehicle.plates else [],
            latest_mileage=latest_mileage,
        )

    async def search_vehicle(self, vin: Optional[str] = None, plate: Optional[str] = None) -> Optional[VehicleResponse]:
        if not vin and not plate:
            raise BadRequestException("Either VIN or Plate Number parameter is required for search.")

        # Search by VIN first if provided
        if vin:
            norm_vin = normalize_vin(vin)
            if norm_vin:
                vehicle = await self.db.vehicle.find_unique(
                    where={"vin": norm_vin},
                )
                if vehicle:
                    return await self.get_vehicle_by_id(vehicle.id)

        # Search by Plate if provided
        if plate:
            norm_plate = normalize_plate_number(plate)
            if norm_plate:
                plate_records = await self.db.vehicleplate.find_many(
                    where={"plate_number": norm_plate},
                    order={"start_date": "desc"},
                    take=1,
                )
                if plate_records:
                    return await self.get_vehicle_by_id(plate_records[0].vehicle_id)

        return None

    async def update_vehicle(self, vehicle_id: str, update_in: VehicleUpdate) -> VehicleResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        update_data: Dict[str, Any] = {}
        if update_in.make:
            update_data["make"] = update_in.make.strip().upper()
        if update_in.model:
            update_data["model"] = update_in.model.strip().upper()
        if update_in.year:
            update_data["year"] = update_in.year
        if update_in.body_type:
            update_data["body_type"] = update_in.body_type.upper()
        if update_in.fuel_type:
            update_data["fuel_type"] = update_in.fuel_type.upper()
        if update_in.color:
            update_data["color"] = update_in.color.upper()
        if update_in.status:
            update_data["status"] = update_in.status.upper()

        if update_data:
            await self.db.vehicle.update(where={"id": vehicle_id}, data=update_data)

        return await self.get_vehicle_by_id(vehicle_id)

    async def assign_plate(self, vehicle_id: str, plate_in: VehiclePlateCreate) -> VehiclePlateResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        norm_plate = normalize_plate_number(plate_in.plate_number)
        if not norm_plate:
            raise BadRequestException("Invalid plate number")

        # If new plate is current, expire old current plates
        if plate_in.is_current:
            await self.db.vehicleplate.update_many(
                where={"vehicle_id": vehicle_id, "is_current": True},
                data={"is_current": False, "end_date": datetime.now(timezone.utc)},
            )

        new_plate = await self.db.vehicleplate.create(
            data={
                "vehicle_id": vehicle_id,
                "plate_number": norm_plate,
                "is_current": plate_in.is_current,
                "start_date": datetime.now(timezone.utc),
            }
        )
        return VehiclePlateResponse.model_validate(new_plate)

    async def get_vehicle_timeline(self, vehicle_id: str) -> List[VehicleTimelineItem]:
        """
        Compiles unified chronological history of the vehicle across:
        - Registration & plate changes
        - Garage service records
        - Structured inspections
        - AI visual damage scans
        - Reported incidents
        """
        vehicle = await self.db.vehicle.find_unique(
            where={"id": vehicle_id},
            include={
                "plates": True,
                "service_records": {"include": {"organization": True}},
                "inspections": {"include": {"organization": True, "items": True}},
                "ai_inspections": {"include": {"findings": True}},
                "incident_records": True,
            },
        )
        if not vehicle:
            raise NotFoundException("Vehicle", vehicle_id)

        timeline: List[VehicleTimelineItem] = []

        # 1. Initial Registration
        timeline.append(
            VehicleTimelineItem(
                id=f"reg-{vehicle.id}",
                event_type="REGISTRATION",
                date=vehicle.created_at,
                title="Vehicle Registered in AutoCheck System",
                description=f"Registered {vehicle.year} {vehicle.make} {vehicle.model} (VIN: {vehicle.vin})",
                source_type="SYSTEM",
            )
        )

        # 2. Plate assignments
        if vehicle.plates:
            for pl in vehicle.plates:
                timeline.append(
                    VehicleTimelineItem(
                        id=f"plate-{pl.id}",
                        event_type="PLATE_ASSIGNMENT",
                        date=pl.start_date,
                        title=f"Plate Assigned: {pl.plate_number}",
                        description=f"Assigned Rwanda Plate {pl.plate_number}" + (" (Active)" if pl.is_current else " (Historical)"),
                        source_type="REGISTRY",
                    )
                )

        # 3. Service Records
        if vehicle.service_records:
            for s in vehicle.service_records:
                org_name = s.organization.name if s.organization else "Approved Garage"
                timeline.append(
                    VehicleTimelineItem(
                        id=f"service-{s.id}",
                        event_type="SERVICE",
                        date=s.service_date,
                        title=f"Service: {s.service_type.replace('_', ' ').title()}",
                        description=s.description,
                        source_type=s.source_type,
                        source_name=org_name,
                        mileage=s.mileage,
                    )
                )

        # 4. Inspections
        if vehicle.inspections:
            for insp in vehicle.inspections:
                org_name = insp.organization.name if insp.organization else "Inspection Station"
                fail_items = [item.item for item in (insp.items or []) if item.condition == "FAIL"]
                desc = insp.summary or f"Multi-point inspection ({insp.inspection_type})"
                if fail_items:
                    desc += f" - Issues detected: {', '.join(fail_items)}"
                timeline.append(
                    VehicleTimelineItem(
                        id=f"insp-{insp.id}",
                        event_type="INSPECTION",
                        date=insp.inspected_at,
                        title=f"Inspection: {insp.inspection_type.replace('_', ' ').title()} ({insp.status})",
                        description=desc,
                        source_type="INSPECTION_GARAGE",
                        source_name=org_name,
                        mileage=insp.mileage,
                    )
                )

        # 5. AI Inspections
        if vehicle.ai_inspections:
            for ai in vehicle.ai_inspections:
                if ai.status == "COMPLETED" and ai.findings:
                    findings_summary = f"Detected {len(ai.findings)} visual exterior defects"
                    timeline.append(
                        VehicleTimelineItem(
                            id=f"ai-{ai.id}",
                            event_type="AI_INSPECTION",
                            date=ai.completed_at or ai.created_at,
                            title="AI Visual Damage Analysis",
                            description=findings_summary,
                            source_type="AI_ANALYSIS",
                            source_name=f"AutoCheck Vision ({ai.model_version})",
                        )
                    )

        # 6. Incidents
        if vehicle.incident_records:
            for inc in vehicle.incident_records:
                timeline.append(
                    VehicleTimelineItem(
                        id=f"inc-{inc.id}",
                        event_type="INCIDENT",
                        date=inc.occurred_at,
                        title=f"Incident: {inc.incident_type.replace('_', ' ').title()} ({inc.severity})",
                        description=inc.description,
                        source_type=inc.source_type,
                        severity=inc.severity,
                    )
                )

        # Sort all events chronologically descending (newest first)
        timeline.sort(key=lambda x: x.date, reverse=True)
        return timeline
