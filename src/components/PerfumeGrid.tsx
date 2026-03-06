import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const perfumes = [
  {
    name: "Blossom Veil",
    video: "/videos/perfume1.mp4",
    family: "Floral",
    description:
      "A velvety embrace of Bulgarian rose and peony, laced with powdery iris and warm skin musk.",
  },
  {
    name: "Forest Whisper",
    video: "/videos/perfume2.mp4",
    family: "Woody",
    description:
      "Deep amber resin and cedarwood grounded in rich vetiver and sun-baked earth.",
  },
  {
    name: "Mystic Ember",
    video: "/videos/perfume3.mp4",
    family: "Oriental",
    description:
      "Smoldering oud and black leather wrapped in saffron smoke and dark vanilla.",
  },
  {
    name: "Sunlit Zest",
    video: "/videos/perfume4.mp4",
    family: "Citrus",
    description:
      "Bright neroli and bergamot kissed by white tea and sunlit driftwood.",
  },
  {
    name: "Caramel Drift",
    video: "/videos/perfume5.mp4",
    family: "Gourmand",
    description:
      "Rich salted caramel meets honeyed tobacco with a warm vanilla trail.",
  },
];

const TOTAL = perfumes.length;

const PerfumeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollCooldown = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const rotate = useCallback((dir: number) => {
    setActiveIndex((prev) => (prev + dir + TOTAL) % TOTAL);
  }, []);

  // Play/pause videos based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);


  // Keyboard arrows
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") rotate(1);
      if (e.key === "ArrowLeft") rotate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rotate]);

  // Touch swipe support
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      rotate(diff > 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  const getSlotStyle = (offset: number) => {
    if (offset === 0) return { x: "0%", scale: 1, z: 20, opacity: 1 };
    return { x: offset > 0 ? "100%" : "-100%", scale: 0.6, z: 0, opacity: 0 };
  };

  return (
    <section
      id="perfumes"
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-section overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-sans-refined text-xs tracking-[0.35em] uppercase text-muted-foreground mb-4">
            Our Collection
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-medium text-foreground">
            Sample Our <span className="italic text-primary">Signatures</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative h-[350px] md:h-[450px] flex items-center justify-center">
          {perfumes.map((perfume, i) => {
            let offset = i - activeIndex;
            if (offset > Math.floor(TOTAL / 2)) offset -= TOTAL;
            if (offset < -Math.floor(TOTAL / 2)) offset += TOTAL;

            const style = getSlotStyle(offset);
            const isActive = offset === 0;

            return (
              <motion.div
                key={perfume.name}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.z,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
                className="absolute"
                style={{ transformOrigin: "center center" }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-shadow duration-500 ${
                    isActive ? "shadow-2xl shadow-primary/30" : ""
                  }`}
                >
                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={perfume.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-[340px] md:w-[560px] lg:w-[640px] aspect-video object-cover rounded-2xl"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Arrow controls */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <button
            onClick={() => rotate(-1)}
            className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors duration-300"
            aria-label="Previous perfume"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {perfumes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-primary w-6"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to perfume ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => rotate(1)}
            className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors duration-300"
            aria-label="Next perfume"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active perfume info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center mt-10 max-w-lg mx-auto"
          >
            <span className="font-sans-refined text-xs tracking-[0.3em] uppercase text-accent">
              {perfumes[activeIndex].family}
            </span>
            <h3 className="font-serif-display text-3xl md:text-4xl font-medium text-foreground mt-2 mb-3">
              {perfumes[activeIndex].name}
            </h3>
            <p className="font-serif-body text-lg md:text-xl text-muted-foreground leading-relaxed">
              {perfumes[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerfumeCarousel;
