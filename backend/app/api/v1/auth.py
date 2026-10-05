from fastapi import APIRouter, Depends, status, Request, Header
from typing import Optional
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
    PasswordResetVerifyOtpRequest,
    PasswordResetConfirm,
    PasswordResetVerifyResponse,
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
    return MessageResponse(message="Successfully logged out.", success=True)


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    reset_req: PasswordResetRequest,
    request: Request,
    db: Prisma = Depends(get_db),
    origin: Optional[str] = Header(None)
):
    """
    Start password reset flow. Sends a 6-digit verification code (OTP) via email.
    Always returns generic success message to prevent user enumeration.
    """
    client_origin = origin or request.headers.get("origin") or request.headers.get("referer")
    auth_service = AuthService(db)
    msg = await auth_service.request_password_reset(reset_req, origin=client_origin)
    return MessageResponse(message=msg, success=True)


@router.post("/verify-otp", response_model=PasswordResetVerifyResponse)
async def verify_reset_otp(
    verify_in: PasswordResetVerifyOtpRequest,
    db: Prisma = Depends(get_db)
):
    """
    Verify if a 6-digit OTP code is valid and not expired for the provided email.
    """
    auth_service = AuthService(db)
    return await auth_service.verify_password_reset_otp(verify_in)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    confirm_in: PasswordResetConfirm,
    request: Request,
    db: Prisma = Depends(get_db)
):
    """
    Complete password reset using email, 6-digit OTP verification code, and new password.
    """
    auth_service = AuthService(db)
    msg = await auth_service.reset_password(confirm_in)
    
    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=None,
        action="PASSWORD_RESET_COMPLETED",
        entity_type="AUTH",
        metadata={"email": confirm_in.email},
        ip_address=request.client.host if request.client else None
    )
    return MessageResponse(message=msg, success=True)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: UserResponse = Depends(get_current_user)
):
    """Return currently authenticated user profile and roles."""
    return current_user
