from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from pydantic import ValidationError
from app.schemas.organization import OrganizationCreate
from app.schemas.organization import OrganizationResponse, OrganizationStatusUpdate
from app.services.garage_service import GarageService


def test_individual_dealer_application_does_not_require_organization_details():
    application = OrganizationCreate(
        type="DEALER",
        applicant_type="INDIVIDUAL",
        email="dealer@example.rw",
        phone="+250788123456",
    )

    assert application.name is None
    assert application.tin is None
    assert application.location is None


def test_organization_dealer_application_requires_business_details():
    with pytest.raises(ValidationError):
        OrganizationCreate(
            type="DEALER",
            applicant_type="ORGANIZATION",
            email="dealer@example.rw",
            phone="+250788123456",
        )


def test_garage_application_still_requires_organization_details():
    with pytest.raises(ValidationError):
        OrganizationCreate(
            type="GARAGE",
            email="garage@example.rw",
            phone="+250788123456",
        )


def test_complete_garage_application_remains_valid():
    application = OrganizationCreate(
        name="Kigali Garage",
        type="GARAGE",
        tin="123456789",
        location="Kigali",
        email="garage@example.rw",
        phone="+250788123456",
    )

    assert application.applicant_type == "ORGANIZATION"


@pytest.mark.anyio
async def test_individual_dealer_application_uses_account_identity_and_saves_optional_org_fields():
    db = SimpleNamespace(
        user=SimpleNamespace(
            find_unique=AsyncMock(
                return_value=SimpleNamespace(
                    id="user-1",
                    first_name="Aline",
                    last_name="Uwase",
                    email="aline@example.rw",
                    phone="+250788123456",
                )
            )
        ),
        organization=SimpleNamespace(
            create=AsyncMock(return_value=SimpleNamespace(id="org-1")),
            find_unique=AsyncMock(),
        ),
        organizationmember=SimpleNamespace(create=AsyncMock()),
    )
    service = GarageService(db)
    service.get_organization_by_id = AsyncMock()
    application = OrganizationCreate(
        type="DEALER",
        applicant_type="INDIVIDUAL",
        email="aline@example.rw",
        phone="+250788123456",
    )

    await service.submit_application("user-1", application)

    saved = db.organization.create.await_args.kwargs["data"]
    assert saved["name"] == "Aline Uwase"
    assert saved["applicant_type"] == "INDIVIDUAL"
    assert saved["tin"] is None
    assert saved["location"] is None
    db.organizationmember.create.assert_awaited_once()


@pytest.mark.anyio
async def test_approving_dealer_application_grants_dealer_role_to_applicant():
    approved_organization = OrganizationResponse(
        id="org-1",
        name="Aline Uwase",
        type="DEALER",
        applicant_type="INDIVIDUAL",
        tin=None,
        location=None,
        email="aline@example.rw",
        phone="+250788123456",
        status="APPROVED",
        created_at=datetime.now(timezone.utc),
    )
    db = SimpleNamespace(
        organization=SimpleNamespace(
            find_unique=AsyncMock(return_value=SimpleNamespace(type="DEALER")),
            update=AsyncMock(return_value=approved_organization),
        ),
        organizationmember=SimpleNamespace(
            find_many=AsyncMock(
                return_value=[
                    SimpleNamespace(user=SimpleNamespace(id="user-1", role="OWNER")),
                ]
            )
        ),
        user=SimpleNamespace(update=AsyncMock()),
    )

    await GarageService(db).update_organization_status(
        "org-1",
        OrganizationStatusUpdate(status="APPROVED"),
    )

    db.user.update.assert_awaited_once_with(
        where={"id": "user-1"},
        data={"role": "DEALER"},
    )
