from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    phone: Optional[str] = None
    role: Optional[str] = "OWNER"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetVerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")
    new_password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class PasswordResetVerifyResponse(BaseModel):
    valid: bool
    email: Optional[str] = None
    first_name: Optional[str] = None
    message: Optional[str] = None



class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)


class AvatarUploadResponse(BaseModel):
    avatar_url: str
    public_id: Optional[str] = None
    message: str = "Avatar uploaded successfully"


class FileUploadResponse(BaseModel):
    url: str
    public_id: str
    format: Optional[str] = None
    bytes: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    resource_type: Optional[str] = "image"


class UserSelfUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    old_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6)
    password: Optional[str] = Field(None, min_length=6)


class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserPage(BaseModel):
    items: List[UserResponse]
    total: int
    page: int
    pages: int
