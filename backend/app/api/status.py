from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import VideoStatus
from app.services.video_processor import get_video_status

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["status"])


@router.get("/status/{video_id}", response_model=VideoStatus)
async def get_processing_status(video_id: str) -> VideoStatus:
    status_data = get_video_status(video_id)

    if status_data is None:
        raise HTTPException(status_code=404, detail=f"Video '{video_id}' not found")

    return VideoStatus(
        video_id=status_data.get("video_id", video_id),
        status=status_data.get("status", "unknown"),
        progress=status_data.get("progress", 0.0),
        current_step=status_data.get("current_step", ""),
        total_frames=status_data.get("total_frames", 0),
        processed_frames=status_data.get("processed_frames", 0),
        error=status_data.get("error"),
    )
