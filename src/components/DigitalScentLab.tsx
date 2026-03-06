import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, RotateCcw, Save } from "lucide-react";

type Dimension = "Citrus" | "Floral" | "Woody" | "Musky" | "Sweet" | "Spicy";

type IngredientProfile = Partial<Record<Dimension, number>>;

interface Ingredient {
  name: string;
  profile: IngredientProfile;
}

interface Category {
  title: string;
  subtitle: string;
  ingredients: Ingredient[];
}

const categories: Category[] = [
  {
    title: "Top Notes",
    subtitle: "Light and volatile",
    ingredients: [
      { name: "Bergamot", profile: { Citrus: 3 } },
      { name: "Lemon", profile: { Citrus: 3 } },
      { name: "Mandarin", profile: { Citrus: 2, Sweet: 1 } },
      { name: "Green Apple", profile: { Citrus: 1, Sweet: 1 } },
    ],
  },
  {
    title: "Heart Notes",
    subtitle: "Soul of the fragrance",
    ingredients: [
      { name: "Rose", profile: { Floral: 3, Sweet: 1 } },
      { name: "Jasmine", profile: { Floral: 3, Musky: 1 } },
      { name: "Lavender", profile: { Floral: 2, Spicy: 1 } },
      { name: "Peony", profile: { Floral: 2, Sweet: 1 } },
    ],
  },
  {
    title: "Base Notes",
    subtitle: "Long-lasting depth and warmth",
    ingredients: [
      { name: "Musk", profile: { Musky: 3, Woody: 1 } },
      { name: "Vanilla", profile: { Sweet: 3, Musky: 1 } },
      { name: "Sandalwood", profile: { Woody: 3, Musky: 1 } },
      { name: "Oud", profile: { Woody: 2, Spicy: 2, Musky: 1 } },
      { name: "Patchouli", profile: { Woody: 2, Spicy: 1, Musky: 1 } },
    ],
  },
];

const dimensions: Dimension[] = ["Citrus", "Floral", "Woody", "Musky", "Sweet", "Spicy"];

const personalities: Record<string, { name: string; desc: string }> = {
  "Citrus-Floral": { name: "Playful & Bright", desc: "A sparkling garden of citrus and blooms" },
  "Floral-Citrus": { name: "Playful & Bright", desc: "A sparkling garden of citrus and blooms" },
  "Woody-Musky": { name: "Mysterious & Grounded", desc: "Deep earthy warmth with a lingering shadow" },
  "Musky-Woody": { name: "Mysterious & Grounded", desc: "Deep earthy warmth with a lingering shadow" },
  "Sweet-Floral": { name: "Romantic & Tender", desc: "Soft blooms wrapped in warm sweetness" },
  "Floral-Sweet": { name: "Romantic & Tender", desc: "Soft blooms wrapped in warm sweetness" },
  "Spicy-Woody": { name: "Bold & Fierce", desc: "Smoky depth with an untamed edge" },
  "Woody-Spicy": { name: "Bold & Fierce", desc: "Smoky depth with an untamed edge" },
  "Musky-Sweet": { name: "Sensual & Warm", desc: "A soft skin scent that feels like a warm embrace" },
  "Sweet-Musky": { name: "Sensual & Warm", desc: "A soft skin scent that feels like a warm embrace" },
  "Citrus-Spicy": { name: "Fresh & Daring", desc: "A bright burst with an unexpected kick" },
  "Spicy-Citrus": { name: "Fresh & Daring", desc: "A bright burst with an unexpected kick" },
};

const RadarChart = ({ values }: { values: Record<Dimension, number> }) => {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const maxVal = Math.max(...Object.values(values), 1);
  const levels = 4;

  const getPoint = (index: number, value: number, max: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (value / max) * (size * 0.38);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, l) => {
    const frac = (l + 1) / levels;
    return dimensions
      .map((_, i) => {
        const p = getPoint(i, frac * maxVal, maxVal);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  });

  const dataPoints = dimensions.map((d, i) => getPoint(i, values[d], maxVal));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="hsl(var(--amber-glow) / 0.15)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {dimensions.map((_, i) => {
        const p = getPoint(i, maxVal, maxVal);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="hsl(var(--amber-glow) / 0.1)" strokeWidth="1" />
        );
      })}
      {/* Data polygon */}
      {Object.values(values).some((v) => v > 0) && (
        <polygon
          points={dataPolygon}
          fill="hsl(var(--amber-glow) / 0.25)"
          stroke="hsl(var(--amber-glow))"
          strokeWidth="2"
          className="transition-all duration-500"
        />
      )}
      {/* Labels */}
      {dimensions.map((d, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const lr = size * 0.46;
        const lx = cx + lr * Math.cos(angle);
        const ly = cy + lr * Math.sin(angle);
        return (
          <text
            key={d}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground font-sans-refined text-[10px] tracking-wider uppercase"
          >
            {d}
          </text>
        );
      })}
    </svg>
  );
};

const DigitalScentLab = () => {
  const [drops, setDrops] = useState<Record<string, number>>({});

  const values = useMemo(() => {
    const vals: Record<Dimension, number> = { Citrus: 0, Floral: 0, Woody: 0, Musky: 0, Sweet: 0, Spicy: 0 };
    for (const cat of categories) {
      for (const ing of cat.ingredients) {
        const count = drops[ing.name] || 0;
        for (const [dim, weight] of Object.entries(ing.profile)) {
          vals[dim as Dimension] += weight * count;
        }
      }
    }
    return vals;
  }, [drops]);

  const personality = useMemo(() => {
    const sorted = dimensions.slice().sort((a, b) => values[b] - values[a]);
    if (values[sorted[0]] === 0) return null;
    const key = `${sorted[0]}-${sorted[1]}`;
    return personalities[key] || { name: "Unique & Bespoke", desc: "A signature scent that defies convention" };
  }, [values]);

  const addDrop = (name: string) => setDrops((p) => ({ ...p, [name]: (p[name] || 0) + 1 }));
  const removeDrop = (name: string) =>
    setDrops((p) => {
      const val = (p[name] || 0) - 1;
      if (val <= 0) {
        const { [name]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [name]: val };
    });
  const reset = () => setDrops({});
  const totalDrops = Object.values(drops).reduce((a, b) => a + b, 0);

  return (
    <section id="scent-lab" className="py-24 md:py-32 px-6 bg-gradient-warm">
      <div className="max-w-6xl mx-auto">
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
            Digital Scent <span className="italic text-gradient-amber">Lab</span>
          </h2>
          <p className="font-serif-body text-base text-cream/60 mt-4 max-w-lg mx-auto">
            Experiment with fragrance notes and watch your scent profile come to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Ingredients */}
          <div className="space-y-8">
            {categories.map((cat) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-serif-display text-xl text-cream mb-1">{cat.title}</h3>
                <p className="font-sans-refined text-xs text-cream/40 tracking-wide uppercase mb-4">
                  {cat.subtitle}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {cat.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="flex items-center justify-between px-4 py-3 rounded-sm border border-cream/15 bg-cream/5"
                    >
                      <span className="font-sans-refined text-sm text-cream/80">{ing.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeDrop(ing.name)}
                          disabled={!drops[ing.name]}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-cream/20 text-cream/50 hover:border-cream/50 hover:text-cream disabled:opacity-20 transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans-refined text-xs text-cream/70 w-4 text-center">
                          {drops[ing.name] || 0}
                        </span>
                        <button
                          onClick={() => addDrop(ing.name)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-amber-glow/40 text-amber-glow hover:bg-amber-glow/20 transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Radar chart + personality */}
          <div className="flex flex-col items-center justify-start gap-8 lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full p-8 rounded-sm border border-cream/15 bg-cream/5"
            >
              <h3 className="font-serif-display text-lg text-cream text-center mb-6">
                Your Scent Profile
              </h3>
              <RadarChart values={values} />
              <p className="text-center font-sans-refined text-xs text-cream/40 mt-4">
                {totalDrops} {totalDrops === 1 ? "drop" : "drops"} added
              </p>
            </motion.div>

            {/* Personality card */}
            {personality && (
              <motion.div
                key={personality.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full p-6 rounded-sm border border-amber-glow/20 bg-amber-glow/5 text-center"
              >
                <p className="font-sans-refined text-[10px] tracking-[0.3em] uppercase text-amber-glow mb-2">
                  Scent Personality
                </p>
                <h4 className="font-serif-display text-xl text-cream mb-1">{personality.name}</h4>
                <p className="font-serif-body text-sm text-cream/60 italic">{personality.desc}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 border border-cream/20 text-cream/70 font-sans-refined text-xs tracking-[0.15em] uppercase hover:border-cream/40 hover:text-cream transition-all"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                disabled={totalDrops === 0}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-cream font-sans-refined text-xs tracking-[0.15em] uppercase hover:bg-accent/90 disabled:opacity-40 transition-all"
              >
                <Save size={14} /> Save Blend
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalScentLab;
