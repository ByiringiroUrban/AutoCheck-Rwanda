from datetime import datetime, timezone
from typing import Optional, List
from prisma import Prisma
from app.schemas.inspection import (
    InspectionCreate,
    InspectionItemCreate,
    InspectionComplete,
    InspectionResponse,
    InspectionItemResponse,
)
from app.utils.exceptions import NotFoundException, BadRequestException


class InspectionService:
    def __init__(self, db: Prisma):
        self.db = db

    async def create_inspection(
        self,
        insp_in: InspectionCreate,
        user_id: str,
        organization_id: Optional[str] = None
    ) -> InspectionResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": insp_in.vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", insp_in.vehicle_id)

        now = datetime.now(timezone.utc)
        inspection = await self.db.inspection.create(
            data={
                "vehicle_id": insp_in.vehicle_id,
                "organization_id": organization_id,
                "mileage": insp_in.mileage,
                "inspection_type": insp_in.inspection_type.upper(),
                "status": "DRAFT",
                "summary": insp_in.summary,
                "inspected_at": now,
                "created_by": user_id,
            },
            include={"organization": True, "items": True},
        )

        # Record mileage entry
        await self.db.mileagerecord.create(
            data={
                "vehicle_id": insp_in.vehicle_id,
                "mileage": insp_in.mileage,
                "recorded_at": now,
                "source_type": "INSPECTION",
                "source_id": inspection.id,
            }
        )

        # Insert items if provided upfront
        if insp_in.items:
            for item in insp_in.items:
                await self.db.inspectionitem.create(
                    data={
                        "inspection_id": inspection.id,
                        "category": item.category.upper(),
                        "item": item.item.strip(),
                        "condition": item.condition.upper(),  # type: ignore
                        "severity": item.severity.upper(),    # type: ignore
                        "notes": item.notes,
                    }
                )

        return await self.get_inspection_by_id(inspection.id)

    async def add_item(self, inspection_id: str, item_in: InspectionItemCreate) -> InspectionItemResponse:
        inspection = await self.db.inspection.find_unique(where={"id": inspection_id})
        if not inspection:
            raise NotFoundException("Inspection", inspection_id)

        item = await self.db.inspectionitem.create(
            data={
                "inspection_id": inspection_id,
                "category": item_in.category.upper(),
                "item": item_in.item.strip(),
                "condition": item_in.condition.upper(),  # type: ignore
                "severity": item_in.severity.upper(),    # type: ignore
                "notes": item_in.notes,
            }
        )
        return InspectionItemResponse.model_validate(item)

    async def complete_inspection(self, inspection_id: str, complete_in: Optional[InspectionComplete] = None) -> InspectionResponse:
        inspection = await self.db.inspection.find_unique(
            where={"id": inspection_id},
            include={"items": True},
        )
        if not inspection:
            raise NotFoundException("Inspection", inspection_id)

        update_data = {"status": "COMPLETED"}
        if complete_in and complete_in.summary:
            update_data["summary"] = complete_in.summary
        elif not inspection.summary:
            # Generate summary based on items
            fails = [it.item for it in (inspection.items or []) if it.condition == "FAIL"]
            if fails:
                update_data["summary"] = f"Completed with issues in {len(fails)} item(s): {', '.join(fails[:3])}"
            else:
                update_data["summary"] = "All inspection checklist items passed successfully."

        await self.db.inspection.update(where={"id": inspection_id}, data=update_data)  # type: ignore
        return await self.get_inspection_by_id(inspection_id)

    async def get_inspection_by_id(self, inspection_id: str) -> InspectionResponse:
        inspection = await self.db.inspection.find_unique(
            where={"id": inspection_id},
            include={"organization": True, "items": True},
        )
        if not inspection:
            raise NotFoundException("Inspection", inspection_id)

        org_name = inspection.organization.name if inspection.organization else None
        items = [InspectionItemResponse.model_validate(it) for it in (inspection.items or [])]

        return InspectionResponse(
            id=inspection.id,
            vehicle_id=inspection.vehicle_id,
            organization_id=inspection.organization_id,
            mileage=inspection.mileage,
            inspection_type=inspection.inspection_type,
            status=inspection.status,
            summary=inspection.summary,
            inspected_at=inspection.inspected_at,
            created_by=inspection.created_by,
            created_at=inspection.created_at,
            items=items,
            organization_name=org_name,
        )

    async def list_vehicle_inspections(self, vehicle_id: str) -> List[InspectionResponse]:
        inspections = await self.db.inspection.find_many(
            where={"vehicle_id": vehicle_id},
            include={"organization": True, "items": True},
            order={"inspected_at": "desc"},
        )
        return [
            InspectionResponse(
                id=i.id,
                vehicle_id=i.vehicle_id,
                organization_id=i.organization_id,
                mileage=i.mileage,
                inspection_type=i.inspection_type,
                status=i.status,
                summary=i.summary,
                inspected_at=i.inspected_at,
                created_by=i.created_by,
                created_at=i.created_at,
                items=[InspectionItemResponse.model_validate(it) for it in (i.items or [])],
                organization_name=i.organization.name if i.organization else None,
            )
            for i in inspections
        ]
