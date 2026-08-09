export type Language = "en" | "es";

export const translations = {
  // Layout
  "layout.subtitle": {
    en: "SEMANTIC VIDEO SEARCH",
    es: "BÚSQUEDA SEMÁNTICA DE VIDEO",
  },
  "layout.processing": {
    en: "PROCESSING",
    es: "PROCESANDO",
  },
  "layout.clearAll": {
    en: "CLEAR ALL",
    es: "BORRAR TODO",
  },
  "layout.clearAllTitle": {
    en: "Clear Everything?",
    es: "¿Borrar Todo?",
  },
  "layout.clearAllDescription": {
    en: "This will permanently delete:",
    es: "Esto eliminará permanentemente:",
  },
  "layout.clearAllVideos": {
    en: "All uploaded videos",
    es: "Todos los videos subidos",
  },
  "layout.clearAllFrames": {
    en: "All extracted frames & thumbnails",
    es: "Todos los frames y miniaturas extraídos",
  },
  "layout.clearAllEmbeddings": {
    en: "All vector embeddings in Qdrant",
    es: "Todos los embeddings vectoriales en Qdrant",
  },
  "layout.clearAllMetadata": {
    en: "All metadata",
    es: "Todos los metadatos",
  },
  "layout.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "layout.deleteAll": {
    en: "Delete All",
    es: "Eliminar Todo",
  },
  "layout.deleting": {
    en: "Deleting...",
    es: "Eliminando...",
  },
  "layout.apiOnline": {
    en: "API",
    es: "API",
  },
  "layout.footerVersion": {
    en: "MOMENTUM v0.1.0 — QDRANT HACKATHON",
    es: "MOMENTUM v0.1.0 — QDRANT HACKATHON",
  },
  "layout.footerPowered": {
    en: "POWERED BY VECTOR EMBEDDINGS",
    es: "POTENCIADO POR EMBEDDINGS VECTORIALES",
  },

  // HomeScreen
  "home.badge": {
    en: "MULTIMODAL SEMANTIC SEARCH ENGINE",
    es: "MOTOR DE BÚSQUEDA SEMÁNTICA MULTIMODAL",
  },
  "home.title": {
    en: "Search Inside Videos",
    es: "Busca Dentro de Videos",
  },
  "home.titleHighlight": {
    en: "Using Meaning",
    es: "Por Significado",
  },
  "home.description": {
    en: "Upload a video and MOMENTUM extracts frames, generates embeddings, and lets you find any moment using natural language.",
    es: "Subí un video y MOMENTUM extrae frames, genera embeddings y te permite encontrar cualquier momento usando lenguaje natural.",
  },
  "home.uploadTitle": {
    en: "Upload Video",
    es: "Subir Video",
  },
  "home.supportedFormats": {
    en: "SUPPORTED: .MP4 .MOV .MKV",
    es: "SOPORTADOS: .MP4 .MOV .MKV",
  },
  "home.featureEmbeddings": {
    en: "AI Embeddings",
    es: "Embeddings IA",
  },
  "home.featureRealtime": {
    en: "Real-time Search",
    es: "Búsqueda en Tiempo Real",
  },
  "home.featureDetection": {
    en: "Object Detection",
    es: "Detección de Objetos",
  },
  "home.featureSemantic": {
    en: "Semantic Understanding",
    es: "Comprensión Semántica",
  },

  // UploadZone
  "upload.clickToBrowse": {
    en: "Click to browse",
    es: "Hacé clic para buscar",
  },
  "upload.dragDrop": {
    en: "or drag & drop",
    es: "o arrastrá y soltá",
  },
  "upload.dropHere": {
    en: "Drop here",
    es: "Soltá acá",
  },
  "upload.formats": {
    en: "MP4, MOV, MKV — Max 2GB",
    es: "MP4, MOV, MKV — Máx 2GB",
  },
  "upload.uploading": {
    en: "Uploading...",
    es: "Subiendo...",
  },
  "upload.errorFormat": {
    en: "Unsupported format. Use .mp4, .mov, or .mkv",
    es: "Formato no soportado. Usá .mp4, .mov o .mkv",
  },
  "upload.errorSize": {
    en: "File too large. Maximum size is 2GB",
    es: "Archivo muy grande. El tamaño máximo es 2GB",
  },
  "upload.errorFailed": {
    en: "Upload failed. Check if the backend is running.",
    es: "Error al subir. Verificá que el backend esté corriendo.",
  },

  // ProcessingView
  "processing.extracting": {
    en: "Extracting frames",
    es: "Extrayendo frames",
  },
  "processing.detecting": {
    en: "Detecting objects",
    es: "Detectando objetos",
  },
  "processing.embedding": {
    en: "Generating embeddings",
    es: "Generando embeddings",
  },
  "processing.indexing": {
    en: "Indexing in Qdrant",
    es: "Indexando en Qdrant",
  },
  "processing.complete": {
    en: "Processing Complete",
    es: "Procesamiento Completo",
  },
  "processing.failed": {
    en: "Processing Failed",
    es: "Procesamiento Fallido",
  },
  "processing.title": {
    en: "Processing Video",
    es: "Procesando Video",
  },
  "processing.initializing": {
    en: "Initializing...",
    es: "Inicializando...",
  },
  "processing.frames": {
    en: "frames",
    es: "frames",
  },

  // SearchBar
  "search.placeholder": {
    en: "Find any moment in any video...",
    es: "Encontrá cualquier momento en cualquier video...",
  },
  "search.placeholderCompact": {
    en: "Search again...",
    es: "Buscar de nuevo...",
  },
  "search.searching": {
    en: "Searching...",
    es: "Buscando...",
  },
  "search.button": {
    en: "Search",
    es: "Buscar",
  },
  "search.hint": {
    en: "to search",
    es: "para buscar",
  },

  // SearchView
  "search.searchingSemantic": {
    en: "Searching semantic space...",
    es: "Buscando en el espacio semántico...",
  },
  "search.readyTitle": {
    en: "Ready to Search",
    es: "Listo para Buscar",
  },
  "search.readyDescription": {
    en: "Type a natural language query to find specific moments in your video.",
    es: "Escribí una consulta en lenguaje natural para encontrar momentos específicos en tu video.",
  },
  "search.noResultsTitle": {
    en: "No moments found",
    es: "No se encontraron momentos",
  },
  "search.noResultsDescription": {
    en: "Try a different search query.",
    es: "Probá con otra búsqueda.",
  },

  // ResultsGrid
  "results.foundMoments": {
    en: "Found Moments",
    es: "Momentos Encontrados",
  },
  "results.count": {
    en: "results",
    es: "resultados",
  },

  // ResultCard
  "result.viewMoment": {
    en: "View Moment",
    es: "Ver Momento",
  },

  // VideoModal
  "modal.semanticMatch": {
    en: "Semantic Match",
    es: "Coincidencia Semántica",
  },
  "modal.atTimestamp": {
    en: "At timestamp",
    es: "En el timestamp",
  },
  "modal.similarity": {
    en: "similarity",
    es: "similitud",
  },
  "modal.detectedObjects": {
    en: "Detected Objects",
    es: "Objetos Detectados",
  },
  "modal.videoId": {
    en: "Video ID",
    es: "ID de Video",
  },
  "modal.frameId": {
    en: "Frame ID",
    es: "ID de Frame",
  },
  "modal.frameThumbnail": {
    en: "Frame thumbnail",
    es: "Miniatura del frame",
  },

  // Language toggle
  "lang.toggle": {
    en: "ES",
    es: "EN",
  },
  "lang.label": {
    en: "Español",
    es: "English",
  },
} as const;

export type TranslationKey = keyof typeof translations;
