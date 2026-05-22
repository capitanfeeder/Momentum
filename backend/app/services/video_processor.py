from __future__ import annotations

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from app.config import settings
from app.embeddings.clip_encoder import encode_images_batch
from app.indexing.qdrant_indexer import create_collection, upsert_frames
from app.services.clip_generator import extract_clip_thumbnail
from app.services.frame_extractor import extract_frames
from app.utils.paths import (
    get_metadata_path,
    get_upload_path,
    ensure_directories,
)

logger = logging.getLogger(__name__)


def _write_status(video_id: str, status: dict) -> None:
    path = get_metadata_path(video_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(status, f, indent=2, default=str)


def _read_status(video_id: str) -> dict | None:
    path = get_metadata_path(video_id)
    if not path.exists():
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


async def process_video(video_id: str, video_path: Path, source: str = "upload") -> None:
    start = time.monotonic()
    video_path = Path(video_path)
    video_id = str(video_id)

    ensure_directories(video_id)

    status = {
        "video_id": video_id,
        "status": "processing",
        "progress": 0.0,
        "current_step": "Starting",
        "total_frames": 0,
        "processed_frames": 0,
        "error": None,
        "source": source,
        "filename": video_path.name,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _write_status(video_id, status)

    try:
        status["current_step"] = "Extracting frames"
        status["progress"] = 5.0
        _write_status(video_id, status)

        frames = await asyncio.to_thread(
            extract_frames, video_path, video_id
        )
        status["total_frames"] = len(frames)
        status["progress"] = 20.0
        _write_status(video_id, status)

        if not frames:
            raise RuntimeError("No frames extracted from video")

        status["current_step"] = "Detecting objects"
        status["progress"] = 30.0
        _write_status(video_id, status)

        objects_per_frame = await asyncio.to_thread(
            _detect_objects_batch, frames, video_id
        )
        status["progress"] = 60.0
        _write_status(video_id, status)

        status["current_step"] = "Generating embeddings"
        _write_status(video_id, status)

        frame_paths = [
            settings.STORAGE_DIR / f["frame_path"] for f in frames
        ]
        embeddings = await asyncio.to_thread(
            encode_images_batch, frame_paths
        )
        status["progress"] = 85.0
        _write_status(video_id, status)

        status["current_step"] = "Indexing in Qdrant"
        _write_status(video_id, status)

        payloads = []
        for i, frame_data in enumerate(frames):
            payload = {
                "timestamp_seconds": frame_data["timestamp_seconds"],
                "frame_path": frame_data["frame_path"],
                "thumbnail_path": frame_data["thumbnail_path"],
                "objects": objects_per_frame[i] if i < len(objects_per_frame) else [],
            }
            payloads.append(payload)

        vec_list = [e.tolist() for e in embeddings]
        await asyncio.to_thread(create_collection)
        indexed_count = await asyncio.to_thread(
            upsert_frames, video_id, vec_list, payloads
        )

        status["progress"] = 100.0
        status["status"] = "completed"
        status["current_step"] = "Done"
        status["processed_frames"] = indexed_count
        elapsed = time.monotonic() - start
        status["duration_seconds"] = round(elapsed, 1)
        _write_status(video_id, status)

        logger.info(
            "Video %s processed: %d frames, %d vectors indexed in %.1fs",
            video_id, len(frames), indexed_count, elapsed,
        )

    except Exception as e:
        logger.exception("Processing failed for video %s", video_id)
        status["status"] = "failed"
        status["error"] = str(e)
        status["current_step"] = f"Failed: {e}"
        _write_status(video_id, status)


def _detect_objects_batch(frames: list[dict], video_id: str) -> list[list[str]]:
    results_per_frame: list[list[str]] = []

    try:
        import torch
        _original_torch_load = torch.load
        def _patched_load(*args, **kwargs):
            kwargs.setdefault("weights_only", False)
            return _original_torch_load(*args, **kwargs)
        torch.load = _patched_load

        from ultralytics import YOLO

        model = YOLO("yolov8n.pt")
        logger.info("Loaded YOLOv8n model for object detection")

        for frame_data in frames:
            frame_file = settings.STORAGE_DIR / frame_data["frame_path"]
            if not frame_file.exists():
                results_per_frame.append([])
                continue

            preds = model(str(frame_file), verbose=False, conf=0.7)
            labels = set()
            for pred in preds:
                if pred.boxes is not None:
                    for cls in pred.boxes.cls:
                        label = model.names[int(cls)]
                        labels.add(label.lower())
            results_per_frame.append(sorted(labels))

        logger.info("Object detection complete for %d frames", len(results_per_frame))

    except ImportError:
        logger.warning("ultralytics not installed, skipping object detection")
        results_per_frame = [[] for _ in frames]
    except Exception as e:
        logger.warning("Object detection failed: %s", e)
        results_per_frame = [[] for _ in frames]

    return results_per_frame


def get_video_status(video_id: str) -> dict | None:
    return _read_status(video_id)


def list_all_videos() -> list[dict]:
    videos = []
    metadata_dir = settings.METADATA_DIR

    if not metadata_dir.exists():
        return videos

    for meta_file in sorted(metadata_dir.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        try:
            with open(meta_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            videos.append(data)
        except (json.JSONDecodeError, OSError) as e:
            logger.warning("Failed to read metadata %s: %s", meta_file, e)

    return videos
