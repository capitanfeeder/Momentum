import { motion } from "framer-motion";
import ResultCard from "./ResultCard";
import { useLanguage } from "../i18n/LanguageContext";
import type { SearchResult } from "../types";

interface ResultsGridProps {
  results: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
}

export default function ResultsGrid({ results, onSelectResult }: ResultsGridProps) {
  const { t } = useLanguage();
  if (results.length === 0) return null;

  return (
    <div className="mt-8">
      {/* Results header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-accent" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {t("results.foundMoments")}
          </h3>
          <span className="text-xs font-mono text-slate-500 px-2 py-0.5 rounded-md bg-surface-50/30 border border-slate-700/30">
            {results.length} {t("results.count")}
          </span>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((result, index) => (
          <ResultCard
            key={result.id}
            result={result}
            index={index}
            onClick={() => onSelectResult(result)}
          />
        ))}
      </div>
    </div>
  );
}
