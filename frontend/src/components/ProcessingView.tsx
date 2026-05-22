import { motion } from "framer-motion";
import type { VideoStatus } from "../types";

interface ProcessingViewProps {
  videoStatus: VideoStatus | null;
  videoId: string | null;
}

const STEPS = [
  {
    id: "extracting",
    label: "Extracting frames",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621.504 1.125 1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m1.5 3.75c-.621 0-1.125-.504-1.125-1.125" />
      </svg>
    ),
  },
  {
    id: "detecting",
    label: "Detecting objects",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "embedding",
    label: "Generating embeddings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    id: "indexing",
    label: "Indexing in Qdrant",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
];

function getStepState(
  stepIndex: number,
  status: VideoStatus | null
): "pending" | "active" | "completed" | "error" {
  if (!status) return "pending";

  if (status.status === "failed") return "error";
  if (status.status === "completed") return "completed";

  const progress = status.progress || 0;
  const stepThresholds = [20, 60, 85, 100];

  if (progress >= stepThresholds[stepIndex]) return "completed";
  if (stepIndex === 0 || progress >= stepThresholds[stepIndex - 1]) return "active";
  return "pending";
}

export default function ProcessingView({ videoStatus, videoId }: ProcessingViewProps) {
  const progress = videoStatus?.progress ?? 0;
  const hasError = videoStatus?.status === "failed";
  const isCompleted = videoStatus?.status === "completed";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            animate={isCompleted ? {} : { rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              isCompleted
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : hasError
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-accent/10 border border-accent/20"
            }`}
          >
            {isCompleted ? (
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : hasError ? (
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <motion.svg
                className="w-8 h-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </motion.svg>
            )}
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isCompleted ? "Processing Complete" : hasError ? "Processing Failed" : "Processing Video"}
          </h2>
          <p className="text-sm text-slate-400 font-mono">
            {videoId ? `ID: ${videoId.slice(0, 12)}...` : "Initializing..."}
          </p>
          {videoStatus?.current_step && (
            <p className="text-xs text-accent font-mono mt-2">
              {videoStatus.current_step}
            </p>
          )}
        </div>

        {/* Steps */}
        <div className="glass rounded-2xl p-6 space-y-1">
          {STEPS.map((step, index) => {
            const state = getStepState(index, videoStatus);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                  ${state === "active" ? "bg-accent/5" : ""}
                  ${state === "error" ? "bg-red-500/5" : ""}
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    transition-all duration-300
                    ${
                      state === "completed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : state === "active"
                        ? "bg-accent/10 text-accent"
                        : state === "error"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-surface-50/30 text-slate-600"
                    }
                  `}
                >
                  {state === "completed" ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : state === "active" ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {step.icon}
                    </motion.div>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={`
                      text-sm font-medium
                      ${
                        state === "completed"
                          ? "text-emerald-400"
                          : state === "active"
                          ? "text-white"
                          : state === "error"
                          ? "text-red-400"
                          : "text-slate-600"
                      }
                    `}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  {state === "active" && (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="flex gap-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </motion.div>
                  )}
                  {state === "completed" && (
                    <span className="text-xs font-mono text-emerald-500">DONE</span>
                  )}
                  {state === "error" && (
                    <span className="text-xs font-mono text-red-500">FAIL</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 px-6">
          <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
            <span>
              {videoStatus?.processed_frames || 0} / {videoStatus?.total_frames || 0} frames
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-50/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : hasError
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-primary-500 to-accent"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Error message */}
        {hasError && videoStatus?.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
          >
            <p className="text-sm text-red-400">
              {videoStatus.error}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
