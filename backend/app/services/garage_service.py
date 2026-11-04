from datetime import datetime, timezone
from typing import Optional, List
from prisma import Prisma
from app.schemas.organization import (
    OrganizationCreate,
    OrganizationResponse,
    OrganizationStatusUpdate,
    StaffInvite,
    StaffRoleUpdate,
    OrganizationMemberResponse,
)
from app.core.security import get_password_hash
from app.utils.exceptions import (
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
)


class GarageService:
    def __init__(self, db: Prisma):
        self.db = db

    async def submit_application(self, user_id: str, app_in: OrganizationCreate) -> OrganizationResponse:
        applicant = await self.db.user.find_unique(where={"id": user_id})
        if not applicant:
            raise NotFoundException("User", user_id)

        organization_type = app_in.type.upper()
        applicant_type = app_in.applicant_type.upper()
        tin = app_in.tin.strip() if app_in.tin else None
        location = app_in.location.strip() if app_in.location else None
        name = app_in.name.strip() if app_in.name else None

        if tin:
            existing_tin = await self.db.organization.find_unique(where={"tin": tin})
            if existing_tin:
                raise ConflictException(f"Organization with TIN '{tin}' is already registered.")

        if organization_type == "DEALER" and applicant_type == "INDIVIDUAL":
            name = f"{applicant.first_name} {applicant.last_name}".strip()
            tin = None
            location = None

        email = str(app_in.email or applicant.email).lower()
        phone = (app_in.phone or applicant.phone or "").strip()
        if not phone:
            raise BadRequestException("A contact phone number is required for the application.")

        org = await self.db.organization.create(
            data={
                "name": name,
                "type": organization_type,  # type: ignore
                "applicant_type": applicant_type,  # type: ignore
                "tin": tin,
                "location": location,
                "email": email,
                "phone": phone,
                "status": "PENDING",  # type: ignore
            }
        )

        # Make the submitting user the OWNER/Manager of this organization
        await self.db.organizationmember.create(
            data={
                "organization_id": org.id,
                "user_id": user_id,
                "role": "OWNER",
                "status": "ACTIVE",
            }
        )

        return await self.get_organization_by_id(org.id)

    async def get_organization_by_id(self, org_id: str) -> OrganizationResponse:
        org = await self.db.organization.find_unique(
            where={"id": org_id},
            include={"members": {"include": {"user": True}}},
        )
        if not org:
            raise NotFoundException("Organization", org_id)
        return OrganizationResponse.model_validate(org)

    async def get_user_garage(self, user_id: str) -> Optional[OrganizationResponse]:
        membership = await self.db.organizationmember.find_first(
            where={"user_id": user_id, "status": "ACTIVE"},
            include={"organization": {"include": {"members": {"include": {"user": True}}}}},
        )
        if not membership or not membership.organization:
            return None
        return OrganizationResponse.model_validate(membership.organization)

    async def list_pending_organizations(self) -> List[OrganizationResponse]:
        orgs = await self.db.organization.find_many(
            where={"status": "PENDING"},
            include={"members": {"include": {"user": True}}},
            order={"created_at": "desc"},
        )
        return [OrganizationResponse.model_validate(o) for o in orgs]

    async def update_organization_status(self, org_id: str, status_in: OrganizationStatusUpdate) -> OrganizationResponse:
        org = await self.db.organization.find_unique(where={"id": org_id})
        if not org:
            raise NotFoundException("Organization", org_id)

        status_val = status_in.status.upper()
        if status_val not in ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]:
            raise BadRequestException("Invalid organization status")

        updated = await self.db.organization.update(
            where={"id": org_id},
            data={"status": status_val},  # type: ignore
            include={"members": {"include": {"user": True}}},
        )

        if status_val == "APPROVED" and org.type == "DEALER":
            applicant_members = await self.db.organizationmember.find_many(
                where={"organization_id": org_id, "role": "OWNER", "status": "ACTIVE"},
                include={"user": True},
            )
            for member in applicant_members:
                if member.user and member.user.role not in {"ADMIN", "SUPER_ADMIN", "DEALER"}:
                    await self.db.user.update(
                        where={"id": member.user.id},
                        data={"role": "DEALER"},
                    )

        return OrganizationResponse.model_validate(updated)

    async def invite_staff(self, org_id: str, invite_in: StaffInvite) -> OrganizationMemberResponse:
        org = await self.db.organization.find_unique(where={"id": org_id})
        if not org:
            raise NotFoundException("Organization", org_id)

        # Check if user already exists or create new
        user = await self.db.user.find_unique(where={"email": invite_in.email.lower()})
        if not user:
            # Create user with default initial password
            user = await self.db.user.create(
                data={
                    "email": invite_in.email.lower(),
                    "first_name": invite_in.first_name,
                    "last_name": invite_in.last_name,
                    "phone": invite_in.phone,
                    "password_hash": get_password_hash("AutoCheck@2026"),
                    "role": "GARAGE_STAFF",
                    "status": "ACTIVE",
                }
            )

        # Check if already a member of this organization
        existing_member = await self.db.organizationmember.find_unique(
            where={"organization_id_user_id": {"organization_id": org_id, "user_id": user.id}}
        )
        if existing_member:
            raise ConflictException(f"User is already associated with this organization.")

        role_val = invite_in.role.upper() if invite_in.role else "STAFF"
        member = await self.db.organizationmember.create(
            data={
                "organization_id": org_id,
                "user_id": user.id,
                "role": role_val,  # type: ignore
                "status": "ACTIVE",
            },
            include={"user": True},
        )
        return OrganizationMemberResponse.model_validate(member)

    async def list_staff(self, org_id: str) -> List[OrganizationMemberResponse]:
        members = await self.db.organizationmember.find_many(
            where={"organization_id": org_id},
            include={"user": True},
            order={"created_at": "desc"},
        )
        return [OrganizationMemberResponse.model_validate(m) for m in members]

    async def update_staff(self, member_id: str, update_in: StaffRoleUpdate) -> OrganizationMemberResponse:
        member = await self.db.organizationmember.find_unique(where={"id": member_id})
        if not member:
            raise NotFoundException("Staff member", member_id)

        data_dict = {}
        if update_in.role:
            data_dict["role"] = update_in.role.upper()
        if update_in.status:
            data_dict["status"] = update_in.status.upper()

        if data_dict:
            member = await self.db.organizationmember.update(
                where={"id": member_id},
                data=data_dict,
                include={"user": True},
            )
        return OrganizationMemberResponse.model_validate(member)
