from datetime import datetime, timezone
from typing import Optional, List
from prisma import Prisma
from app.schemas.ownership import OwnershipClaimCreate, OwnershipClaimReview, OwnershipResponse
from app.schemas.vehicle import VehicleResponse
from app.utils.exceptions import NotFoundException, ConflictException, BadRequestException


class OwnershipService:
    def __init__(self, db: Prisma):
        self.db = db

    async def submit_claim(self, user_id: str, claim_in: OwnershipClaimCreate) -> OwnershipResponse:
        vehicle = await self.db.vehicle.find_unique(where={"id": claim_in.vehicle_id})
        if not vehicle:
            raise NotFoundException("Vehicle", claim_in.vehicle_id)

        # Check existing active or pending claim by this user
        existing = await self.db.vehicleownership.find_first(
            where={
                "vehicle_id": claim_in.vehicle_id,
                "user_id": user_id,
                "status": {"in": ["PENDING", "APPROVED"]},
            }
        )
        if existing:
            raise ConflictException("You already have an active or pending ownership claim for this vehicle.")

        claim = await self.db.vehicleownership.create(
            data={
                "vehicle_id": claim_in.vehicle_id,
                "user_id": user_id,
                "evidence_url": claim_in.evidence_url,
                "status": "PENDING",
                "verified": False,
                "start_date": datetime.now(timezone.utc),
            },
            include={"vehicle": True, "user": True},
        )
        return OwnershipResponse.model_validate(claim)

    async def get_user_vehicles(self, user_id: str) -> List[OwnershipResponse]:
        claims = await self.db.vehicleownership.find_many(
            where={"user_id": user_id, "status": {"in": ["PENDING", "APPROVED"]}},
            include={
                "vehicle": {
                    "include": {
                        "plates": True,
                        "mileage_records": True,
                    }
                }
            },
            order={"created_at": "desc"},
        )
        return [OwnershipResponse.model_validate(c) for c in claims]

    async def get_claim_by_id(self, claim_id: str) -> OwnershipResponse:
        claim = await self.db.vehicleownership.find_unique(
            where={"id": claim_id},
            include={"vehicle": True, "user": True},
        )
        if not claim:
            raise NotFoundException("Ownership claim", claim_id)
        return OwnershipResponse.model_validate(claim)

    async def review_claim(self, claim_id: str, review_in: OwnershipClaimReview) -> OwnershipResponse:
        claim = await self.db.vehicleownership.find_unique(where={"id": claim_id})
        if not claim:
            raise NotFoundException("Ownership claim", claim_id)

        status_val = review_in.status.upper()
        if status_val not in ["APPROVED", "REJECTED"]:
            raise BadRequestException("Review status must be either 'APPROVED' or 'REJECTED'")

        verified = (status_val == "APPROVED")

        updated = await self.db.vehicleownership.update(
            where={"id": claim_id},
            data={
                "status": status_val,  # type: ignore
                "verified": verified,
            },
            include={"vehicle": True, "user": True},
        )
        return OwnershipResponse.model_validate(updated)
