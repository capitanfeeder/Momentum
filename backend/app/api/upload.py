from __future__ import annotations

import logging
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile

from app.config import settings
from app.models.schemas import UploadResponse
from app.services.video_processor import process_video
from app.utils.paths import ensure_directories, get_upload_path

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["upload"])

ALLOWED_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".webm"}


@router.post("/upload", response_model=UploadResponse)
async def upload_video(
    file: UploadFile,
    background_tasks: BackgroundTasks,
) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    video_id = str(uuid.uuid4())
    ensure_directories(video_id)

    upload_dir = settings.UPLOADS_DIR / video_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    save_path = upload_dir / f"video{suffix}"

    try:
        with open(save_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        logger.exception("Failed to save uploaded file")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    file_size_mb = save_path.stat().st_size / 1024 / 1024
    logger.info(
        "Saved upload: %s (%.1f MB) -> video_id=%s",
        file.filename, file_size_mb, video_id,
    )

    background_tasks.add_task(process_video, video_id, save_path, "upload")

    return UploadResponse(
        video_id=video_id,
        status="processing",
        message=f"Video '{file.filename}' uploaded ({file_size_mb:.1f} MB). Processing started.",
    )
