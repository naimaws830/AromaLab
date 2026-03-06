import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    id: "mood",
    title: "Choose Your Mood",
    options: ["Bold & Daring", "Soft & Romantic", "Fresh & Free", "Warm & Cozy", "Dark & Mysterious"],
  },
  {
    id: "notes",
    title: "Pick Your Notes",
    options: ["Rose & Jasmine", "Cedar & Oud", "Bergamot & Citrus", "Vanilla & Amber", "Musk & Sandalwood"],
  },
  {
    id: "bottle",
    title: "Select Your Bottle",
    options: ["Classic Noir", "Crystal Clear", "Frosted Gold", "Matte Blush", "Emerald Luxe"],
  },
  {
    id: "name",
    title: "Name Your Scent",
    isInput: true,
  },
];

const CustomizeSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [scentName, setScentName] = useState("");

  const step = steps[currentStep];

  const handleSelect = (option: string) => {
    setSelections((prev) => ({ ...prev, [step.id]: option }));
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    }
  };

  const isComplete = currentStep === steps.length - 1 && scentName.length > 0;

  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-warm">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-sans-refined text-xs tracking-[0.35em] uppercase text-cream/50 mb-4">
            The Atelier
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-medium text-cream">
            Customize Your <span className="italic text-gradient-amber">Perfume</span>
          </h2>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i <= currentStep && setCurrentStep(i)}
              className={`w-10 h-1 rounded-full transition-all duration-500 ${
                i === currentStep
                  ? "bg-amber-glow w-16"
                  : i < currentStep
                  ? "bg-cream/40"
                  : "bg-cream/15"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h3 className="font-serif-display text-2xl text-cream mb-8">
              {step.title}
            </h3>

            {step.isInput ? (
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={scentName}
                  onChange={(e) => setScentName(e.target.value)}
                  placeholder="e.g. Midnight Velvet"
                  className="w-full bg-transparent border-b border-cream/30 text-cream text-center text-2xl font-serif-display py-4 outline-none focus:border-amber-glow transition-colors placeholder:text-cream/20"
                />
                {isComplete && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 px-10 py-4 bg-accent text-accent-foreground font-sans-refined text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                  >
                    Complete Your Creation
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {step.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`px-6 py-4 border rounded-sm font-sans-refined text-sm tracking-wide transition-all duration-300 ${
                      selections[step.id] === option
                        ? "border-amber-glow bg-amber-glow/10 text-cream"
                        : "border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CustomizeSection;
