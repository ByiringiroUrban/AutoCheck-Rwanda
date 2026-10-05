from fastapi import APIRouter, Depends, status, Request, UploadFile, File
from prisma import Prisma
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.services.cloudinary_service import CloudinaryService
from app.services.audit_service import AuditService
from app.schemas.auth import (
    UserResponse,
    UserUpdate,
    AvatarUploadResponse,
)
from app.schemas.common import MessageResponse
from app.api.deps import get_current_user
from app.utils.exceptions import BadRequestException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: UserResponse = Depends(get_current_user)
):
    """Return currently authenticated user profile."""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    update_in: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
    request: Request = None,  # type: ignore
):
    """Update profile information for the authenticated user."""
    auth_service = AuthService(db)
    updated_user = await auth_service.update_user_profile(current_user.id, update_in)

    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=current_user.id,
        action="USER_PROFILE_UPDATED",
        entity_type="USER",
        entity_id=current_user.id,
        ip_address=request.client.host if request and request.client else None
    )
    return updated_user


@router.post("/me/avatar", response_model=AvatarUploadResponse, status_code=status.HTTP_200_OK)
async def upload_my_avatar(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
    request: Request = None,  # type: ignore
):
    """
    Upload user profile avatar directly to Cloudinary.
    Updates the user's avatar_url in the database.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise BadRequestException("Uploaded file must be an image (JPEG, PNG, WebP, etc.).")

    cloud_res = await CloudinaryService.upload_profile_photo(file=file, user_id=current_user.id)
    avatar_url = cloud_res["url"]

    auth_service = AuthService(db)
    await auth_service.update_user_avatar(current_user.id, avatar_url)

    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=current_user.id,
        action="USER_AVATAR_UPLOADED",
        entity_type="USER",
        entity_id=current_user.id,
        metadata={"avatar_url": avatar_url},
        ip_address=request.client.host if request.client else None
    )

    return AvatarUploadResponse(
        avatar_url=avatar_url,
        public_id=cloud_res.get("public_id"),
        message="Profile photo uploaded and updated successfully."
    )


@router.delete("/me/avatar", response_model=MessageResponse)
async def delete_my_avatar(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db)
):
    """Remove user avatar photo."""
    auth_service = AuthService(db)
    await auth_service.update_user_avatar(current_user.id, "")
    return MessageResponse(message="Profile avatar removed successfully.", success=True)
