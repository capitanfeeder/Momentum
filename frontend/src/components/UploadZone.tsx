import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  progress: number;
  isUploading: boolean;
}

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/x-matroska"];
const ACCEPTED_EXTENSIONS = [".mp4", ".mov", ".mkv"];

export default function UploadZone({
  onUpload,
  progress,
  isUploading,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      setError("Unsupported format. Use .mp4, .mov, or .mkv");
      return false;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError("File too large. Maximum size is 2GB");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;
      setFileName(file.name);
      setError(null);
      try {
        await onUpload(file);
      } catch (err) {
        console.error('[UploadZone] Upload failed:', err);
        setError(err instanceof Error ? err.message : "Upload failed. Check if the backend is running.");
        setFileName(null);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="h-full">
      <input
        ref={inputRef}
        type="file"
        accept=".mp4,.mov,.mkv,video/mp4,video/quicktime,video/x-matroska"
        onChange={handleInputChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            {/* Progress ring */}
            <div className="relative w-20 h-20 mb-6">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="rgba(0,212,255,0.1)"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#00d4ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={226.2}
                  strokeDashoffset={226.2 * (1 - progress / 100)}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono text-accent font-semibold">
                  {progress}%
                </span>
              </div>
            </div>

            {fileName && (
              <p className="text-sm text-slate-400 font-mono truncate max-w-full mb-1">
                {fileName}
              </p>
            )}
            <p className="text-xs text-slate-500 font-mono">Uploading...</p>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center py-12
              border-2 border-dashed rounded-xl cursor-pointer
              transition-all duration-300 group
              ${
                isDragOver
                  ? "border-accent bg-accent/5 shadow-glow"
                  : "border-slate-700/50 hover:border-accent/30 hover:bg-surface-50/30"
              }
            `}
          >
            <motion.div
              animate={{
                y: isDragOver ? -5 : 0,
                scale: isDragOver ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-4"
            >
              <div
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300
                ${
                  isDragOver
                    ? "bg-accent/20"
                    : "bg-surface-50/50 group-hover:bg-accent/10"
                }
              `}
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    isDragOver ? "text-accent" : "text-slate-500 group-hover:text-accent"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
            </motion.div>

            <p className="text-sm text-slate-400 mb-1">
              {isDragOver ? (
                <span className="text-accent">Drop here</span>
              ) : (
                <>
                  <span className="text-accent font-medium">Click to browse</span>{" "}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-xs text-slate-600 font-mono">
              MP4, MOV, MKV — Max 2GB
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <p className="text-xs text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
