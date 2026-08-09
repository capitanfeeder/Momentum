# MOMENTUM

**Semantic Video Search Engine**

Upload a video, search inside it using natural language, find the exact moment you're looking for.

---

## What is this?

MOMENTUM lets you search through video content by meaning instead of timestamps. Upload any video and the system extracts frames, generates vector embeddings with OpenCLIP, indexes everything in Qdrant, and then you can search with queries like "person laughing", "sunset scene", or "car driving fast" to find the exact moments that match.

This is not a chatbot. It's not RAG. It's vector search applied to video content.

## Demo

> **[DEMO VIDEO](https://youtu.be/lWiYkjtV1Wk)**

## How it works

1. You upload a video (mp4, mov, mkv, avi, webm)
2. Backend extracts frames at 1 frame every second using OpenCV
3. YOLOv8 detects objects in each frame (people, cars, animals, etc.)
4. OpenCLIP encodes each frame into a 512-dimensional vector
5. Vectors and metadata are stored in Qdrant
6. You type a search query, it gets encoded with the same CLIP model
7. Qdrant returns the most similar frames ranked by cosine similarity
8. Results with score below 0.25 are filtered out
9. Results show thumbnails with timestamps, scores, and detected objects

## Tech stack

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI |
| Vector DB | Qdrant (local) |
| Embeddings | OpenCLIP (ViT-B-32) |
| Object Detection | YOLOv8 |
| Video Processing | OpenCV |
| Frontend | React + TypeScript + Vite |
| HTTP Client | Axios |
| Styling | TailwindCSS |
| Animations | Framer Motion |

## Running locally

### Prerequisites

- Python 3.12+
- Node.js 18+ and pnpm
- NVIDIA GPU with CUDA (recommended, falls back to CPU)
- Docker (for Qdrant)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Linux/Mac
# venv\Scripts\activate        # Windows

pip install -r requirements.txt
pip install "numpy==1.26.4"    # fix numpy compatibility

# Start Qdrant (from project root)
docker compose up -d

# Start backend
python main.py
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The app runs at http://localhost:5173. The backend API is at http://localhost:8000.

### GPU acceleration

The default `requirements.txt` installs PyTorch with CUDA 12.4 support. If you need a different CUDA version or want CPU-only:

```bash
# CUDA 12.4
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124

# CPU only
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

The code automatically detects CUDA availability and falls back to CPU if needed.

## Project structure

```
momentum/
├── docker-compose.yml           # Qdrant container
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Settings and paths
│   ├── src/
│   │   ├── api/                 # API endpoints
│   │   ├── services/            # Video processing pipeline
│   │   ├── embeddings/          # OpenCLIP encoder
│   │   ├── indexing/            # Qdrant operations
│   │   ├── search/              # Semantic search engine
│   │   ├── models/              # Pydantic schemas
│   │   └── utils/               # Path utilities
│   ├── storage/                 # Generated data (frames, thumbnails, etc.)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main app with screen routing
│   │   ├── components/          # React components
│   │   ├── hooks/               # State management
│   │   ├── api/                 # API client (Axios)
│   │   └── types/               # TypeScript interfaces
│   └── package.json
└── README.md
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Upload a video file |
| POST | `/api/search` | Semantic text search |
| GET | `/api/status/{video_id}` | Processing status |
| GET | `/api/videos` | List indexed videos |
| GET | `/` | API info |
| GET | `/health` | Health check |
| DELETE | `/api/videos` | Delete all data |

## Notes

- Frames are extracted every second for better temporal coverage
- OpenCLIP ViT-B-32 produces 512-dimensional embeddings
- YOLOv8 nano model is used for fast object detection
- Processing runs in background threads to keep the API responsive
- Processing view shows real-time progress (extracting frames, detecting objects, generating embeddings, indexing)
- Search results can be clicked to open a detail modal with score visualization and detected objects
- Clip thumbnails (640px) are generated for each result for faster preview
- All data can be cleared with the "CLEAR ALL" button in the header

---

Built for the [Qdrant Hackathon "Think Outside the Bot"](https://try.qdrant.tech/hackathon-vsd)

Created by [**Gabriel Sosa**](https://github.com/capitanfeeder) — Backend Developer — [LinkedIn](https://www.linkedin.com/in/gabriel-sosa26/)
