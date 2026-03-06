import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { scentFamilies, generateBlendName, generateBlendDescription } from "@/data/fragranceData";

interface Selection {
  family: string;
  notes: string[];
}

interface BlendSummaryProps {
  selections: Selection[];
  onRestart: () => void;
  onBlend: () => void;
}

const BlendSummary = ({ selections, onRestart, onBlend }: BlendSummaryProps) => {
  const validSelections = selections.filter((s) => s.notes.length > 0);
  const familyNames = validSelections.map((s) => s.family);
  const blendName = generateBlendName(familyNames);
  const description = generateBlendDescription(validSelections);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-8 md:p-10 rounded-sm bg-cream/[0.03]">
        {/* Selected notes by family */}
        <div className="space-y-5 mb-8">
          {validSelections.map((sel) => {
            const fam = scentFamilies.find((f) => f.name === sel.family);
            if (!fam) return null;
            return (
              <div key={sel.family}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: `hsl(${fam.color})`,
                      boxShadow: `0 0 8px hsl(${fam.color} / 0.5)`,
                    }}
                  />
                  <h4 className="font-sans-refined text-xs tracking-[0.2em] uppercase text-cream/70 font-medium">
                    {sel.family}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sel.notes.map((noteName) => {
                    const note = fam.notes.find((n) => n.name === noteName);
                    return (
                      <span
                        key={noteName}
                        className="inline-flex flex-col px-3 py-2 border border-cream/10 bg-cream/[0.04] rounded-sm"
                      >
                        <span className="font-sans-refined text-sm text-cream/90 font-medium">{noteName}</span>
                        {note && (
                          <span className="font-sans-refined text-[9px] text-cream/40">{note.description}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div className="border-t border-cream/10 pt-6">
          <p className="font-serif-body text-lg md:text-xl text-cream/70 leading-relaxed italic">
            "{description}"
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 border border-cream/20 text-cream/60 font-sans-refined text-xs tracking-[0.15em] uppercase hover:border-cream/40 hover:text-cream transition-all"
        >
          <RotateCcw size={14} /> Cancel
        </button>
        <button
          onClick={onBlend}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase hover:bg-accent/90 transition-all"
        >
          <Sparkles size={14} /> Blend
        </button>
      </div>
    </motion.div>
  );
};

export default BlendSummary;
