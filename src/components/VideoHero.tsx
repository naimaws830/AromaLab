import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoHeroProps {
  onVideoEnd: () => void;
  showContent: boolean;
}

const VideoHero = ({ onVideoEnd, showContent }: VideoHeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoEnded(true);
      onVideoEnd();
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [onVideoEnd]);

  return (
    <div className="fixed inset-0 w-full h-screen z-0">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        src="/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-warm-black/30" />

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-sans-refined text-sm tracking-[0.35em] uppercase text-cream/70 mb-6"
            >
              A journey through scent
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-medium text-cream leading-tight mb-8"
            >
              Aroma<span className="text-gradient-amber">Lab</span>
              <br />
              <span className="italic text-cream/80">Your Scent. Your Story.</span>
            </motion.h1>
            <motion.a
              href="#perfumes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-4 px-10 py-4 border border-cream/40 text-cream font-sans-refined text-sm tracking-[0.2em] uppercase hover:bg-cream/10 transition-all duration-500 backdrop-blur-sm"
            >
              Create Your Signature Scent
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      {!videoEnded && !showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-cream/50 font-sans-refined text-xs tracking-[0.2em] uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-8 bg-gradient-to-b from-cream/50 to-transparent"
          />
        </motion.div>
      )}
    </div>
  );
};

export default VideoHero;
