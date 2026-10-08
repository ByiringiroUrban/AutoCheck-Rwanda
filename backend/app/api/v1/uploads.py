from typing import Optional
from fastapi import APIRouter, Depends, status, Request, UploadFile, File, Form
from app.services.cloudinary_service import CloudinaryService
from app.schemas.auth import FileUploadResponse, UserResponse
from app.api.deps import get_current_user
from app.utils.exceptions import BadRequestException

router = APIRouter(prefix="/uploads", tags=["Uploads & Media"])


@router.post("/image", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Upload an image file directly to Cloudinary under the specified folder.
    Allowed folders: `general`, `vehicles`, `garages`, `profiles`, `inspections`, `evidence`.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise BadRequestException("Uploaded file must be a valid image format.")

    allowed_folders = {"general", "vehicles", "garages", "profiles", "inspections", "evidence"}
    sanitized_folder = folder if folder in allowed_folders else "general"

    res = await CloudinaryService.upload_file(file=file, folder=sanitized_folder, resource_type="image")
    return FileUploadResponse(
        url=res["url"],
        public_id=res["public_id"],
        format=res.get("format"),
        bytes=res.get("bytes"),
        width=res.get("width"),
        height=res.get("height"),
        resource_type="image"
    )


@router.post("/evidence", response_model=FileUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    file: UploadFile = File(...),
    category: str = Form("ownership"),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Upload proof / evidence document or photo to Cloudinary.
    """
    res = await CloudinaryService.upload_evidence(file=file, category=category)
    return FileUploadResponse(
        url=res["url"],
        public_id=res["public_id"],
        format=res.get("format"),
        bytes=res.get("bytes"),
        width=res.get("width"),
        height=res.get("height"),
        resource_type=res.get("resource_type", "auto")
    )
