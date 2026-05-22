import { motion } from "framer-motion";
import type { SearchResult } from "../types";

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onClick: () => void;
}

export default function ResultCard({ result, index, onClick }: ResultCardProps) {
  const scorePercent = Math.round(result.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        group cursor-pointer rounded-2xl overflow-hidden
        glass border-glow
        hover:shadow-glow-lg
        transition-shadow duration-300
      "
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-surface-400/50 overflow-hidden">
        {result.thumbnail_path ? (
          <img
            src={result.thumbnail_path}
            alt={`Frame at ${result.timestamp_formatted}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-50/20">
            <svg
              className="w-12 h-12 text-slate-600"
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
          </div>
        )}

        {/* Timestamp badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-xs font-mono text-white">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {result.timestamp_formatted}
          </span>
        </div>

        {/* Score badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-mono font-semibold
              ${
                scorePercent >= 80
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : scorePercent >= 50
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
              }
            `}
          >
            {scorePercent}%
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="text-xs font-mono text-white/80 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            View Moment
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Objects */}
        {result.objects && result.objects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {result.objects.slice(0, 4).map((obj) => (
              <span
                key={obj}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-50/40 text-[10px] font-mono text-slate-400 border border-slate-700/30"
              >
                {obj}
              </span>
            ))}
            {result.objects.length > 4 && (
              <span className="text-[10px] font-mono text-slate-500">
                +{result.objects.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Video ID */}
        <p className="text-[10px] font-mono text-slate-600 truncate">
          {result.video_id}
        </p>
      </div>
    </motion.div>
  );
}
