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
              Our Story of <span className="text-gradient-amber">AromaLab</span>
            </h2>

            <div className="space-y-5 font-serif-body text-xl md:text-2xl leading-relaxed text-muted-foreground">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <p>                
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt.</p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto.
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
