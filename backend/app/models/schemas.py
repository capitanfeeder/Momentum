from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


# Request/response models for the API endpoints.
# These control what the frontend sends and receives.


class UploadResponse(BaseModel):
    """Response sent back after a video upload."""
    video_id: str
    status: str = "processing"
    message: str = "Video upload accepted. Processing started."


class SearchRequest(BaseModel):
    """Body for the /api/search endpoint."""
    query: str
    top_k: int = Field(default=20, ge=1, le=100)


class SearchResult(BaseModel):
    """A single frame match from a search query."""
    id: str = ""
    video_id: str
    timestamp_seconds: float
    timestamp_formatted: str = ""
    score: float
    frame_path: str
    thumbnail_path: str
    objects: list[str] = []
    clip_path: Optional[str] = None


class VideoStatus(BaseModel):
    """Current processing status for a video."""
    video_id: str
    status: str
    progress: float = 0.0
    current_step: str = ""
    total_frames: int = 0
    processed_frames: int = 0
    error: Optional[str] = None


class VideoInfo(BaseModel):
    """Summary info for the videos list endpoint."""
    video_id: str
    filename: str
    source: str
    status: str
    total_frames: int = 0
    indexed_vectors: int = 0
    duration_seconds: float = 0.0
    created_at: str
    thumbnail_path: Optional[str] = None
