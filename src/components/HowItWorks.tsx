import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Craft",
    description: "Choose your mood, notes, and bottle to begin shaping your unique fragrance.",
  },
  {
    number: "02",
    title: "Create",
    description: "Our master perfumers blend your selections into a one‑of‑a‑kind scent.",
  },
  {
    number: "03",
    title: "Carry",
    description: "Receive your bespoke perfume, beautifully packaged and ready to wear.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-sans-refined text-xs tracking-[0.35em] uppercase text-muted-foreground mb-4">
            The Process
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-medium text-foreground">
            How It <span className="italic text-primary">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <span className="font-serif-display text-6xl font-light text-gradient-amber">
                {step.number}
              </span>
              <h3 className="font-serif-display text-2xl text-foreground mt-4 mb-3">
                {step.title}
              </h3>
              <p className="font-serif-body text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
