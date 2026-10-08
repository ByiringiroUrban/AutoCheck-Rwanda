from fastapi import APIRouter, Depends, status, Request, UploadFile, File
from prisma import Prisma
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.services.cloudinary_service import CloudinaryService
from app.services.audit_service import AuditService
from app.schemas.auth import (
    UserResponse,
    UserUpdate,
    UserSelfUpdate,
    AvatarUploadResponse,
)
from app.schemas.common import MessageResponse
from app.api.deps import get_current_user
from app.core.security import verify_password
from app.utils.exceptions import BadRequestException

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """Return currently authenticated user profile."""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    body: UserSelfUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
    request: Request = None,  # type: ignore
):
    """Update the signed-in user's name, phone, avatar, or password."""
    user = await db.user.find_unique(where={"id": current_user.id})
    if not user:
        raise BadRequestException("Signed-in user could not be loaded.")

    new_password = body.new_password or body.password
    if new_password:
        if not body.old_password or not verify_password(body.old_password, user.password_hash):
            raise BadRequestException("Current password does not match.")

    phone = body.phone.strip() if body.phone is not None else None
    updated_user = await AuthService(db).update_user_profile(
        current_user.id,
        UserUpdate(
            first_name=body.first_name.strip() if body.first_name is not None else None,
            last_name=body.last_name.strip() if body.last_name is not None else None,
            phone=phone or None,
            avatar_url=body.avatar_url,
            password=new_password,
        ),
    )

    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=current_user.id,
        action="USER_PROFILE_UPDATED",
        entity_type="USER",
        entity_id=current_user.id,
        ip_address=request.client.host if request and request.client else None,
    )
    return updated_user


@router.post("/me/avatar", response_model=AvatarUploadResponse, status_code=status.HTTP_200_OK)
async def upload_my_avatar(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
    request: Request = None,  # type: ignore
):
    """Upload the signed-in user's profile photo."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise BadRequestException("Uploaded file must be an image (JPEG, PNG, WebP, etc.).")

    cloud_res = await CloudinaryService.upload_profile_photo(file=file, user_id=current_user.id)
    avatar_url = cloud_res["url"]
    await AuthService(db).update_user_avatar(current_user.id, avatar_url)

    audit_service = AuditService(db)
    await audit_service.log_action(
        actor_user_id=current_user.id,
        action="USER_AVATAR_UPLOADED",
        entity_type="USER",
        entity_id=current_user.id,
        metadata={"avatar_url": avatar_url},
        ip_address=request.client.host if request and request.client else None,
    )
    return AvatarUploadResponse(
        avatar_url=avatar_url,
        public_id=cloud_res.get("public_id"),
        message="Profile photo uploaded and updated successfully.",
    )


@router.delete("/me/avatar", response_model=MessageResponse)
async def delete_my_avatar(
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
):
    """Remove the signed-in user's profile photo."""
    await AuthService(db).update_user_avatar(current_user.id, "")
    return MessageResponse(message="Profile avatar removed successfully.", success=True)
