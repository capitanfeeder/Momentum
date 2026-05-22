from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import numpy as np
import torch
from PIL import Image

logger = logging.getLogger(__name__)

_model = None
_tokenizer = None


def _get_device() -> str:
    if torch.cuda.is_available():
        return "cuda"
    logger.warning("CUDA not available, falling back to CPU")
    return "cpu"


def _load_model():
    global _model, _tokenizer
    if _model is not None:
        return _model, _tokenizer

    import open_clip

    from app.config import settings

    device = _get_device()
    logger.info(
        "Loading OpenCLIP model %s (pretrained=%s) on %s",
        settings.EMBEDDING_MODEL,
        settings.EMBEDDING_PRETRAIN,
        device,
    )

    model, _, preprocess = open_clip.create_model_and_transforms(
        settings.EMBEDDING_MODEL,
        pretrained=settings.EMBEDDING_PRETRAIN,
        device=device,
    )
    tokenizer = open_clip.get_tokenizer(settings.EMBEDDING_MODEL)

    _model = model
    _tokenizer = tokenizer
    return _model, _tokenizer


def encode_image(image_path: Path | str, device: Optional[str] = None) -> np.ndarray:
    model, _ = _load_model()
    device = device or _get_device()

    img = Image.open(str(image_path)).convert("RGB")
    img_tensor = _preprocess_image(img).unsqueeze(0).to(device)

    with torch.no_grad():
        features = model.encode_image(img_tensor)
        features = features / features.norm(dim=-1, keepdim=True)

    return features.cpu().numpy().flatten().astype(np.float32)


def encode_text(text: str, device: Optional[str] = None) -> np.ndarray:
    model, tokenizer = _load_model()
    device = device or _get_device()

    tokens = tokenizer([text]).to(device)

    with torch.no_grad():
        features = model.encode_text(tokens)
        features = features / features.norm(dim=-1, keepdim=True)

    return features.cpu().numpy().flatten().astype(np.float32)


def encode_images_batch(
    image_paths: list[Path | str], batch_size: int = 32, device: Optional[str] = None
) -> list[np.ndarray]:
    model, _ = _load_model()
    device = device or _get_device()

    all_embeddings = []

    for i in range(0, len(image_paths), batch_size):
        batch_paths = image_paths[i : i + batch_size]
        tensors = []

        for p in batch_paths:
            img = Image.open(str(p)).convert("RGB")
            tensors.append(_preprocess_image(img))

        batch = torch.stack(tensors).to(device)

        with torch.no_grad():
            features = model.encode_image(batch)
            features = features / features.norm(dim=-1, keepdim=True)

        for f in features.cpu().numpy():
            all_embeddings.append(f.astype(np.float32))

    logger.info("Batch-encoded %d images", len(all_embeddings))
    return all_embeddings


def _preprocess_image(img: Image.Image):
    from torchvision import transforms

    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.48145466, 0.4578275, 0.40821073],
                std=[0.26862954, 0.26130258, 0.27577711],
            ),
        ]
    )
    return transform(img)


def get_model():
    model, _ = _load_model()
    return model
