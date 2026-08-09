import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteAllVideos } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import type { AppScreen } from "../types";

interface LayoutProps {
  children: ReactNode;
  screen: AppScreen;
  onLogoClick: () => void;
  onCleared?: () => void;
}

export default function Layout({ children, screen, onLogoClick, onCleared }: LayoutProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await deleteAllVideos();
      onCleared?.();
    } catch (err) {
      console.error("[Layout] Clear all failed:", err);
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={onLogoClick}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <img src="/logo.PNG" alt="MOMENTUM" className="h-8 w-8 rounded-lg" />
                <div className="absolute inset-0 w-8 h-8 rounded-lg bg-accent/20 blur-md group-hover:bg-accent/30 transition-all" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-widest text-white group-hover:text-accent transition-colors">
                  MOMENTUM
                </h1>
                <p className="text-[10px] font-mono text-slate-500 tracking-wider -mt-0.5">
                  {t("layout.subtitle")}
                </p>
              </div>
            </button>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {screen === "processing" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
                >
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-mono text-accent">
                    {t("layout.processing")}
                  </span>
                </motion.div>
              )}

              {/* Clear All button */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  bg-red-500/10 border border-red-500/20
                  text-xs font-mono text-red-400
                  hover:bg-red-500/20 hover:border-red-500/30
                  transition-all duration-200
                "
                title={t("layout.clearAll")}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="hidden sm:inline">{t("layout.clearAll")}</span>
              </button>

              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  bg-accent/10 border border-accent/20
                  text-xs font-mono text-accent
                  hover:bg-accent/20 hover:border-accent/30
                  transition-all duration-200
                "
                title={t("lang.label")}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
                <span className="hidden sm:inline">{t("lang.toggle")}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>API</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Clear All confirmation dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => !clearing && setShowClearConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-strong rounded-2xl p-6 max-w-sm w-full border-glow"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t("layout.clearAllTitle")}
                </h3>
                <p className="text-sm text-slate-400 mb-1">
                  {t("layout.clearAllDescription")}
                </p>
                <ul className="text-xs text-slate-500 font-mono mb-6 space-y-1">
                  <li>• {t("layout.clearAllVideos")}</li>
                  <li>• {t("layout.clearAllFrames")}</li>
                  <li>• {t("layout.clearAllEmbeddings")}</li>
                  <li>• {t("layout.clearAllMetadata")}</li>
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    disabled={clearing}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-50/30 border border-slate-700/30 text-sm text-slate-400 hover:text-white hover:bg-surface-50/50 transition-all duration-200 disabled:opacity-50"
                  >
                    {t("layout.cancel")}
                  </button>
                  <button
                    onClick={handleClearAll}
                    disabled={clearing}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
                  >
                    {clearing ? t("layout.deleting") : t("layout.deleteAll")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial-gradient opacity-40" />
        </div>
        <div className="absolute inset-0 bg-grid bg-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-mono">
            {t("layout.footerVersion")}
          </p>
          <p className="text-xs text-slate-600 font-mono">
            {t("layout.footerPowered")}
          </p>
        </div>
      </footer>
    </div>
  );
}
