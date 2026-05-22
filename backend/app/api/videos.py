from __future__ import annotations

import logging

from fastapi import APIRouter

from app.models.schemas import VideoInfo
from app.services.video_processor import list_all_videos

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["videos"])


@router.get("/videos", response_model=list[VideoInfo])
async def list_videos() -> list[VideoInfo]:
    all_videos = list_all_videos()

    result = []
    for v in all_videos:
        result.append(
            VideoInfo(
                video_id=v.get("video_id", ""),
                filename=v.get("filename", "unknown"),
                source=v.get("source", "unknown"),
                status=v.get("status", "unknown"),
                total_frames=v.get("total_frames", 0),
                indexed_vectors=v.get("processed_frames", 0),
                duration_seconds=v.get("duration_seconds", 0.0),
                created_at=v.get("created_at", ""),
                thumbnail_path=v.get("thumbnail_path"),
            )
        )

    return result
