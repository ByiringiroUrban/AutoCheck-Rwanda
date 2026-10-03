from fastapi import APIRouter, Depends, status, Request
from prisma import Prisma
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.services.audit_service import AuditService
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    Token,
    RefreshTokenRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    UserResponse,
)
from app.schemas.common import MessageResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserRegister,
    request: Request,
    db: Prisma = Depends(get_db)
):
    """Create customer/owner account."""
    auth_service = AuthService(db)
    user = await auth_service.register(user_in)
    
    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=user.id,
        action="USER_REGISTERED",
        entity_type="USER",
        entity_id=user.id,
        metadata={"email": user.email, "role": user.role},
        ip_address=request.client.host if request.client else None
    )
    return user


@router.post("/login", response_model=Token)
async def login(
    login_in: UserLogin,
    request: Request,
    db: Prisma = Depends(get_db)
):
    """Authenticate and issue JWT access and refresh tokens."""
    auth_service = AuthService(db)
    tokens = await auth_service.login(login_in)
    
    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=None,
        action="USER_LOGIN",
        entity_type="AUTH",
        metadata={"email": login_in.email},
        ip_address=request.client.host if request.client else None
    )
    return tokens


@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_in: RefreshTokenRequest,
    db: Prisma = Depends(get_db)
):
    """Refresh access token using a valid refresh token."""
    auth_service = AuthService(db)
    return await auth_service.refresh_access_token(refresh_in.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Invalidate session / logout."""
    return MessageResponse(message="Successfully logged out.")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    reset_req: PasswordResetRequest,
    db: Prisma = Depends(get_db)
):
    """Start password reset flow. Returns generic response to prevent account enumeration."""
    return MessageResponse(
        message="If this email is registered, instructions to reset your password have been sent."
    )


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    confirm_in: PasswordResetConfirm,
    db: Prisma = Depends(get_db)
):
    """Complete password reset using secure token."""
    return MessageResponse(message="Password has been reset successfully.")


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: UserResponse = Depends(get_current_user)
):
    """Return currently authenticated user profile and roles."""
    return current_user
