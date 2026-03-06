import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Our Perfumes", href: "#perfumes" },
  { label: "Digital Scent Lab", href: "#scent-lab" },
  { label: "What We Offer", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm-black/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-serif-display text-xl md:text-2xl text-cream tracking-wide">
            Aroma<span className="text-gradient-amber">Lab</span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans-refined text-xs tracking-[0.15em] uppercase text-cream/70 hover:text-cream transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden sm:inline-block px-6 py-2.5 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-accent/90 transition-all duration-300"
            >
              Book Now
            </a>

            {/* Hamburger button – visible on mobile/tablet */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-cream p-1"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-72 bg-warm-black/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-serif-display text-lg text-cream">
            Aroma<span className="text-gradient-amber">Lab</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-cream/70 hover:text-cream"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-6 mt-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="font-sans-refined text-sm tracking-[0.12em] uppercase text-cream/70 hover:text-cream py-3 border-b border-cream/10 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setDrawerOpen(false)}
            className="mt-6 text-center px-6 py-3 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-accent/90 transition-all duration-300"
          >
            Book Now
          </a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
