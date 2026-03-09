import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import blossomVeil from "@/assets/perfume-blossom-veil.png";
import forestWhisper from "@/assets/perfume-forest-whisper.png";
import mysticEmber from "@/assets/perfume-mystic-ember.png";
import sunlitZest from "@/assets/perfume-sunlit-zest.png";
import caramelDrift from "@/assets/perfume-caramel-drift.png";

const catalogItems = [
  {
    name: "Blossom Veil",
    image: blossomVeil,
    rating: 4.9,
    sold: "1.8k",
    originalPrice: 199,
    impressionPrice: 139,
    plusNotePrice: 159,
    discount: 30,
    tag: "Best Seller",
    freeShipping: true,
    availableNotes: ["Pink Pepper", "Jasmine", "Vanilla", "White Musk"],
  },
  {
    name: "Forest Whisper",
    image: forestWhisper,
    rating: 4.8,
    sold: "980",
    originalPrice: 219,
    impressionPrice: 159,
    plusNotePrice: 179,
    discount: 27,
    tag: "Mall",
    freeShipping: true,
    availableNotes: ["Cedarwood", "Vetiver", "Bergamot", "Sandalwood"],
  },
  {
    name: "Mystic Ember",
    image: mysticEmber,
    rating: 4.9,
    sold: "2.1k",
    originalPrice: 239,
    impressionPrice: 179,
    plusNotePrice: 199,
    discount: 25,
    tag: "Flash Sale",
    freeShipping: false,
    availableNotes: ["Oud", "Saffron", "Black Pepper", "Tonka Bean"],
  },
  {
    name: "Sunlit Zest",
    image: sunlitZest,
    rating: 4.7,
    sold: "760",
    originalPrice: 189,
    impressionPrice: 129,
    plusNotePrice: 149,
    discount: 32,
    tag: "Just In",
    freeShipping: true,
    availableNotes: ["Neroli", "Lime Zest", "Green Tea", "Citrus Peel"],
  },
  {
    name: "Caramel Drift",
    image: caramelDrift,
    rating: 4.8,
    sold: "1.2k",
    originalPrice: 229,
    impressionPrice: 169,
    plusNotePrice: 189,
    discount: 26,
    tag: "Top Rated",
    freeShipping: false,
    availableNotes: ["Caramel", "Honey", "Cocoa", "Amber"],
  },
  {
    name: "Blossom Veil Signature",
    image: blossomVeil,
    rating: 4.9,
    sold: "640",
    originalPrice: 329,
    impressionPrice: 259,
    plusNotePrice: 279,
    discount: 21,
    tag: "Value Pack",
    freeShipping: true,
    availableNotes: ["Rose", "Peony", "Iris", "Cashmere Musk"],
  },
  {
    name: "Mystic Ember Discovery",
    image: mysticEmber,
    rating: 4.8,
    sold: "420",
    originalPrice: 109,
    impressionPrice: 79,
    plusNotePrice: 99,
    discount: 28,
    tag: "Bundle",
    freeShipping: true,
    availableNotes: ["Leather", "Dark Vanilla", "Plum", "Incense"],
  },
  {
    name: "Forest Whisper Gift Box",
    image: forestWhisper,
    rating: 4.8,
    sold: "350",
    originalPrice: 259,
    impressionPrice: 199,
    plusNotePrice: 219,
    discount: 23,
    tag: "Limited",
    freeShipping: false,
    availableNotes: ["Oakmoss", "Patchouli", "Tobacco Leaf", "Amberwood"],
  },
];

const sortOptions = ["Popular", "Latest", "Top Sales", "Price"];
type PurchaseType = "impression" | "impression_plus_1_note";

type CardSelection = {
  purchaseType: PurchaseType;
  selectedNote: string | null;
};
const heroSlides = [
  {
    title: "Blossom Veil",
    subtitle: "Romantic floral with airy musk and powdery iris",
    image: blossomVeil,
    promo: "Up to 30% OFF",
  },
  {
    title: "Forest Whisper",
    subtitle: "Earthy cedarwood and resin blend for deeper moods",
    image: forestWhisper,
    promo: "Limited Bundle",
  },
  {
    title: "Mystic Ember",
    subtitle: "Bold oud, saffron smoke, and dark vanilla trail",
    image: mysticEmber,
    promo: "Flash Sale Today",
  },
  {
    title: "Sunlit Zest",
    subtitle: "Bright citrus profile for fresh daytime wear",
    image: sunlitZest,
    promo: "Free Shipping",
  },
];

const PerfumeGrid = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardSelections, setCardSelections] = useState<Record<number, CardSelection>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const goPrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const getCardSelection = (index: number): CardSelection =>
    cardSelections[index] ?? { purchaseType: "impression", selectedNote: null };

  const updatePurchaseType = (index: number, purchaseType: PurchaseType) => {
    setCardSelections((prev) => ({
      ...prev,
      [index]: {
        purchaseType,
        selectedNote:
          purchaseType === "impression" ? null : (prev[index]?.selectedNote ?? null),
      },
    }));
  };

  const updateSelectedNote = (index: number, selectedNote: string) => {
    setCardSelections((prev) => ({
      ...prev,
      [index]: {
        purchaseType: "impression_plus_1_note",
        selectedNote: selectedNote || null,
      },
    }));
  };

  const handleAdd = (item: (typeof catalogItems)[number], index: number) => {
    const selection = getCardSelection(index);
    const isPlusNote = selection.purchaseType === "impression_plus_1_note";
    const unitPrice = isPlusNote ? item.plusNotePrice : item.impressionPrice;

    const payload = {
      productName: item.name,
      purchaseType: selection.purchaseType,
      selectedNote: isPlusNote ? selection.selectedNote : null,
      unitPrice,
    };

    // Placeholder until cart integration is added.
    console.log("Add to cart payload:", payload);

    // Reset predictably after add.
    setCardSelections((prev) => ({
      ...prev,
      [index]: { purchaseType: "impression", selectedNote: null },
    }));
  };

  return (
    <section id="perfumes" className="py-16 md:py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-card mb-6">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0.3, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="relative h-[300px] sm:h-[360px] md:h-[420px]"
          >
            <img
              src={heroSlides[activeSlide].image}
              alt={heroSlides[activeSlide].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
            <div className="absolute left-5 right-5 bottom-6 sm:left-8 sm:right-8 text-white">
              <p className="inline-block rounded bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">
                {heroSlides[activeSlide].promo}
              </p>
              <h2 className="font-serif-display mt-3 text-3xl sm:text-4xl">{heroSlides[activeSlide].title}</h2>
              <p className="font-sans-refined mt-1 text-sm sm:text-base text-white/90 max-w-xl">
                {heroSlides[activeSlide].subtitle}
              </p>
            </div>
          </motion.div>

          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/45 text-white hover:bg-black/60 flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/45 text-white hover:bg-black/60 flex items-center justify-center"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to ${slide.title}`}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index ? "w-6 bg-white" : "w-2 bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-5 sm:px-6"
        >
          <p className="font-sans-refined text-xs tracking-[0.18em] uppercase opacity-90">
            AromaLab Perfume Collection
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl mt-2">
            Perfume Catalogue
          </h2>
          <p className="font-sans-refined text-sm sm:text-base opacity-90 mt-2">
            Choose your preset impression, or upgrade it with one extra note.
          </p>
        </motion.div>

        <div className="mt-6 rounded-xl border border-primary/20 bg-card p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Sort by</span>
            {sortOptions.map((option, index) => (
              <button
                key={option}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-primary/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {catalogItems.map((item, index) => (
            (() => {
              const selection = getCardSelection(index);
              const isPlusNote = selection.purchaseType === "impression_plus_1_note";
              const selectedPrice = isPlusNote ? item.plusNotePrice : item.impressionPrice;
              const addDisabled = isPlusNote && !selection.selectedNote;

              return (
                <motion.article
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group rounded-lg border border-border bg-card overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-250"
                >
                  <div className="relative bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                      {item.tag}
                    </span>
                    <span className="absolute right-0 top-0 bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground">
                      -{item.discount}%
                    </span>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-medium leading-5 min-h-[2.5rem]">{item.name}</h3>

                    <div className="mt-2 rounded-md bg-background border border-border p-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => updatePurchaseType(index, "impression")}
                        className={`flex-1 rounded px-2 py-1.5 text-[11px] font-medium transition-colors ${
                          selection.purchaseType === "impression"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-primary/10"
                        }`}
                      >
                        Impression
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePurchaseType(index, "impression_plus_1_note")}
                        className={`flex-1 rounded px-2 py-1.5 text-[11px] font-medium transition-colors ${
                          selection.purchaseType === "impression_plus_1_note"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-primary/10"
                        }`}
                      >
                        + 1 Note
                      </button>
                    </div>

                    {isPlusNote && (
                      <div className="mt-2">
                        <label
                          htmlFor={`note-select-${index}`}
                          className="block text-[11px] text-muted-foreground mb-1"
                        >
                          Select your extra note
                        </label>
                        <select
                          id={`note-select-${index}`}
                          value={selection.selectedNote ?? ""}
                          onChange={(e) => updateSelectedNote(index, e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Choose one note</option>
                          {item.availableNotes.map((note) => (
                            <option key={note} value={note}>
                              {note}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="mt-2">
                      <span className="text-primary font-semibold text-lg">RM {selectedPrice}</span>
                    </div>

                    <div className="mt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Impression</span>
                        <span className="text-foreground">RM {item.impressionPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Impression + 1 Note</span>
                        <span className="text-foreground">RM {item.plusNotePrice}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        RRP <span className="line-through">RM {item.originalPrice}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                      <span>{item.sold} sold</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-sm ${
                          item.freeShipping
                            ? "bg-green-100 text-green-700"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {item.freeShipping ? "Free Shipping" : "Standard Delivery"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdd(item, index)}
                        disabled={addDisabled}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] ${
                          addDisabled
                            ? "bg-primary/40 text-primary-foreground/70 cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerfumeGrid;
