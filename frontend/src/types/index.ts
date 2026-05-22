export interface SearchResult {
  id: string;
  video_id: string;
  timestamp_seconds: number;
  timestamp_formatted: string;
  score: number;
  thumbnail_path: string;
  objects: string[];
}

export interface VideoStatus {
  video_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  current_step?: string;
  total_frames?: number;
  processed_frames?: number;
  error?: string | null;
}

export interface VideoInfo {
  video_id: string;
  filename: string;
  status: string;
  frame_count: number;
  indexed_at: string;
}

export interface UploadResponse {
  video_id: string;
  status: string;
  message: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total_results: number;
}

export type AppScreen = 'home' | 'processing' | 'search';
