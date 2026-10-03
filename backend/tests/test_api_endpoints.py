import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_health_endpoint(async_client: AsyncClient):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


@pytest.mark.anyio
async def test_root_endpoint(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert data["api_v1"] == "/api/v1"


@pytest.mark.anyio
async def test_openapi_docs_json(async_client: AsyncClient):
    response = await async_client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    assert "/api/v1/auth/register" in schema["paths"]
    assert "/api/v1/vehicles/search" in schema["paths"]
    assert "/api/v1/reports" in schema["paths"]
    assert "/api/v1/ai-inspections" in schema["paths"]
    assert "/api/v1/disputes" in schema["paths"]


@pytest.mark.anyio
async def test_forgot_password_generic_response(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "anyuser@autocheck.rw"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "instructions" in data["message"]


@pytest.mark.anyio
async def test_unauthorized_access(async_client: AsyncClient):
    # Accessing protected endpoint without token
    response = await async_client.get("/api/v1/auth/me")
    assert response.status_code == 401


@pytest.mark.anyio
async def test_authorized_get_me(async_client: AsyncClient, auth_headers_admin: dict):
    response = await async_client.get("/api/v1/auth/me", headers=auth_headers_admin)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@autocheck.rw"
    assert data["role"] == "ADMIN"
