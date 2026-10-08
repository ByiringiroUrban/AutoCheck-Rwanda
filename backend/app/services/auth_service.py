import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any
from prisma import Prisma
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    create_password_reset_token,
    decode_password_reset_token,
)
from app.core.config import settings
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    Token,
    UserResponse,
    PasswordResetRequest,
    PasswordResetVerifyOtpRequest,
    PasswordResetConfirm,
    PasswordResetVerifyResponse,
    UserUpdate,
)
from app.services.email_service import EmailService
from app.utils.exceptions import (
    BadRequestException,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
)

logger = logging.getLogger("autocheck.auth")


class AuthService:
    def __init__(self, db: Prisma):
        self.db = db

    async def register(self, user_in: UserRegister) -> UserResponse:
        # Check if user already exists
        existing = await self.db.user.find_unique(where={"email": user_in.email.lower()})
        if existing:
            raise ConflictException(f"User with email '{user_in.email}' already exists.")

        # Default role security: prevent self-assigning admin or super_admin directly via public registration
        role = user_in.role.upper() if user_in.role else "OWNER"
        if role in ["ADMIN", "SUPER_ADMIN"]:
            role = "OWNER"

        user = await self.db.user.create(
            data={
                "email": user_in.email.lower(),
                "password_hash": get_password_hash(user_in.password),
                "first_name": user_in.first_name,
                "last_name": user_in.last_name,
                "phone": user_in.phone,
                "role": role,  # type: ignore
                "status": "ACTIVE",  # type: ignore
            }
        )
        return UserResponse.model_validate(user)

    async def login(self, login_data: UserLogin) -> Token:
        user = await self.db.user.find_unique(where={"email": login_data.email.lower()})
        if not user or not verify_password(login_data.password, user.password_hash):
            raise UnauthorizedException("Invalid email or password")

        if user.status != "ACTIVE":
            raise UnauthorizedException("Account is suspended or inactive")

        access_token = create_access_token(
            subject=user.id,
            role=user.role,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )
        refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    async def refresh_access_token(self, refresh_token_str: str) -> Token:
        payload = decode_token(refresh_token_str)
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid token type; expected refresh token")

        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Invalid token payload")

        user = await self.db.user.find_unique(where={"id": user_id})
        if not user or user.status != "ACTIVE":
            raise UnauthorizedException("User not found or inactive")

        access_token = create_access_token(
            subject=user.id,
            role=user.role,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )
        new_refresh_token = create_refresh_token(subject=user.id)

        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        user = await self.db.user.find_unique(where={"id": user_id})
        if not user:
            raise NotFoundException("User", user_id)
        return UserResponse.model_validate(user)

    async def update_user_profile(self, user_id: str, update_in: UserUpdate) -> UserResponse:
        user = await self.db.user.find_unique(where={"id": user_id})
        if not user:
            raise NotFoundException("User", user_id)

        data_to_update: Dict[str, Any] = {}
        if update_in.first_name is not None:
            data_to_update["first_name"] = update_in.first_name
        if update_in.last_name is not None:
            data_to_update["last_name"] = update_in.last_name
        if update_in.phone is not None:
            data_to_update["phone"] = update_in.phone
        if update_in.avatar_url is not None:
            data_to_update["avatar_url"] = update_in.avatar_url
        if update_in.password:
            data_to_update["password_hash"] = get_password_hash(update_in.password)

        if not data_to_update:
            return UserResponse.model_validate(user)

        updated_user = await self.db.user.update(
            where={"id": user_id},
            data=data_to_update
        )
        return UserResponse.model_validate(updated_user)

    async def update_user_avatar(self, user_id: str, avatar_url: str) -> UserResponse:
        user = await self.db.user.find_unique(where={"id": user_id})
        if not user:
            raise NotFoundException("User", user_id)

        updated_user = await self.db.user.update(
            where={"id": user_id},
            data={"avatar_url": avatar_url}
        )
        return UserResponse.model_validate(updated_user)

    async def request_password_reset(self, req: PasswordResetRequest, origin: Optional[str] = None) -> str:
        """
        Generates a 6-digit numeric OTP, saves it with a 10-minute expiry, and emails it via SMTP.
        Returns a generic message to prevent account enumeration.
        """
        email = req.email.lower().strip()
        user = await self.db.user.find_unique(where={"email": email})

        # If user exists and is active, generate OTP and send email
        if user and user.status == "ACTIVE":
            import secrets
            otp_code = f"{secrets.randbelow(900000) + 100000}"
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

            await self.db.user.update(
                where={"id": user.id},
                data={
                    "reset_otp": otp_code,
                    "reset_otp_expires": expires_at,
                }
            )

            try:
                await EmailService.send_password_reset_otp_email(
                    to_email=user.email,
                    first_name=user.first_name,
                    otp_code=otp_code,
                )
                logger.info(f"[AuthService] Password reset OTP sent to {user.email}")
            except Exception as e:
                logger.error(f"[AuthService] Could not send password reset OTP email: {str(e)}", exc_info=True)

        return "If your email is registered with AutoCheck Rwanda, a 6-digit verification code has been sent."

    async def verify_password_reset_otp(self, req: PasswordResetVerifyOtpRequest) -> PasswordResetVerifyResponse:
        """
        Validates the 6-digit OTP code against the user's record and checks expiration.
        """
        email = req.email.lower().strip()
        otp = req.otp.strip()

        user = await self.db.user.find_unique(where={"email": email})
        if not user or user.status != "ACTIVE":
            return PasswordResetVerifyResponse(valid=False, message="Invalid email or verification code.")

        if not user.reset_otp or user.reset_otp != otp:
            return PasswordResetVerifyResponse(valid=False, message="Incorrect 6-digit verification code.")

        now = datetime.now(timezone.utc)
        if not user.reset_otp_expires or user.reset_otp_expires < now:
            return PasswordResetVerifyResponse(valid=False, message="This verification code has expired. Please request a new one.")

        return PasswordResetVerifyResponse(
            valid=True,
            email=user.email,
            first_name=user.first_name,
            message="Verification code verified successfully."
        )

    async def reset_password(self, confirm: PasswordResetConfirm) -> str:
        """
        Verifies 6-digit OTP, updates password, and invalidates the OTP.
        """
        email = confirm.email.lower().strip()
        otp = confirm.otp.strip()

        user = await self.db.user.find_unique(where={"email": email})
        if not user or user.status != "ACTIVE":
            raise BadRequestException("Invalid email address or account is inactive.")

        if not user.reset_otp or user.reset_otp != otp:
            raise BadRequestException("Invalid 6-digit verification code. Please check the code sent to your email.")

        now = datetime.now(timezone.utc)
        if not user.reset_otp_expires or user.reset_otp_expires < now:
            raise BadRequestException("This verification code has expired (valid for 10 minutes). Please request a new code.")

        # Update password and clear OTP
        new_hash = get_password_hash(confirm.new_password)
        await self.db.user.update(
            where={"id": user.id},
            data={
                "password_hash": new_hash,
                "reset_otp": None,
                "reset_otp_expires": None,
            }
        )

        # Send confirmation email
        try:
            await EmailService.send_password_changed_confirmation(
                to_email=user.email,
                first_name=user.first_name
            )
        except Exception as e:
            logger.warning(f"[AuthService] Password change email notice failed: {str(e)}")

        return "Your password has been successfully reset. You can now log in with your new password."

