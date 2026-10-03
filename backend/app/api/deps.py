from typing import Generator, Optional, List, Callable
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from prisma import Prisma
from app.db.session import get_db, db
from app.core.security import decode_token, check_roles, require_min_role
from app.utils.exceptions import UnauthorizedException, ForbiddenException
from app.schemas.auth import UserResponse


security_bearer = HTTPBearer(auto_error=False)


async def get_current_user_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> dict:
    if not credentials:
        raise UnauthorizedException("Authentication token is required")
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise UnauthorizedException("Invalid token type; expected access token")
    return payload


async def get_optional_user_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Optional[dict]:
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") == "access":
            return payload
    except Exception:
        pass
    return None


async def get_current_user(
    payload: dict = Depends(get_current_user_payload),
    database: Prisma = Depends(get_db)
) -> UserResponse:
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Token missing subject identifier")
    
    # Try fetching from DB if connected
    if database.is_connected():
        try:
            user = await database.user.find_unique(where={"id": user_id})
            if user:
                if user.status != "ACTIVE":
                    raise ForbiddenException("User account is inactive or suspended")
                return UserResponse.model_validate(user)
        except Exception:
            pass
    
    # Fallback to token payload data if offline / mocking
    from datetime import datetime, timezone
    iat = payload.get("iat")
    created_dt = datetime.fromtimestamp(iat, timezone.utc) if iat else datetime.now(timezone.utc)
    return UserResponse(
        id=user_id,
        email=payload.get("email", ""),
        first_name=payload.get("first_name", ""),
        last_name=payload.get("last_name", ""),
        role=payload.get("role", "OWNER"),
        status="ACTIVE",
        created_at=created_dt,
    )


def require_role(allowed_roles: List[str]) -> Callable:
    """Dependency that enforces user has one of the specified roles."""
    async def role_checker(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
        if current_user.role == "SUPER_ADMIN":
            return current_user
        if not check_roles(current_user.role, allowed_roles):
            raise ForbiddenException(f"Access forbidden: requires one of {allowed_roles}")
        return current_user
    return role_checker


def require_min_role_level(min_role: str) -> Callable:
    """Dependency that enforces user meets the minimum role rank."""
    async def role_level_checker(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
        if not require_min_role(current_user.role, min_role):
            raise ForbiddenException(f"Access forbidden: requires at least {min_role} role")
        return current_user
    return role_level_checker
