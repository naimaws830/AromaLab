import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ScentFamily } from "@/data/fragranceData";

interface NoteCardPanelProps {
  family: ScentFamily;
  selectedNotes: string[];
  onToggleNote: (note: string) => void;
  step: number; // 1, 2, or 3
  onCancel: () => void;
  onNext: () => void;
  nextLabel: string;  // "Next", "Continue", or "Finish"
  showSkip?: boolean;
  onSkip?: () => void;
}

const CARDS_PER_PAGE = 25;

const NoteCardPanel = ({
  family,
  selectedNotes,
  onToggleNote,
  step,
  onCancel,
  onNext,
  nextLabel,
  showSkip,
  onSkip,
}: NoteCardPanelProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(family.notes.length / CARDS_PER_PAGE);
  const pageNotes = family.notes.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: `hsl(${family.color})`,
            boxShadow: `0 0 12px hsl(${family.color} / 0.6)`,
          }}
        />
        <div>
          <h3 className="font-serif-display text-2xl md:text-3xl text-cream">
            {family.name}
          </h3>
          <p className="font-sans-refined text-[10px] tracking-[0.25em] uppercase text-cream/40">
            Step {step} of 3 — Select your notes
          </p>
        </div>
      </div>

      {/* Note Cards Grid — 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {pageNotes.map((note) => {
          const isSelected = selectedNotes.includes(note.name);
          return (
            <motion.button
              key={note.name}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggleNote(note.name)}
              className={`relative p-3 rounded-sm border text-left transition-all duration-300 ${
                isSelected
                  ? "border-[hsl(38,80%,55%)] bg-[hsl(38,80%,55%/0.15)] shadow-[0_0_16px_hsl(38,80%,55%/0.2)]"
                  : "border-cream/10 bg-cream/[0.04] hover:border-cream/25 hover:bg-cream/[0.08]"
              }`}
            >
              <p
                className={`font-sans-refined text-sm font-medium leading-tight ${
                  isSelected ? "text-[hsl(45,100%,70%)]" : "text-cream/90"
                }`}
              >
                {note.name}
              </p>
              <p className="font-sans-refined text-[10px] text-cream/40 mt-1 leading-snug">
                {note.description}
              </p>
              {isSelected && (
                <motion.div
                  layoutId={`check-${note.name}`}
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(38,80%,55%)]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1.5 text-cream/50 hover:text-cream disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-sans-refined text-xs text-cream/40">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 text-cream/50 hover:text-cream disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-cream/10">
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-cream/20 text-cream/60 font-sans-refined text-xs tracking-[0.15em] uppercase hover:border-cream/40 hover:text-cream transition-all"
        >
          Cancel
        </button>
        {showSkip && onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-3 border border-cream/20 text-cream/60 font-sans-refined text-xs tracking-[0.15em] uppercase hover:border-cream/40 hover:text-cream transition-all"
          >
            Skip
          </button>
        )}
        <button
          onClick={onNext}
          disabled={selectedNotes.length === 0 && !showSkip}
          className="flex-1 px-6 py-3 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase hover:bg-accent/90 disabled:opacity-30 transition-all"
        >
          {nextLabel} {selectedNotes.length > 0 && `(${selectedNotes.length})`}
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCardPanel;
