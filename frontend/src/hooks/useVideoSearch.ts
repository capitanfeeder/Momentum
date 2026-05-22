import { useState, useCallback, useRef, useEffect } from 'react';
import { searchVideos, getStatus, uploadVideo } from '../api/client';
import type { SearchResult, VideoStatus, AppScreen } from '../types';

export function useVideoSearch() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<VideoStatus | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const response = await searchVideos(searchQuery);
      setResults(response.results);
      setScreen('search');
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const response = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      setCurrentVideoId(response.video_id);
      setScreen('processing');
    } catch (err) {
      setIsUploading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (screen === 'processing' && currentVideoId) {
      pollRef.current = setInterval(async () => {
        try {
          const status = await getStatus(currentVideoId);
          setVideoStatus(status);
          if (status.status === 'completed') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsUploading(false);
            setScreen('search');
          } else if (status.status === 'failed') {
            if (pollRef.current) clearInterval(pollRef.current);
            setIsUploading(false);
          }
        } catch {
        }
      }, 2000);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [screen, currentVideoId]);

  const goToHome = useCallback(() => {
    setScreen('home');
    setResults([]);
    setQuery('');
    setVideoStatus(null);
    setCurrentVideoId(null);
    setUploadProgress(0);
    setIsUploading(false);
    setSelectedResult(null);
    setSearchError(null);
  }, []);

  return {
    screen,
    results,
    query,
    setQuery,
    searching,
    searchError,
    videoStatus,
    currentVideoId,
    uploadProgress,
    isUploading,
    selectedResult,
    setSelectedResult,
    handleSearch,
    handleUpload,
    goToHome,
  };
}
