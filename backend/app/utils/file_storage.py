import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile
from typing import Set, Tuple
from app.core.config import settings
from app.utils.exceptions import BadRequestException


ALLOWED_IMAGE_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_DOCUMENT_EXTENSIONS: Set[str] = {".pdf", ".jpg", ".jpeg", ".png"}


def ensure_upload_dir() -> Path:
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


async def save_uploaded_file(file: UploadFile, subfolder: str = "images") -> Tuple[str, str]:
    """
    Saves an uploaded file to the local storage subfolder.
    Returns (relative_file_url, absolute_file_path).
    """
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS and ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise BadRequestException(f"Unsupported file extension '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS)}")

    # Check file size if available
    target_dir = ensure_upload_dir() / subfolder
    target_dir.mkdir(parents=True, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = target_dir / unique_filename

    # Read and write chunks
    size = 0
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    with open(dest_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > max_size:
                dest_path.unlink(missing_ok=True)
                raise BadRequestException(f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB")
            buffer.write(chunk)

    relative_url = f"/uploads/{subfolder}/{unique_filename}"
    return relative_url, str(dest_path)
