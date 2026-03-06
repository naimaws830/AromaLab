import { motion } from "framer-motion";
import { Pipette, MessageCircle, Gift, Gem } from "lucide-react";

const services = [
  {
    icon: Pipette,
    title: "Custom Blending Service",
    description:
      "We hand-craft a unique perfume blended specifically to your chosen notes and preferences.",
  },
  {
    icon: MessageCircle,
    title: "Perfume Consultation",
    description:
      "A one-on-one session with our scent experts to help you discover your perfect fragrance identity.",
  },
  {
    icon: Gift,
    title: "Gift Packaging",
    description:
      "Beautifully curated gift wrapping and personalized message cards for your custom perfume orders.",
  },
  {
    icon: Gem,
    title: "Custom Bottle Perfume",
    description:
      "Design your own bottle shape, label, and cap to create a truly one-of-a-kind perfume keepsake.",
  },
];

const WhatWeOffer = () => {
  return (
    <section id="services" className="py-24 md:py-32 px-6 bg-gradient-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-sans-refined text-xs tracking-[0.35em] uppercase text-muted-foreground mb-4">
            Our Services
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl font-medium text-foreground">
            What We <span className="italic text-primary">Offer</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="p-8 rounded-lg border-glow bg-card text-center hover:glow-amber transition-all duration-500"
            >
              <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent/10">
                <service.icon className="text-accent" size={26} />
              </div>
              <h3 className="font-serif-display text-xl font-medium text-foreground mb-3">
                {service.title}
              </h3>
              <p className="font-serif-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
