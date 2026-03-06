import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import AboutSection from "@/components/AboutSection";
import WhatWeOffer from "@/components/WhatWeOffer";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [revealContent, setRevealContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleVideoEnd = useCallback(() => {
    setShowOverlay(true);
    setRevealContent(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowOverlay(true);
        setRevealContent(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <Navbar />
      <VideoHero onVideoEnd={handleVideoEnd} showContent={showOverlay} />

      {/* Spacer for the fixed hero */}
      <div className="h-screen" />

      {/* Main content */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealContent ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <SectionReveal><AboutSection /></SectionReveal>
        <SectionReveal delay={0.1}><WhatWeOffer /></SectionReveal>
        <SectionReveal delay={0.1}><ContactSection /></SectionReveal>
        <FooterSection />
      </motion.div>
    </div>
  );
};

export default Index;
