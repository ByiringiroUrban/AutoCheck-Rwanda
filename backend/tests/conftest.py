import sys
from pathlib import Path

# Add backend directory to python path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import create_access_token


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
def auth_headers_admin():
    token = create_access_token(
        subject="admin-test-uuid-0001",
        role="ADMIN",
        email="admin@autocheck.rw",
        first_name="Admin",
        last_name="AutoCheck",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_garage():
    token = create_access_token(
        subject="garage-test-uuid-0002",
        role="GARAGE_MANAGER",
        email="manager@kigaligarage.rw",
        first_name="Garage",
        last_name="Manager",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_owner():
    token = create_access_token(
        subject="owner-test-uuid-0003",
        role="OWNER",
        email="owner@user.rw",
        first_name="John",
        last_name="Mugisha",
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
