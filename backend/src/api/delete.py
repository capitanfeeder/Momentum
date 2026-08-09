from __future__ import annotations

import logging
import shutil

from fastapi import APIRouter

from src.config import settings
from src.indexing.qdrant_indexer import delete_all_vectors
from src.services.video_processor import list_all_videos

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["videos"])


@router.delete("/videos")
async def delete_all_videos():
    """Nuke everything — all videos, frames, embeddings, metadata.

    Used by the CLEAR ALL button in the header. Tries its best even
    if some parts fail (e.g. qdrant is down but files still get deleted).
    """
    videos = list_all_videos()
    deleted_vectors = 0
    deleted_videos = 0
    errors = []

    # wipe qdrant first
    try:
        deleted_vectors = delete_all_vectors()
    except Exception as e:
        logger.warning("Failed to delete Qdrant vectors: %s", e)
        errors.append(f"Qdrant: {e}")

    # then clean up all the storage directories
    for directory in [
        settings.UPLOADS_DIR,
        settings.FRAMES_DIR,
        settings.THUMBNAILS_DIR,
        settings.CLIPS_DIR,
        settings.METADATA_DIR,
    ]:
        if directory.exists():
            try:
                for item in directory.iterdir():
                    if item.is_dir():
                        shutil.rmtree(item)
                    else:
                        item.unlink()
            except Exception as e:
                errors.append(f"{directory.name}: {e}")

    deleted_videos = len(videos)

    logger.info(
        "Deleted ALL data: %d videos, %d vectors, %d errors",
        deleted_videos, deleted_vectors, len(errors),
    )

    return {
        "deleted_videos": deleted_videos,
        "deleted_vectors": deleted_vectors,
        "errors": errors,
        "message": f"Cleared {deleted_videos} videos and {deleted_vectors} vectors",
    }
