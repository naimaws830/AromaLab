import { useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <footer className="py-20 px-6 bg-warm-black">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif-display text-3xl md:text-4xl text-cream mb-4">
            Stay in the <span className="italic text-gradient-amber">Story</span>
          </h2>
          <p className="font-serif-body text-cream/50 mb-10 max-w-md mx-auto">
            Be the first to discover new scents, exclusive collections, and stories from our atelier.
          </p>

          {submitted ? (
            <p className="font-sans-refined text-sm tracking-widest uppercase text-amber-glow">
              Welcome to the journey ✦
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-transparent border-b border-cream/20 text-cream font-sans-refined text-sm py-3 outline-none focus:border-amber-glow transition-colors placeholder:text-cream/30"
              />
              <button
                type="submit"
                className="px-8 py-3 border border-cream/30 text-cream font-sans-refined text-xs tracking-[0.2em] uppercase hover:bg-cream/10 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>

        <div className="mt-16 pt-8 border-t border-cream/10">
          <p className="font-sans-refined text-xs text-cream/30 tracking-widest uppercase">
            © 2026 AromaLab — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
