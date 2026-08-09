from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.config import settings
from src.indexing.qdrant_indexer import create_collection

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("momentum")


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("=== MOMENTUM Backend Starting ===")

    for d in [
        settings.UPLOADS_DIR,
        settings.FRAMES_DIR,
        settings.THUMBNAILS_DIR,
        settings.CLIPS_DIR,
        settings.METADATA_DIR,
    ]:
        d.mkdir(parents=True, exist_ok=True)
    logger.info("Storage directories ready at %s", settings.STORAGE_DIR)

    try:
        create_collection()
        logger.info("Qdrant collection ready")
    except (ConnectionError, OSError) as e:
        logger.warning("Could not connect to Qdrant: %s", e)

    yield

    logger.info("=== MOMENTUM Backend Shutting Down ===")


app = FastAPI(
    title="MOMENTUM",
    description="Multimodal Semantic Video Search Engine for Video Moments",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from src.api import delete, search, status, upload, videos

app.include_router(upload.router)
app.include_router(search.router)
app.include_router(status.router)
app.include_router(videos.router)
app.include_router(delete.router)

settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/storage",
    StaticFiles(directory=str(settings.STORAGE_DIR)),
    name="storage",
)


@app.get("/")
async def root():
    return {
        "name": "MOMENTUM",
        "version": "0.1.0",
        "description": "Multimodal Semantic Video Search Engine",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
