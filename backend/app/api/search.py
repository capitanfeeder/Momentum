from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import SearchRequest
from app.search.semantic_search import search

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["search"])


@router.post("/search")
async def semantic_search_endpoint(request: SearchRequest):
    """Take a text query and return the most relevant video frames."""
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        results = search(query, top_k=request.top_k)
    except Exception as e:
        logger.exception("Search failed for query: %s", query)
        raise HTTPException(status_code=500, detail=f"Search failed: {e}")

    return {
        "results": results,
        "query": query,
        "total_results": len(results),
    }
