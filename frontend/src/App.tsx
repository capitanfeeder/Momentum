import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import HomeScreen from "./components/HomeScreen";
import ProcessingView from "./components/ProcessingView";
import SearchView from "./components/SearchView";
import VideoModal from "./components/VideoModal";
import { useVideoSearch } from "./hooks/useVideoSearch";

function App() {
  const {
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
  } = useVideoSearch();

  return (
    <div className="min-h-screen bg-surface-600 noise-overlay relative">
      <div className="scan-line" />
      <Layout screen={screen} onLogoClick={goToHome} onCleared={goToHome}>
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <HomeScreen
                onUpload={handleUpload}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
              />
            </motion.div>
          )}

          {screen === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ProcessingView
                videoStatus={videoStatus}
                videoId={currentVideoId}
              />
            </motion.div>
          )}

          {screen === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SearchView
                query={query}
                setQuery={setQuery}
                results={results}
                searching={searching}
                searchError={searchError}
                onSearch={handleSearch}
                onSelectResult={setSelectedResult}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>

      <AnimatePresence>
        {selectedResult && (
          <VideoModal
            result={selectedResult}
            onClose={() => setSelectedResult(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
