from pathlib import Path


class Settings:
    """Central config — paths, model settings, and defaults."""

    # qdrant
    QDRANT_URL = "http://localhost:6333"
    COLLECTION_NAME = "video_frames"
    EMBEDDING_DIM = 512

    # directory layout — everything lives under backend/storage/
    BASE_DIR = Path(__file__).resolve().parent.parent
    STORAGE_DIR = BASE_DIR / "storage"
    UPLOADS_DIR = STORAGE_DIR / "uploads"
    FRAMES_DIR = STORAGE_DIR / "frames"
    THUMBNAILS_DIR = STORAGE_DIR / "thumbnails"
    CLIPS_DIR = STORAGE_DIR / "clips"
    METADATA_DIR = STORAGE_DIR / "metadata"

    # how often we pull frames from the video (1 = every second)
    FRAME_INTERVAL = 1

    # openclip config
    EMBEDDING_MODEL = "ViT-B-32"
    EMBEDDING_PRETRAIN = "openai"
    DEVICE = "cuda"

    CLIP_DURATION = 5
    SEARCH_TOP_K = 20

    # frames get resized to this before encoding
    FRAME_SIZE = (224, 224)


settings = Settings()
