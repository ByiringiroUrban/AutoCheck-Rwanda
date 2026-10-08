import os
import uuid
import logging
import asyncio
from typing import Optional, Dict, Any, Union
from fastapi import UploadFile
import cloudinary
import cloudinary.uploader
import cloudinary.api

from app.core.config import settings
from app.utils.exceptions import BadRequestException, InternalServerException

logger = logging.getLogger("autocheck.cloudinary")


class CloudinaryService:
    _configured: bool = False

    @classmethod
    def _init_cloudinary(cls):
        if not cls._configured:
            if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
                cloudinary.config(
                    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                    api_key=settings.CLOUDINARY_API_KEY,
                    api_secret=settings.CLOUDINARY_API_SECRET,
                    secure=True,
                )
                cls._configured = True
                logger.info(f"[Cloudinary] Configured for cloud: {settings.CLOUDINARY_CLOUD_NAME}")

    @classmethod
    def is_configured(cls) -> bool:
        cls._init_cloudinary()
        return bool(settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET)

    @classmethod
    async def upload_file(
        cls,
        file: Union[UploadFile, bytes],
        folder: str = "general",
        public_id: Optional[str] = None,
        resource_type: str = "auto",
        transformation: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Uploads an image or document to Cloudinary asynchronously.
        Returns metadata dict containing `secure_url`, `public_id`, `format`, `bytes`, etc.
        """
        cls._init_cloudinary()

        if not cls.is_configured():
            raise InternalServerException("Cloudinary is not configured on the server.")

        # Read bytes using duck-typing to avoid isinstance issues with uvicorn reloader
        if hasattr(file, "file") and hasattr(file, "read") and hasattr(file, "seek"):
            # It's an UploadFile
            file_bytes = await file.read()
            await file.seek(0)
        elif hasattr(file, "read"):
            # Sync file-like object
            file_bytes = file.read()
            if hasattr(file, "seek"):
                file.seek(0)
        else:
            file_bytes = file

        full_folder = f"{settings.CLOUDINARY_FOLDER}/{folder}".strip("/")
        unique_id = public_id or f"{uuid.uuid4().hex}"

        upload_options: Dict[str, Any] = {
            "folder": full_folder,
            "public_id": unique_id,
            "resource_type": resource_type,
            "overwrite": True,
            "unique_filename": False,
        }

        if transformation:
            upload_options["transformation"] = transformation

        try:
            # Run blocking cloudinary upload in a threadpool
            result = await asyncio.to_thread(
                cloudinary.uploader.upload,
                file_bytes,
                **upload_options
            )
            logger.info(f"[Cloudinary] Uploaded {unique_id} to {full_folder} -> {result.get('secure_url')}")
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "format": result.get("format"),
                "bytes": result.get("bytes"),
                "width": result.get("width"),
                "height": result.get("height"),
                "resource_type": result.get("resource_type"),
            }
        except Exception as e:
            logger.error(f"[Cloudinary] Upload error: {str(e)}", exc_info=True)
            raise BadRequestException(f"Failed to upload image to Cloudinary: {str(e)}")

    @classmethod
    async def upload_profile_photo(cls, file: Union[UploadFile, bytes], user_id: str) -> Dict[str, Any]:
        """
        Uploads a user's avatar / profile photo with square face-centered auto-crop.
        """
        return await cls.upload_file(
            file=file,
            folder="profiles",
            public_id=f"user_{user_id}",
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )

    @classmethod
    async def upload_vehicle_photo(
        cls,
        file: Union[UploadFile, bytes],
        vehicle_id: str,
        view_type: str = "GENERAL"
    ) -> Dict[str, Any]:
        """
        Uploads vehicle condition / inspection photo to vehicle repository folder.
        """
        cleaned_view = view_type.lower().replace(" ", "_")
        public_id = f"{cleaned_view}_{uuid.uuid4().hex[:8]}"
        return await cls.upload_file(
            file=file,
            folder=f"vehicles/{vehicle_id}",
            public_id=public_id,
            resource_type="image",
            transformation=[
                {"width": 1600, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )

    @classmethod
    async def upload_evidence(
        cls,
        file: Union[UploadFile, bytes],
        category: str = "ownership"
    ) -> Dict[str, Any]:
        """
        Uploads evidence documents or images (ownership certificates, police reports, receipts).
        """
        public_id = f"doc_{uuid.uuid4().hex[:12]}"
        return await cls.upload_file(
            file=file,
            folder=f"evidence/{category}",
            public_id=public_id,
            resource_type="auto"
        )

    @classmethod
    async def upload_organization_logo(
        cls,
        file: Union[UploadFile, bytes],
        org_id: str
    ) -> Dict[str, Any]:
        """
        Uploads organization/garage logo with auto-fit transformation.
        """
        return await cls.upload_file(
            file=file,
            folder="organizations",
            public_id=f"org_{org_id}",
            resource_type="image",
            transformation=[
                {"width": 500, "height": 500, "crop": "fit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )

    @classmethod
    async def delete_file(cls, public_id: str) -> bool:
        """
        Deletes a resource from Cloudinary.
        """
        cls._init_cloudinary()
        if not cls.is_configured():
            return False

        try:
            res = await asyncio.to_thread(cloudinary.uploader.destroy, public_id)
            return res.get("result") == "ok"
        except Exception as e:
            logger.warning(f"[Cloudinary] Delete error for '{public_id}': {str(e)}")
            return False
