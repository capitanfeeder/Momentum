from __future__ import annotations

import logging
from pathlib import Path

import cv2

from app.config import settings

logger = logging.getLogger(__name__)


def extract_clip_thumbnail(
    video_path: Path | str,
    timestamp: float,
    video_id: str,
    clip_idx: int,
) -> str | None:
    """Grab a single frame from the video at a specific timestamp.

    Used to generate preview thumbnails for search results. Returns
    the relative path to the saved clip image, or None on failure.
    """
    video_path = Path(video_path)

    from app.utils.paths import get_clips_dir

    clips_dir = get_clips_dir(video_id)
    clips_dir.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        logger.error("Cannot open video for clip extraction: %s", video_path)
        return None

    # seek to the right frame
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_number = int(timestamp * fps) if fps > 0 else 0
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        logger.warning("Could not read frame at %.1fs from %s", timestamp, video_path)
        return None

    clip_filename = f"clip_{clip_idx:06d}.jpg"
    clip_file = clips_dir / clip_filename

    # resize to 640px wide for the preview — keeps file sizes small
    h, w = frame.shape[:2]
    preview_w = 640
    preview_h = int(h * (preview_w / w)) if w > 0 else 360
    preview = cv2.resize(frame, (preview_w, preview_h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(clip_file), preview, [cv2.IMWRITE_JPEG_QUALITY, 92])

    rel_path = str(Path("clips") / video_id / clip_filename)
    logger.info("Extracted clip thumbnail: %s at %.1fs", rel_path, timestamp)
    return rel_path
