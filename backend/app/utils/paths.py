from pathlib import Path

from app.config import settings


def get_video_dir(video_id: str) -> Path:
    return settings.STORAGE_DIR / video_id


def get_frames_dir(video_id: str) -> Path:
    return settings.FRAMES_DIR / video_id


def get_thumbnails_dir(video_id: str) -> Path:
    return settings.THUMBNAILS_DIR / video_id


def get_clips_dir(video_id: str) -> Path:
    return settings.CLIPS_DIR / video_id


def get_metadata_path(video_id: str) -> Path:
    return settings.METADATA_DIR / f"{video_id}.json"


def get_thumbnail_path(video_id: str, frame_idx: int) -> Path:
    return get_thumbnails_dir(video_id) / f"thumb_{frame_idx:06d}.jpg"


def get_frame_path(video_id: str, frame_idx: int) -> Path:
    return get_frames_dir(video_id) / f"frame_{frame_idx:06d}.jpg"


def ensure_directories(video_id: str) -> dict[str, Path]:
    """Create all the per-video subdirectories if they don't exist."""
    dirs = {
        "frames": get_frames_dir(video_id),
        "thumbnails": get_thumbnails_dir(video_id),
        "clips": get_clips_dir(video_id),
    }
    for d in dirs.values():
        d.mkdir(parents=True, exist_ok=True)
    return dirs


def get_upload_path(video_id: str, filename: str) -> Path:
    return settings.UPLOADS_DIR / video_id / filename

