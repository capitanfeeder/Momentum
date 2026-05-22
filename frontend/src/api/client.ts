import axios from 'axios';
import type { VideoStatus, VideoInfo, UploadResponse, SearchResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject(new Error(message));
  }
);

export async function uploadVideo(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<UploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });
  return data;
}

export async function searchVideos(
  query: string,
  topK: number = 12
): Promise<SearchResponse> {
  const { data } = await api.post<SearchResponse>('/search', {
    query,
    top_k: topK,
  });
  return data;
}

export async function getStatus(videoId: string): Promise<VideoStatus> {
  const { data } = await api.get<VideoStatus>('/status/' + videoId);
  return data;
}

export async function listVideos(): Promise<VideoInfo[]> {
  const { data } = await api.get<VideoInfo[]>('/videos');
  return data;
}

export async function deleteVideo(videoId: string): Promise<void> {
  await api.delete(`/videos/${videoId}`);
}

export async function deleteAllVideos(): Promise<void> {
  await api.delete('/videos');
}

export default api;
