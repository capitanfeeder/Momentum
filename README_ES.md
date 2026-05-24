# MOMENTUM

**Motor de Busqueda Semantica en Video**

Subi un video, buscate adentro usando lenguaje natural, encontra el momento exacto que buscas.

---

## Que es esto?

MOMENTUM te permite buscar dentro de contenido de video por significado en vez de por timestamp. Subi cualquier video y el sistema extrae frames, genera embeddings vectoriales con OpenCLIP, indexa todo en Qdrant, y despues podes buscar con consultas como "persona riendo", "escena de atardecer" o "auto yendo rapido" para encontrar los momentos exactos que coinciden.

No es un chatbot. No es RAG. Es busqueda vectorial aplicada a contenido de video.

## Demo

> **[VIDEO DEMO](https://youtu.be/lWiYkjtV1Wk)**

## Como funciona

1. Subis un video (mp4, mov, mkv, avi, webm)
2. El backend extrae frames a 1 frame cada segundo con OpenCV
3. YOLOv8 detecta objetos en cada frame (personas, autos, animales, etc.)
4. OpenCLIP codifica cada frame en un vector de 512 dimensiones
5. Los vectores y metadata se guardan en Qdrant
6. Escribis una consulta de busqueda, se codifica con el mismo modelo CLIP
7. Qdrant devuelve los frames mas similares rankeados por similitud coseno
8. Los resultados con score menor a 0.25 se filtran
9. Los resultados muestran thumbnails con timestamps, scores y objetos detectados

## Stack tecnico

| Componente | Tecnologia |
|-----------|-----------|
| Backend | FastAPI |
| Vector DB | Qdrant (local) |
| Embeddings | OpenCLIP (ViT-B-32) |
| Deteccion de Objetos | YOLOv8 |
| Procesamiento de Video | OpenCV |
| Frontend | React + TypeScript + Vite |
| HTTP Client | Axios |
| Estilos | TailwindCSS |
| Animaciones | Framer Motion |

## Ejecutar en local

### Requisitos

- Python 3.12+
- Node.js 18+ y pnpm
- GPU NVIDIA con CUDA (recomendado, funciona en CPU como alternativa)
- Binario de Qdrant ([descargar aca](https://github.com/qdrant/qdrant/releases))

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Linux/Mac

pip install -r requirements.txt
pip install "numpy==1.26.4"    # arreglar compatibilidad de numpy

# Arrancar Qdrant (terminal aparte)
qdrant.exe

# Arrancar backend
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

La app corre en http://localhost:5173. La API del backend en http://localhost:8000.

### Aceleracion GPU

El `requirements.txt` trae PyTorch con soporte para CUDA 12.4. Si necesitas otra version de CUDA o solo CPU:

```bash
# CUDA 12.4
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124

# Solo CPU
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

El codigo detecta automaticamente si hay CUDA disponible y usa CPU si no lo encuentra.

## Estructura del proyecto

```
momentum/
├── backend/
│   ├── app/
│   │   ├── main.py              # Punto de entrada FastAPI
│   │   ├── config.py            # Configuracion y rutas
│   │   ├── api/                 # Endpoints de la API
│   │   ├── services/            # Pipeline de procesamiento de video
│   │   ├── embeddings/          # Encoder OpenCLIP
│   │   ├── indexing/            # Operaciones con Qdrant
│   │   ├── search/              # Motor de busqueda semantica
│   │   ├── models/              # Schemas Pydantic
│   │   └── utils/               # Utilidades de rutas
│   ├── storage/                 # Datos generados (frames, thumbnails, etc.)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # App principal con navegacion de pantallas
│   │   ├── components/          # Componentes React
│   │   ├── hooks/               # Manejo de estado
│   │   ├── api/                 # Cliente de API (Axios)
│   │   └── types/               # Interfaces TypeScript
│   └── package.json
└── README.md
```

## Endpoints de la API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/upload` | Subir un archivo de video |
| POST | `/api/search` | Busqueda semantica por texto |
| GET | `/api/status/{video_id}` | Estado del procesamiento |
| GET | `/api/videos` | Listar videos indexados |
| GET | `/` | Info de la API |
| GET | `/health` | Health check |
| DELETE | `/api/videos` | Eliminar todos los datos |

## Notas

- Los frames se extraen cada segundo para mejor cobertura temporal
- OpenCLIP ViT-B-32 produce embeddings de 512 dimensiones
- Se usa el modelo nano de YOLOv8 para deteccion de objetos rapida
- El procesamiento corre en threads aparte para no bloquear la API
- La pantalla de procesamiento muestra el progreso en tiempo real (extraer frames, detectar objetos, generar embeddings, indexar)
- Los resultados de busqueda se pueden clickear para abrir un modal de detalle con visualizacion de score y objetos detectados
- Se generan thumbnails de 640px para cada resultado como preview rapida
- Se puede limpiar todo con el boton "CLEAR ALL" en el header

---

Hecho para el [Qdrant Hackathon "Think Outside the Bot"](https://try.qdrant.tech/hackathon-vsd)

Creado por [**Gabriel Sosa**](https://github.com/capitanfeeder) — Desarrollador Backend — [LinkedIn](https://www.linkedin.com/in/gabriel-sosa26/)
