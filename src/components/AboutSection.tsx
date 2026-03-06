import { motion } from "framer-motion";

const team = [
  { name: "Name 1", role: "Founder" },
  { name: "Name 2", role: "Founder" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — Brand Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif-display text-4xl md:text-5xl text-foreground mb-8">
              About <span className="text-gradient-amber">AromaLab</span>
            </h2>

            <div className="space-y-5 font-serif-body text-xl md:text-2xl leading-relaxed text-muted-foreground">
              <p>
                AromaLab was born from a lifelong passion for the art of scent
                and a simple belief: every person deserves a fragrance as unique
                as their identity. What started as a small atelier experiment
                grew into a studio where science meets soul, and every bottle
                tells a personal story.
              </p>
              <p>
                Our mission is to make luxury custom perfume crafting accessible,
                personal, and meaningful. We guide you through the creative
                process — from selecting individual notes to designing the final
                bottle — so the fragrance you wear is truly yours.
              </p>
              <p>
                We are committed to using only natural, handpicked ingredients
                sourced from ethical suppliers around the world, blended by
                skilled artisans who treat every drop as a work of art.
              </p>
            </div>
          </motion.div>

          {/* Right — Team */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center gap-10 flex-wrap"
          >
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center mb-4 overflow-hidden">
                  <span className="font-serif-display text-3xl text-primary/50">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <span className="font-serif-display text-base text-foreground">
                  {member.name}
                </span>
                <span className="font-sans-refined text-xs tracking-[0.12em] uppercase text-muted-foreground mt-1">
                  {member.role}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
