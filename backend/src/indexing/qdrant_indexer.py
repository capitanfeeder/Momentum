from __future__ import annotations

import logging
from typing import Any

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchValue,
    PointIdsList,
    PointStruct,
    VectorParams,
)

from src.config import settings

logger = logging.getLogger(__name__)

_client: QdrantClient | None = None


def _get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(url=settings.QDRANT_URL)
        logger.info("Connected to Qdrant at %s", settings.QDRANT_URL)
    return _client


def create_collection() -> None:
    """Create the Qdrant collection if it doesn't already exist."""
    client = _get_client()
    collections = [c.name for c in client.get_collections().collections]

    if settings.COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=settings.COLLECTION_NAME,
            vectors_config=VectorParams(
                size=settings.EMBEDDING_DIM,
                distance=Distance.COSINE,
            ),
        )
        logger.info("Created collection '%s'", settings.COLLECTION_NAME)

    logger.info("Collection '%s' ready", settings.COLLECTION_NAME)


def upsert_frames(
    video_id: str,
    embeddings: list[list[float]],
    payloads: list[dict[str, Any]],
) -> int:
    """Store frame vectors and metadata in Qdrant.

    Uploads in batches of 100 to keep memory usage reasonable.
    Returns the number of vectors that were indexed.
    """
    client = _get_client()

    if len(embeddings) != len(payloads):
        raise ValueError("embeddings and payloads must have the same length")

    points = []
    for idx, (vec, payload) in enumerate(zip(embeddings, payloads)):
        # deterministic id so we don't duplicate if we re-process a video
        point_id = hash(f"{video_id}:{idx}") & 0xFFFFFFFFFFFFFFFF
        points.append(
            PointStruct(
                id=point_id,
                vector=vec,
                payload={
                    "video_id": video_id,
                    **payload,
                },
            )
        )

    # batch upserts to avoid overwhelming qdrant with huge videos
    batch_size = 100
    total_upserted = 0
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        client.upsert(
            collection_name=settings.COLLECTION_NAME,
            points=batch,
        )
        total_upserted += len(batch)

    logger.info(
        "Upserted %d vectors for video '%s'", total_upserted, video_id
    )
    return total_upserted


def search_vectors(
    query_vector: list[float],
    top_k: int = 20,
    score_threshold: float | None = None,
) -> list[dict[str, Any]]:
    client = _get_client()

    search_params = {
        "collection_name": settings.COLLECTION_NAME,
        "query_vector": query_vector,
        "limit": top_k,
    }
    if score_threshold is not None:
        search_params["score_threshold"] = score_threshold

    results = client.search(**search_params)

    hits = []
    for hit in results:
        hits.append(
            {
                "id": hit.id,
                "score": hit.score,
                "payload": hit.payload or {},
            }
        )
    return hits


def get_collection_info() -> dict[str, Any]:
    client = _get_client()
    info = client.get_collection(settings.COLLECTION_NAME)
    return {
        "vectors_count": info.vectors_count,
        "points_count": info.points_count,
        "status": info.status,
    }


def count_video_vectors(video_id: str) -> int:
    client = _get_client()
    results = client.scroll(
        collection_name=settings.COLLECTION_NAME,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="video_id",
                    match=MatchValue(value=video_id),
                )
            ]
        ),
        limit=10000,
        with_payload=False,
        with_vectors=False,
    )
    return len(results[0])


def delete_video_vectors(video_id: str) -> int:
    client = _get_client()

    results = client.scroll(
        collection_name=settings.COLLECTION_NAME,
        scroll_filter=Filter(
            must=[
                FieldCondition(
                    key="video_id",
                    match=MatchValue(value=video_id),
                )
            ]
        ),
        limit=10000,
        with_payload=False,
        with_vectors=False,
    )

    point_ids = [point.id for point in results[0]]

    if point_ids:
        client.delete(
            collection_name=settings.COLLECTION_NAME,
            points_selector=PointIdsList(points=point_ids),
        )
        logger.info("Deleted %d vectors for video '%s'", len(point_ids), video_id)

    return len(point_ids)


def delete_all_vectors() -> int:
    client = _get_client()

    all_ids = []
    offset = None
    while True:
        results = client.scroll(
            collection_name=settings.COLLECTION_NAME,
            limit=10000,
            offset=offset,
            with_payload=False,
            with_vectors=False,
        )
        points, offset = results
        all_ids.extend([p.id for p in points])
        if offset is None:
            break

    if all_ids:
        client.delete(
            collection_name=settings.COLLECTION_NAME,
            points_selector=PointIdsList(points=all_ids),
        )
        logger.info("Deleted ALL %d vectors from collection", len(all_ids))

    return len(all_ids)
