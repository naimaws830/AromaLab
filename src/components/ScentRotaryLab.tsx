import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FragranceWheel from "@/components/scent-lab/FragranceWheel";
import NoteCardPanel from "@/components/scent-lab/NoteCardPanel";
import BlendSummary from "@/components/scent-lab/BlendSummary";
import { scentFamilies, getFamilyByName } from "@/data/fragranceData";
import { toast } from "sonner";

type Step = "select-1" | "notes-1" | "select-2" | "notes-2" | "select-3" | "notes-3" | "summary";

interface Selection {
  family: string;
  notes: string[];
}

const ScentRotaryLab = () => {
  const [step, setStep] = useState<Step>("select-1");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Animation variants for wheel sliding
  const wheelVariants = {
    centered: { x: 0 },
    left: { x: -100 }
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 }
  };

  // Three family selections
  const [family1, setFamily1] = useState<string | null>(null);
  const [family2, setFamily2] = useState<string | null>(null);
  const [family3, setFamily3] = useState<string | null>(null);

  // Notes for each family
  const [notes1, setNotes1] = useState<string[]>([]);
  const [notes2, setNotes2] = useState<string[]>([]);
  const [notes3, setNotes3] = useState<string[]>([]);

  const reset = useCallback(() => {
    setStep("select-1");
    setHoveredIndex(null);
    setFamily1(null);
    setFamily2(null);
    setFamily3(null);
    setNotes1([]);
    setNotes2([]);
    setNotes3([]);
  }, []);

  // Compute complementary indices based on first confirmed family
  const complementaryNames = useMemo(() => {
    if (!family1) return [];
    const fam = getFamilyByName(family1);
    return fam ? fam.complementary : [];
  }, [family1]);

  const complementaryIndices = useMemo(
    () => complementaryNames.map((n) => scentFamilies.findIndex((f) => f.name === n)).filter((i) => i >= 0),
    [complementaryNames]
  );

  const confirmedIndices = useMemo(() => {
    const names = [family1, family2, family3].filter(Boolean) as string[];
    return names.map((n) => scentFamilies.findIndex((f) => f.name === n)).filter((i) => i >= 0);
  }, [family1, family2, family3]);

  const triangleIndices = useMemo(() => {
    if (!family1) return [];
    const primary = scentFamilies.findIndex((f) => f.name === family1);
    return [primary, ...complementaryIndices];
  }, [family1, complementaryIndices]);

  // Determine which indices to highlight (complementary that aren't confirmed yet)
  const highlightedIndices = useMemo(() => {
    if (step === "select-1" || !family1) return [];
    return complementaryIndices.filter((i) => !confirmedIndices.includes(i));
  }, [step, family1, complementaryIndices, confirmedIndices]);

  const isWheelDisabled = step.startsWith("notes") || step === "summary";

  // Handlers
  const handleRotate = useCallback((idx: number) => {
    setHoveredIndex(idx);
  }, []);

  const handleConfirmFamily = useCallback(() => {
    if (hoveredIndex === null) return;
    const famName = scentFamilies[hoveredIndex].name;

    if (step === "select-1") {
      setFamily1(famName);
      setStep("notes-1");
    } else if (step === "select-2") {
      // Must be one of the complementary families
      if (!complementaryNames.includes(famName)) {
        toast.error("Please select one of the highlighted complementary families.");
        return;
      }
      setFamily2(famName);
      setStep("notes-2");
    } else if (step === "select-3") {
      const remaining = complementaryNames.filter((n) => n !== family2);
      if (remaining.length > 0 && !remaining.includes(famName)) {
        toast.error("Please select the remaining complementary family.");
        return;
      }
      setFamily3(famName);
      setStep("notes-3");
    }
  }, [hoveredIndex, step, complementaryNames, family2]);

  const toggleNote = useCallback(
    (note: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
      setter((prev) => (prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]));
    },
    []
  );

  // Build selections for summary
  const allSelections: Selection[] = useMemo(
    () =>
      [
        family1 ? { family: family1, notes: notes1 } : null,
        family2 ? { family: family2, notes: notes2 } : null,
        family3 ? { family: family3, notes: notes3 } : null,
      ].filter(Boolean) as Selection[],
    [family1, family2, family3, notes1, notes2, notes3]
  );

  // Current active family for the note panel
  const currentFamily = useMemo(() => {
    if (step === "notes-1" && family1) return getFamilyByName(family1);
    if (step === "notes-2" && family2) return getFamilyByName(family2);
    if (step === "notes-3" && family3) return getFamilyByName(family3);
    return undefined;
  }, [step, family1, family2, family3]);

  return (
    <section id="scent-lab" className="py-16 md:py-20 px-4 md:px-6 bg-gradient-warm relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-glow/[0.04] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-0 md:mb-0"
        >
          <p className="font-sans-refined text-xs tracking-[0.35em] uppercase text-cream/50 mb-4">
            Digital Scent Lab
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-medium text-cream">
            Craft Your <span className="text-[hsl(38,80%,55%)]">Own Fragrance</span>
          </h2>
        </motion.div>

        <motion.div
          key="builder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${
            family1 ? "flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start" : "flex justify-center"
          }`}
        >
          {/* Wheel container */}
          <div
            className={`flex flex-col items-center transition-all duration-500 ease-in-out lg:mt-8 mt-4`}
          >
            <motion.div
              className="flex flex-col items-center gap-8"
              layout
              variants={wheelVariants}
              animate={family1 ? "centered" : "centered"}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <FragranceWheel
                selectedIndex={hoveredIndex}
                highlightedIndices={highlightedIndices}
                confirmedIndices={confirmedIndices}
                triangleIndices={triangleIndices}
                onRotate={handleRotate}
                onConfirm={handleConfirmFamily}
                disabled={isWheelDisabled}
                showConfirmButton={step === "select-1"}
                autoConfirmOnClick={step === "select-2" || step === "select-3"}
                dimKnob={!!family1}
              />
          </motion.div>
          </div>

          {/* Right: Note Panel / Summary - only show after first confirmation */}
          {family1 && (
            <motion.div 
              // Align notes panel with wheel positioning on all screen sizes
              className="lg:sticky lg:top-32 lg:self-start min-h-[300px] lg:order-2 mt-8"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
            >
            <AnimatePresence mode="wait">
              {step === "notes-1" && currentFamily && (
                <NoteCardPanel
                  key="notes-1"
                  family={currentFamily}
                  selectedNotes={notes1}
                  onToggleNote={(n) => toggleNote(n, setNotes1)}
                  step={1}
                  onCancel={reset}
                  onNext={() => {
                    // Auto-select first complementary family when clicking next
                    if (complementaryIndices.length > 0) {
                      const firstCompIndex = complementaryIndices[0];
                      const firstCompName = scentFamilies[firstCompIndex].name;
                      setFamily2(firstCompName);
                      setStep("notes-2");
                    } else {
                      setStep("select-2");
                      if (complementaryIndices.length > 0) {
                        setHoveredIndex(complementaryIndices[0]);
                      }
                    }
                  }}
                  nextLabel="Next"
                />
              )}

              {step === "notes-2" && currentFamily && (
                <NoteCardPanel
                  key="notes-2"
                  family={currentFamily}
                  selectedNotes={notes2}
                  onToggleNote={(n) => toggleNote(n, setNotes2)}
                  step={2}
                  onCancel={reset}
                  onNext={() => {
                    // Auto-select remaining complementary family when clicking next
                    const remaining = complementaryIndices.find(
                      (i) => scentFamilies[i].name !== family2
                    );
                    if (remaining !== undefined) {
                      const remainingName = scentFamilies[remaining].name;
                      setFamily3(remainingName);
                      setStep("notes-3");
                    } else {
                      setStep("select-3");
                      if (remaining !== undefined) setHoveredIndex(remaining);
                    }
                  }}
                  nextLabel="Next"
                  showSkip
                  onSkip={() => {
                    // Auto-select remaining complementary family when skipping
                    const remaining = complementaryIndices.find(
                      (i) => scentFamilies[i].name !== family2
                    );
                    if (remaining !== undefined) {
                      const remainingName = scentFamilies[remaining].name;
                      setFamily3(remainingName);
                      setStep("notes-3");
                    } else {
                      setStep("select-3");
                      if (remaining !== undefined) setHoveredIndex(remaining);
                    }
                  }}
                />
              )}

              {step === "notes-3" && currentFamily && (
                <NoteCardPanel
                  key="notes-3"
                  family={currentFamily}
                  selectedNotes={notes3}
                  onToggleNote={(n) => toggleNote(n, setNotes3)}
                  step={3}
                  onCancel={reset}
                  onNext={() => setStep("summary")}
                  nextLabel="Finish"
                  showSkip
                  onSkip={() => setStep("summary")}
                />
              )}

              {step === "summary" && (
                <div className="mt-8">
                  <BlendSummary
                    key="summary"
                    selections={allSelections}
                    onRestart={reset}
                    onBlend={() => {
                      toast.success("Your fragrance blend has been created!");
                      reset();
                    }}
                  />
                </div>
              )}
            </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ScentRotaryLab;
