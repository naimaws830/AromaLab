/* ─── Fragrance Wheel Data ─── */

export interface FragranceNote {
  name: string;
  description: string;
}

export interface ScentFamily {
  name: string;
  color: string;        // HSL values for the segment
  colorHex: string;     // hex for SVG
  group: "Floral" | "Oriental" | "Woody" | "Fresh";
  notes: FragranceNote[];
  complementary: [string, string]; // two recommended families
}

export const scentFamilies: ScentFamily[] = [
  {
    name: "Floral",
    color: "330 60% 55%",
    colorHex: "#d45a8a",
    group: "Floral",
    complementary: ["Woods", "Citrus"],
    notes: [
      { name: "Rose", description: "romantic, velvety, lush" },
      { name: "Jasmine", description: "heady, sweet, intoxicating" },
      { name: "Lily", description: "fresh, elegant, pure" },
      { name: "Peony", description: "soft, powdery, delicate" },
      { name: "Gardenia", description: "creamy, tropical, rich" },
      { name: "Magnolia", description: "lemony, silky, refined" },
      { name: "Iris", description: "powdery, earthy, noble" },
      { name: "Orchid", description: "exotic, sweet, alluring" },
      { name: "Tuberose", description: "buttery, narcotic, opulent" },
      { name: "Violet", description: "green, powdery, shy" },
      { name: "Carnation", description: "spicy, clove-like, warm" },
      { name: "Ylang Ylang", description: "tropical, custardy, sweet" },
      { name: "Neroli", description: "citrusy, floral, bright" },
      { name: "Freesia", description: "peppery, clean, light" },
      { name: "Lotus", description: "aquatic, serene, ethereal" },
    ],
  },
  {
    name: "Soft Floral",
    color: "340 50% 65%",
    colorHex: "#cc7a9e",
    group: "Floral",
    complementary: ["Dry Woods", "Water"],
    notes: [
      { name: "Muguet", description: "dewy, green, innocent" },
      { name: "Aldehydes", description: "waxy, fizzy, sparkling" },
      { name: "Powder", description: "soft, comforting, gentle" },
      { name: "Heliotrope", description: "almond, vanilla, cherry" },
      { name: "Lilac", description: "sweet, spring-like, fresh" },
      { name: "Wisteria", description: "airy, floral, romantic" },
      { name: "Musk Rose", description: "delicate, sheer, clean" },
      { name: "Peach Blossom", description: "fruity, soft, warm" },
      { name: "Mimosa", description: "honeyed, almond, fluffy" },
      { name: "Cotton", description: "clean, airy, cozy" },
      { name: "Rice Powder", description: "creamy, matte, subtle" },
      { name: "Mallow", description: "marshmallow, sweet, plush" },
    ],
  },
  {
    name: "Floral Oriental",
    color: "350 55% 50%",
    colorHex: "#c44a6e",
    group: "Floral",
    complementary: ["Aromatic", "Green"],
    notes: [
      { name: "Orange Blossom", description: "honeyed, waxy, bridal" },
      { name: "Osmanthus", description: "apricot, leathery, sweet" },
      { name: "Saffron", description: "metallic, warm, spicy" },
      { name: "Rose Absolute", description: "deep, jammy, honeyed" },
      { name: "Tuberose Night", description: "dark, heady, dense" },
      { name: "Champaca", description: "fruity, exotic, rich" },
      { name: "Frangipani", description: "tropical, creamy, exotic" },
      { name: "Night Jasmine", description: "green, narcotic, deep" },
      { name: "Lotus Root", description: "woody, aquatic, grounding" },
      { name: "Davana", description: "fruity, warm, herbal" },
      { name: "Cardamom Flower", description: "spicy, sweet, aromatic" },
      { name: "Marigold", description: "herbal, pungent, golden" },
    ],
  },
  {
    name: "Soft Oriental",
    color: "15 60% 48%",
    colorHex: "#c4603a",
    group: "Oriental",
    complementary: ["Citrus", "Mossy Woods"],
    notes: [
      { name: "Incense", description: "smoky, sacred, resinous" },
      { name: "Amber", description: "warm, golden, enveloping" },
      { name: "Copal", description: "citrusy, sweet, ancient" },
      { name: "Benzoin", description: "vanilla, balsamic, sweet" },
      { name: "Labdanum", description: "leathery, ambery, dark" },
      { name: "Myrrh", description: "smoky, earthy, medicinal" },
      { name: "Tolu Balsam", description: "cinnamon, vanilla, warm" },
      { name: "Elemi", description: "peppery, lemony, fresh" },
      { name: "Opoponax", description: "sweet myrrh, balsamic, warm" },
      { name: "Dragon's Blood", description: "sweet, spicy, resinous" },
      { name: "Mastic", description: "piney, clean, bright" },
      { name: "Coumarin", description: "hay-like, sweet, warm" },
    ],
  },
  {
    name: "Oriental",
    color: "8 55% 42%",
    colorHex: "#a63d32",
    group: "Oriental",
    complementary: ["Green", "Dry Woods"],
    notes: [
      { name: "Vanilla", description: "creamy, sweet, comforting" },
      { name: "Tonka Bean", description: "almond, caramel, warm" },
      { name: "Cinnamon", description: "spicy, warm, fiery" },
      { name: "Clove", description: "pungent, warm, woody" },
      { name: "Star Anise", description: "licorice, sweet, exotic" },
      { name: "Nutmeg", description: "warm, spicy, buttery" },
      { name: "Black Pepper", description: "sharp, hot, energizing" },
      { name: "Cardamom", description: "aromatic, sweet, cool" },
      { name: "Ginger", description: "zesty, warm, fresh" },
      { name: "Cocoa", description: "bitter, rich, indulgent" },
      { name: "Coffee", description: "roasted, bitter, energizing" },
      { name: "Praline", description: "nutty, caramel, sweet" },
      { name: "Rum", description: "boozy, sweet, dark" },
      { name: "Tobacco", description: "smoky, sweet, leathery" },
    ],
  },
  {
    name: "Woody Oriental",
    color: "20 45% 32%",
    colorHex: "#764a2e",
    group: "Oriental",
    complementary: ["Water", "Floral"],
    notes: [
      { name: "Sandalwood", description: "creamy, warm, velvety" },
      { name: "Oud", description: "smoky, animalic, complex" },
      { name: "Patchouli", description: "earthy, dark, musty" },
      { name: "Agarwood", description: "deep, resinous, sacred" },
      { name: "Guaiac Wood", description: "smoky, creamy, rosy" },
      { name: "Cashmeran", description: "musky, woody, clean" },
      { name: "Nagarmotha", description: "earthy, woody, dry" },
      { name: "Cypriol", description: "smoky, leathery, woody" },
      { name: "Atlas Cedar", description: "warm, pencil-like, dry" },
      { name: "Papyrus", description: "dry, woody, crisp" },
      { name: "Suede", description: "soft, velvety, animalic" },
      { name: "Leather", description: "smoky, rich, animalic" },
    ],
  },
  {
    name: "Woods",
    color: "30 35% 28%",
    colorHex: "#614a33",
    group: "Woody",
    complementary: ["Floral", "Citrus"],
    notes: [
      { name: "Cedarwood", description: "dry, pencil-sharp, warm" },
      { name: "Birch", description: "smoky, leathery, tarry" },
      { name: "Pine", description: "fresh, resinous, crisp" },
      { name: "Cypress", description: "green, woody, clean" },
      { name: "Ebony", description: "dark, dense, mysterious" },
      { name: "Teak", description: "rich, warm, exotic" },
      { name: "Driftwood", description: "salty, weathered, marine" },
      { name: "Mahogany", description: "rich, warm, polished" },
      { name: "Bamboo", description: "green, clean, light" },
      { name: "Oak", description: "tannic, strong, earthy" },
      { name: "Hinoki", description: "lemony, clean, zen" },
      { name: "Fir Balsam", description: "fresh, resinous, forest" },
    ],
  },
  {
    name: "Mossy Woods",
    color: "90 25% 32%",
    colorHex: "#576640",
    group: "Woody",
    complementary: ["Soft Oriental", "Fruity"],
    notes: [
      { name: "Oakmoss", description: "earthy, damp, forest" },
      { name: "Tree Moss", description: "green, woody, humid" },
      { name: "Vetiver", description: "earthy, smoky, rooty" },
      { name: "Patchouli Dark", description: "damp, chocolate, rich" },
      { name: "Fern", description: "green, coumarinic, fresh" },
      { name: "Lichen", description: "mineral, green, ancient" },
      { name: "Wet Earth", description: "petrichor, damp, primal" },
      { name: "Mushroom", description: "earthy, umami, forest" },
      { name: "Ivy", description: "green, waxy, cool" },
      { name: "Moss Accord", description: "damp, verdant, natural" },
      { name: "Forest Floor", description: "leafy, damp, rich" },
      { name: "Green Tea", description: "dry, clean, herbal" },
    ],
  },
  {
    name: "Dry Woods",
    color: "45 30% 40%",
    colorHex: "#857550",
    group: "Woody",
    complementary: ["Soft Floral", "Oriental"],
    notes: [
      { name: "Vetiver Dry", description: "smoky, dry, mineral" },
      { name: "Cedar Leaf", description: "sharp, herbal, woody" },
      { name: "Smoke", description: "campfire, warm, rugged" },
      { name: "Tobacco Leaf", description: "dry, sweet, aromatic" },
      { name: "Hay", description: "sweet, dry, sun-warmed" },
      { name: "Leather", description: "rich, animalic, warm" },
      { name: "Suede", description: "soft, powdery, clean" },
      { name: "Burnt Wood", description: "charred, smoky, primal" },
      { name: "Desiccated Bark", description: "dry, papery, woody" },
      { name: "Ash", description: "mineral, dry, aftermath" },
      { name: "Dried Herbs", description: "savory, dusty, warm" },
      { name: "Wheat", description: "bready, warm, golden" },
    ],
  },
  {
    name: "Aromatic",
    color: "140 30% 38%",
    colorHex: "#448855",
    group: "Fresh",
    complementary: ["Floral Oriental", "Woody Oriental"],
    notes: [
      { name: "Lavender", description: "calming, herbal, clean" },
      { name: "Rosemary", description: "camphor, herbal, sharp" },
      { name: "Sage", description: "earthy, herbal, savory" },
      { name: "Thyme", description: "green, warm, medicinal" },
      { name: "Basil", description: "sweet, herbal, anise-like" },
      { name: "Mint", description: "cool, sharp, refreshing" },
      { name: "Eucalyptus", description: "camphor, cool, clean" },
      { name: "Artemisia", description: "bitter, herbal, green" },
      { name: "Tarragon", description: "anise, herbal, sweet" },
      { name: "Juniper", description: "piney, gin-like, fresh" },
      { name: "Chamomile", description: "apple-like, soothing, soft" },
      { name: "Marjoram", description: "sweet, woody, warm" },
    ],
  },
  {
    name: "Citrus",
    color: "48 85% 55%",
    colorHex: "#e0b820",
    group: "Fresh",
    complementary: ["Soft Oriental", "Woods"],
    notes: [
      { name: "Lemon", description: "tangy, citrus, zesty" },
      { name: "Bergamot", description: "bright, bitter, elegant" },
      { name: "Orange", description: "sweet, juicy, sunny" },
      { name: "Mandarin", description: "sweet, tangy, playful" },
      { name: "Grapefruit", description: "tart, fresh, sparkling" },
      { name: "Lime", description: "sharp, zesty, electric" },
      { name: "Yuzu", description: "tart, floral, Japanese" },
      { name: "Kumquat", description: "sweet-tart, bitter, tiny" },
      { name: "Clementine", description: "sweet, bright, juicy" },
      { name: "Blood Orange", description: "berry, sweet, deep" },
      { name: "Lemongrass", description: "citrusy, herbal, fresh" },
      { name: "Petitgrain", description: "woody, green, bitter" },
    ],
  },
  {
    name: "Water",
    color: "190 50% 45%",
    colorHex: "#3a9eaa",
    group: "Fresh",
    complementary: ["Woody Oriental", "Soft Floral"],
    notes: [
      { name: "Sea Salt", description: "mineral, oceanic, crisp" },
      { name: "Rain", description: "petrichor, fresh, clean" },
      { name: "Cucumber", description: "cool, green, spa-like" },
      { name: "Melon", description: "juicy, fresh, sweet" },
      { name: "Water Lily", description: "aquatic, serene, floral" },
      { name: "Ozone", description: "crisp, electric, airy" },
      { name: "Seaweed", description: "briny, marine, green" },
      { name: "Dew", description: "fresh, light, morning" },
      { name: "Mist", description: "ethereal, cool, soft" },
      { name: "Coral", description: "mineral, warm, oceanic" },
      { name: "Ice", description: "crisp, clean, sharp" },
      { name: "Lagoon", description: "tropical, warm, aquatic" },
    ],
  },
  {
    name: "Green",
    color: "150 40% 42%",
    colorHex: "#40a668",
    group: "Fresh",
    complementary: ["Oriental", "Floral Oriental"],
    notes: [
      { name: "Galbanum", description: "sharp, green, leafy" },
      { name: "Fig Leaf", description: "green, milky, tropical" },
      { name: "Cut Grass", description: "fresh, green, summer" },
      { name: "Violet Leaf", description: "metallic, green, cool" },
      { name: "Bamboo", description: "clean, green, minimal" },
      { name: "Green Apple", description: "crisp, tart, lively" },
      { name: "Tomato Leaf", description: "pungent, green, garden" },
      { name: "Ivy", description: "waxy, green, cool" },
      { name: "Palm", description: "tropical, green, fresh" },
      { name: "Aloe", description: "fresh, cool, healing" },
      { name: "Nettle", description: "sharp, green, wild" },
      { name: "Watercress", description: "peppery, green, aquatic" },
    ],
  },
  {
    name: "Fruity",
    color: "280 40% 50%",
    colorHex: "#8c4dcc",
    group: "Fresh",
    complementary: ["Mossy Woods", "Soft Floral"],
    notes: [
      { name: "Peach", description: "juicy, fuzzy, sweet" },
      { name: "Apple", description: "crisp, fresh, clean" },
      { name: "Pear", description: "juicy, light, elegant" },
      { name: "Raspberry", description: "tart, sweet, berry" },
      { name: "Blackcurrant", description: "tart, fruity, catty" },
      { name: "Plum", description: "dark, sweet, jammy" },
      { name: "Mango", description: "tropical, juicy, lush" },
      { name: "Lychee", description: "exotic, sweet, floral" },
      { name: "Passion Fruit", description: "tangy, tropical, exotic" },
      { name: "Fig", description: "milky, sweet, green" },
      { name: "Coconut", description: "creamy, tropical, sweet" },
      { name: "Pineapple", description: "tart, tropical, bright" },
      { name: "Cherry", description: "sweet, juicy, red" },
      { name: "Strawberry", description: "sweet, fresh, berry" },
    ],
  },
];

export const familyNames = scentFamilies.map((f) => f.name);
export const SEGMENT_COUNT = scentFamilies.length;
export const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

export function getFamilyByName(name: string): ScentFamily | undefined {
  return scentFamilies.find((f) => f.name === name);
}

/* ─── Blend name generator ─── */
const prefixes = ["Velvet", "Golden", "Midnight", "Crystal", "Amber", "Ivory", "Obsidian", "Crimson", "Ethereal", "Luminous"];
const suffixes = ["Reverie", "Aura", "Whisper", "Echo", "Mirage", "Bloom", "Drift", "Veil", "Elixir", "Alchemy"];

export function generateBlendName(families: string[]): string {
  const seed = families.join("").length;
  const p = prefixes[seed % prefixes.length];
  const s = suffixes[(seed + 3) % suffixes.length];
  return `${p} ${s}`;
}

export function generateBlendDescription(
  selections: { family: string; notes: string[] }[]
): string {
  const validSelections = selections.filter(s => s.notes.length > 0);
  
  if (validSelections.length === 0) return "";
  
  // Simple one-sentence descriptions with smell/texture words
  const primaryFamily = validSelections[0].family.toLowerCase();
  
  const descriptions: Record<string, string> = {
    "floral": "Fresh, soft petals with sweet, clean warmth.",
    "citrus": "Bright, sharp citrus with cool, zesty freshness.",
    "woody": "Warm, dry woodsmoke with earthy, soft depth.",
    "oriental": "Rich, sweet vanilla with warm, spicy amber.",
    "fresh": "Clean, crisp cotton with light, airy freshness.",
    "aquatic": "Cool, salty sea spray with fresh, watery notes.",
    "green": "Sharp, crushed herbs with clean, bitter freshness.",
    "gourmand": "Sweet, warm vanilla with buttery, rich texture."
  };
  
  return descriptions[primaryFamily] || "A personal scent with fresh, warm character and soft texture.";
}
