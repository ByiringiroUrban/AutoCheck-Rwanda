from typing import Optional
from fastapi import APIRouter, Depends
from prisma import Prisma
from app.db.session import get_db
from app.schemas.auth import UserResponse, UserSelfUpdate
from app.api.deps import get_current_user
from app.core.security import verify_password, get_password_hash
from app.utils.exceptions import BadRequestException

router = APIRouter(prefix="/users", tags=["Users"])


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    body: UserSelfUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: Prisma = Depends(get_db),
):
    """Update the signed-in user's name, phone, or password."""
    user = await db.user.find_unique(where={"id": current_user.id})
    if not user:
        raise BadRequestException("Signed-in user could not be loaded.")

    data = {}
    if body.first_name is not None:
        data["first_name"] = body.first_name.strip()
    if body.last_name is not None:
        data["last_name"] = body.last_name.strip()
    if body.phone is not None:
        data["phone"] = body.phone.strip() or None

    new_password = body.new_password or body.password
    if new_password:
        if not body.old_password or not verify_password(body.old_password, user.password_hash):
            raise BadRequestException("Current password does not match.")
        data["password_hash"] = get_password_hash(new_password)

    if not data:
        return UserResponse.model_validate(user)

    updated = await db.user.update(where={"id": user.id}, data=data)
    return UserResponse.model_validate(updated)
