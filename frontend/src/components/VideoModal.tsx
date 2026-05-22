import { useEffect } from "react";
import { motion } from "framer-motion";
import type { SearchResult } from "../types";

interface VideoModalProps {
  result: SearchResult;
  onClose: () => void;
}

export default function VideoModal({ result, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const scorePercent = Math.round(result.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-3xl glass-strong rounded-2xl overflow-hidden border-glow"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-10 h-10 rounded-xl
            bg-black/50 backdrop-blur-sm
            border border-white/10
            flex items-center justify-center
            text-slate-400 hover:text-white hover:bg-white/10
            transition-all duration-200
          "
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video/Thumbnail area */}
        <div className="relative aspect-video bg-black">
          {result.thumbnail_path ? (
            <img
              src={result.thumbnail_path}
              alt={`Frame at ${result.timestamp_formatted}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-400/30">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-slate-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125"
                  />
                </svg>
                <p className="text-sm text-slate-500">Frame thumbnail</p>
              </div>
            </div>
          )}

          {/* Timestamp overlay */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-sm font-mono text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {result.timestamp_formatted}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Semantic Match
              </h3>
              <p className="text-sm text-slate-400">
                At timestamp {result.timestamp_formatted} (
                {result.timestamp_seconds}s)
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{scorePercent}%</div>
              <p className="text-xs text-slate-500 font-mono">similarity</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="mb-4">
            <div className="h-2 bg-surface-50/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className={`h-full rounded-full ${
                  scorePercent >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : scorePercent >= 50
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-slate-500 to-slate-400"
                }`}
              />
            </div>
          </div>

          {/* Objects */}
          {result.objects && result.objects.length > 0 && (
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                Detected Objects
              </p>
              <div className="flex flex-wrap gap-2">
                {result.objects.map((obj) => (
                  <span
                    key={obj}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-50/30 text-xs font-mono text-slate-300 border border-slate-700/30"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t border-slate-700/30">
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-600">Video ID</span>
                <p className="text-slate-400 mt-0.5 truncate">{result.video_id}</p>
              </div>
              <div>
                <span className="text-slate-600">Frame ID</span>
                <p className="text-slate-400 mt-0.5 truncate">{result.id}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
