from __future__ import annotations

import logging
from pathlib import Path

from app.config import settings
from app.embeddings.clip_encoder import encode_text
from app.indexing.qdrant_indexer import search_vectors
from app.models.schemas import SearchResult

logger = logging.getLogger(__name__)


def search(query_text: str, top_k: int = 20) -> list[SearchResult]:
    logger.info("Searching for: '%s' (top_k=%d)", query_text, top_k)

    query_vector = encode_text(query_text).tolist()

    hits = search_vectors(query_vector, top_k=top_k)

    results = []
    for i, hit in enumerate(hits):
        payload = hit["payload"]
        video_id = payload.get("video_id", "")
        timestamp = payload.get("timestamp_seconds", 0.0)
        frame_rel = payload.get("frame_path", "")
        thumb_rel = payload.get("thumbnail_path", "")
        objects = payload.get("objects", [])

        minutes = int(timestamp) // 60
        seconds = int(timestamp) % 60
        timestamp_formatted = f"{minutes:02d}:{seconds:02d}"

        frame_abs = ""
        if frame_rel:
            frame_file = settings.STORAGE_DIR / frame_rel
            if frame_file.exists():
                frame_abs = f"/storage/{frame_rel}"

        thumb_abs = ""
        if thumb_rel:
            thumb_file = settings.STORAGE_DIR / thumb_rel
            if thumb_file.exists():
                thumb_abs = f"/storage/{thumb_rel}"

        clip_abs = None
        clip_rel = payload.get("clip_path")
        if clip_rel:
            clip_file = settings.STORAGE_DIR / clip_rel
            if clip_file.exists():
                clip_abs = f"/storage/{clip_rel}"

        result_id = f"{video_id}_{i}"

        results.append(
            SearchResult(
                id=result_id,
                video_id=video_id,
                timestamp_seconds=timestamp,
                timestamp_formatted=timestamp_formatted,
                score=round(hit["score"], 4),
                frame_path=frame_abs,
                thumbnail_path=thumb_abs,
                objects=objects if isinstance(objects, list) else [],
                clip_path=clip_abs,
            )
        )

    logger.info("Found %d results", len(results))
    return results
