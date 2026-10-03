from datetime import datetime, timezone
from typing import Optional, Dict, Any
from prisma import Prisma
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.config import settings
from app.schemas.auth import UserRegister, UserLogin, Token, UserResponse
from app.utils.exceptions import BadRequestException, UnauthorizedException, ConflictException, NotFoundException


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
