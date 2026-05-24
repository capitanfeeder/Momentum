from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.indexing.qdrant_indexer import create_collection

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("momentum")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle. Creates storage dirs and ensures Qdrant collection exists."""
    logger.info("=== MOMENTUM Backend Starting ===")

    # make sure all storage folders are there before anything runs
    for d in [
        settings.UPLOADS_DIR,
        settings.FRAMES_DIR,
        settings.THUMBNAILS_DIR,
        settings.CLIPS_DIR,
        settings.METADATA_DIR,
    ]:
        d.mkdir(parents=True, exist_ok=True)
    logger.info("Storage directories ready at %s", settings.STORAGE_DIR)

    # init the qdrant collection — if it's already there this is a no-op
    try:
        create_collection()
        logger.info("Qdrant collection ready")
    except Exception as e:
        logger.warning("Could not connect to Qdrant: %s", e)

    yield

    logger.info("=== MOMENTUM Backend Shutting Down ===")


app = FastAPI(
    title="MOMENTUM",
    description="Multimodal Semantic Video Search Engine for Video Moments",
    version="0.1.0",
    lifespan=lifespan,
)

# allow the frontend dev server to talk to the API
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


from app.api import upload, search, status, videos, delete

app.include_router(upload.router)
app.include_router(search.router)
app.include_router(status.router)
app.include_router(videos.router)
app.include_router(delete.router)

# serve generated files (frames, thumbnails, clips) as static assets
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
