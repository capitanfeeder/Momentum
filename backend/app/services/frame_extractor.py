from __future__ import annotations

import logging
from pathlib import Path

import cv2
import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)


def extract_frames(
    video_path: Path | str,
    video_id: str,
    frame_interval: int | None = None,
) -> list[dict]:
    interval = frame_interval or settings.FRAME_INTERVAL
    video_path = Path(video_path)
    video_id_str = str(video_id)

    from app.utils.paths import get_frames_dir, get_thumbnails_dir

    frames_dir = get_frames_dir(video_id_str)
    thumbs_dir = get_thumbnails_dir(video_id_str)
    frames_dir.mkdir(parents=True, exist_ok=True)
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames_vid = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames_vid / fps if fps > 0 else 0
    logger.info(
        "Video: %s | FPS=%.1f | total_frames=%d | duration=%.1fs",
        video_path.name, fps, total_frames_vid, duration,
    )

    frame_step = int(fps * interval) if fps > 0 else int(30 * interval)
    if frame_step < 1:
        frame_step = 1

    extracted: list[dict] = []
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        current_frame_num = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

        if current_frame_num % frame_step == 0:
            timestamp = current_frame_num / fps if fps > 0 else 0.0

            frame_filename = f"frame_{frame_idx:06d}.jpg"
            thumb_filename = f"thumb_{frame_idx:06d}.jpg"

            frame_file = frames_dir / frame_filename
            thumb_file = thumbs_dir / thumb_filename

            resized = cv2.resize(frame, settings.FRAME_SIZE, interpolation=cv2.INTER_AREA)
            cv2.imwrite(str(frame_file), resized, [cv2.IMWRITE_JPEG_QUALITY, 90])

            thumb_h = 320
            h, w = frame.shape[:2]
            thumb_w = int(w * (thumb_h / h)) if h > 0 else 640
            thumbnail = cv2.resize(frame, (thumb_w, thumb_h), interpolation=cv2.INTER_AREA)
            cv2.imwrite(str(thumb_file), thumbnail, [cv2.IMWRITE_JPEG_QUALITY, 80])

            rel_frame = str(Path("frames") / video_id_str / frame_filename)
            rel_thumb = str(Path("thumbnails") / video_id_str / thumb_filename)

            extracted.append(
                {
                    "frame_path": rel_frame,
                    "thumbnail_path": rel_thumb,
                    "timestamp_seconds": round(timestamp, 2),
                    "frame_idx": frame_idx,
                }
            )
            frame_idx += 1

    cap.release()
    logger.info("Extracted %d frames from %s", len(extracted), video_path.name)
    return extracted
