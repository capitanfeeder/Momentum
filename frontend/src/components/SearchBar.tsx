import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  searching: boolean;
  compact?: boolean;
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  searching,
  compact = false,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!compact) {
      inputRef.current?.focus();
    }
  }, [compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !searching) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 30px rgba(0, 212, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.05)"
            : "0 0 0px rgba(0, 212, 255, 0)",
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative rounded-2xl border transition-all duration-300
          ${
            focused
              ? "border-accent/30 bg-surface-400/60"
              : "border-slate-700/40 bg-surface-400/40 hover:border-slate-600/50"
          }
          ${compact ? "rounded-xl" : "rounded-2xl"}
        `}
      >
        <div className="flex items-center">
          {/* Search icon */}
          <div className="pl-4 sm:pl-6">
            <svg
              className={`w-5 h-5 transition-colors duration-300 ${
                focused ? "text-accent" : "text-slate-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={
              compact
                ? "Search again..."
                : "Find any moment in any video..."
            }
            disabled={searching}
            className={`
              flex-1 bg-transparent border-none outline-none
              text-white placeholder-slate-500
              font-sans
              disabled:opacity-50
              ${compact ? "px-4 py-3 text-sm" : "px-4 py-5 sm:py-6 text-base sm:text-lg"}
            `}
          />

          {/* Submit button */}
          <div className="pr-3 sm:pr-4">
            <button
              type="submit"
              disabled={!query.trim() || searching}
              className={`
                flex items-center justify-center rounded-xl
                bg-gradient-to-r from-primary-600 to-accent-dim
                text-white font-medium
                hover:from-primary-500 hover:to-accent
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-300
                shadow-lg shadow-primary-500/20 hover:shadow-accent/30
                active:scale-95
                ${compact ? "px-4 py-2 text-sm gap-2" : "px-5 sm:px-6 py-3 text-sm gap-2"}
              `}
            >
              {searching ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              )}
              <span className="hidden sm:inline">
                {searching ? "Searching..." : "Search"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Keyboard hint */}
      {!compact && (
        <div className="flex justify-center mt-3">
          <p className="text-xs text-slate-600 font-mono flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-50/30 border border-slate-700/30 text-slate-500">
              Enter
            </kbd>
            to search
          </p>
        </div>
      )}
    </form>
  );
}
