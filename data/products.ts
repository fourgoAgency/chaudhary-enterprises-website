import type { CategorySlug, Product, StockStatus } from "@/lib/types";

// Placeholder catalog. Generic products only — no real brand names, logos or product photos
// until the client confirms which brands they are authorised to sell.
// Replace this file (or swap lib/catalog.ts to a CMS/database) when real data is ready.

type Seed = {
  slug: string;
  name: string;
  category: CategorySlug;
  brand: string;
  summary: string;
  description: string;
  specs: [label: string, value: string][];
  casePack: number;
  /** [minQty, unit price in dollars]; the first entry is the MOQ. */
  tiers: [number, number][];
  stock?: StockStatus;
  featured?: boolean;
  createdAt: string;
};

const BRAND_A = "Sample Brand A";
const BRAND_B = "Sample Brand B";
const BRAND_C = "Sample Brand C";

const WHOLESALE_NOTE =
  "Supplied brand-new in original manufacturer packaging through legitimate supply channels. Cases ship sealed and can be prepped for Amazon FBA on request.";

const categoryCodes: Record<CategorySlug, string> = {
  "health-household": "HH",
  "beauty-personal-care": "BP",
  "grocery-gourmet-food": "GR",
  "kitchen-dining": "KD",
  "home-kitchen": "HK",
  "tools-home-improvement": "TL",
  automotive: "AU",
  "industrial-scientific": "IS",
  "sports-outdoors": "SO",
  electronics: "EL",
  "musical-instruments": "MI",
  "arts-crafts-sewing": "AC",
  "office-products": "OF",
  "toys-games": "TG",
  baby: "BB",
};

const counters: Partial<Record<CategorySlug, number>> = {};

function define(seed: Seed): Product {
  const n = (counters[seed.category] = (counters[seed.category] ?? 0) + 1);
  const sku = `CE-${categoryCodes[seed.category]}-${String(100 + n)}`;
  const moq = seed.tiers[0][0];
  seed.tiers.forEach(([minQty, price], i) => {
    if (minQty % seed.casePack !== 0) throw new Error(`${seed.slug}: tier ${minQty} is not a whole number of cases`);
    if (i > 0 && (minQty <= seed.tiers[i - 1][0] || price >= seed.tiers[i - 1][1]))
      throw new Error(`${seed.slug}: tiers must rise in quantity and fall in price`);
  });

  return {
    id: sku.toLowerCase(),
    slug: seed.slug,
    name: seed.name,
    sku,
    brand: seed.brand,
    category: seed.category,
    summary: seed.summary,
    description: `${seed.description}\n\n${WHOLESALE_NOTE}`,
    specs: seed.specs.map(([label, value]) => ({ label, value })),
    images: [
      { src: `/products/${seed.category}.svg`, alt: `${seed.name} — placeholder image` },
      { src: `/products/${seed.category}-alt.svg`, alt: `${seed.name} — alternate placeholder image` },
    ],
    casePack: seed.casePack,
    moq,
    stock: seed.stock ?? "in_stock",
    tiers: seed.tiers.map(([minQty, dollars]) => ({ minQty, unitPrice: Math.round(dollars * 100) })),
    featured: seed.featured,
    createdAt: seed.createdAt,
  };
}

const seeds: Seed[] = [
  // Health & Household
  {
    slug: "nitrile-exam-gloves-100-count",
    name: "Powder-Free Nitrile Exam Gloves, 100 Count",
    category: "health-household",
    brand: BRAND_A,
    summary: "Latex-free, powder-free disposable gloves in a dispenser box. Size medium.",
    description:
      "Textured fingertips for a secure grip and a beaded cuff for easy donning. Suitable for cleaning, food handling and general household use.",
    specs: [
      ["Count", "100 gloves per box"],
      ["Size", "Medium"],
      ["Material", "Nitrile, powder-free"],
      ["Color", "Blue"],
    ],
    casePack: 10,
    tiers: [
      [10, 6.4],
      [50, 5.9],
      [200, 5.35],
    ],
    featured: true,
    createdAt: "2026-09-02",
  },
  {
    slug: "disinfecting-surface-wipes-80-count",
    name: "Disinfecting Surface Wipes, 80 Count",
    category: "health-household",
    brand: BRAND_B,
    summary: "Pre-moistened multi-surface wipes in a resealable flip-top canister.",
    description:
      "Thick, textured wipes for kitchens, bathrooms and high-touch surfaces. Fresh scent, resealable lid keeps wipes moist.",
    specs: [
      ["Count", "80 wipes per canister"],
      ["Scent", "Fresh"],
      ["Container", "Flip-top canister"],
      ["Wipe size", "7 × 8 in"],
    ],
    casePack: 12,
    tiers: [
      [12, 3.85],
      [60, 3.49],
      [240, 3.15],
    ],
    createdAt: "2026-08-14",
  },
  {
    slug: "digital-oral-thermometer",
    name: "Digital Oral Thermometer with Fever Alert",
    category: "health-household",
    brand: BRAND_C,
    summary: "Fast-read digital thermometer with LCD display, memory recall and protective case.",
    description:
      "Gives a reading in around 10 seconds with a fever alert beep. Flexible tip, auto shut-off and replaceable battery included.",
    specs: [
      ["Display", "LCD, °F / °C"],
      ["Reading time", "About 10 seconds"],
      ["Battery", "LR41 button cell (included)"],
      ["Includes", "Protective storage case"],
    ],
    casePack: 24,
    tiers: [
      [24, 4.2],
      [96, 3.8],
      [288, 3.4],
    ],
    stock: "low_stock",
    createdAt: "2026-07-20",
  },

  // Beauty & Personal Care
  {
    slug: "moisturizing-hand-cream-3-oz",
    name: "Moisturizing Hand Cream, 3 oz",
    category: "beauty-personal-care",
    brand: BRAND_A,
    summary: "Non-greasy, fast-absorbing hand cream with shea butter in a travel-size tube.",
    description: "Lightweight daily hand cream enriched with shea butter and glycerin. Fragrance-free formula.",
    specs: [
      ["Size", "3 oz (85 g) tube"],
      ["Key ingredients", "Shea butter, glycerin"],
      ["Fragrance", "Fragrance-free"],
    ],
    casePack: 24,
    tiers: [
      [24, 2.65],
      [96, 2.35],
      [288, 2.1],
    ],
    featured: true,
    createdAt: "2026-09-10",
  },
  {
    slug: "bamboo-cotton-swabs-500-count",
    name: "Bamboo Cotton Swabs, 500 Count",
    category: "beauty-personal-care",
    brand: BRAND_B,
    summary: "Biodegradable bamboo-stick cotton swabs in a recyclable paper box.",
    description: "Double-tipped swabs with sturdy bamboo sticks and soft 100% cotton tips. Plastic-free packaging.",
    specs: [
      ["Count", "500 swabs"],
      ["Stick material", "Bamboo"],
      ["Packaging", "Recyclable paper box"],
    ],
    casePack: 36,
    tiers: [
      [36, 1.95],
      [144, 1.75],
      [432, 1.55],
    ],
    createdAt: "2026-06-28",
  },
  {
    slug: "sulfate-free-shampoo-16-oz",
    name: "Sulfate-Free Daily Shampoo, 16 oz",
    category: "beauty-personal-care",
    brand: BRAND_C,
    summary: "Gentle sulfate-free shampoo for all hair types in a pump bottle.",
    description:
      "Cleanses without stripping natural oils. Color-safe, paraben-free formula with a light botanical scent.",
    specs: [
      ["Size", "16 fl oz (473 ml)"],
      ["Hair type", "All hair types"],
      ["Free from", "Sulfates, parabens"],
      ["Bottle", "Pump dispenser"],
    ],
    casePack: 12,
    tiers: [
      [12, 4.75],
      [48, 4.3],
      [192, 3.9],
    ],
    createdAt: "2026-08-03",
  },

  // Grocery & Gourmet Food
  {
    slug: "raw-wildflower-honey-16-oz",
    name: "Raw Wildflower Honey, 16 oz",
    category: "grocery-gourmet-food",
    brand: BRAND_A,
    summary: "Unfiltered raw honey in a squeezable, BPA-free bottle.",
    description:
      "Pure wildflower honey, unpasteurized and lightly strained. Best-before dates provided on every shipment.",
    specs: [
      ["Net weight", "16 oz (454 g)"],
      ["Type", "Raw, unfiltered"],
      ["Container", "BPA-free squeeze bottle"],
      ["Shelf life", "24 months from production"],
    ],
    casePack: 12,
    tiers: [
      [12, 5.6],
      [48, 5.1],
      [192, 4.65],
    ],
    featured: true,
    createdAt: "2026-09-18",
  },
  {
    slug: "roasted-salted-mixed-nuts-2-lb",
    name: "Roasted & Salted Mixed Nuts, 2 lb",
    category: "grocery-gourmet-food",
    brand: BRAND_B,
    summary: "Premium mix of cashews, almonds, pecans and Brazil nuts in a resealable tub.",
    description: "Dry-roasted and lightly salted. Packed in a resealable tub to keep nuts fresh after opening.",
    specs: [
      ["Net weight", "2 lb (907 g)"],
      ["Contains", "Tree nuts"],
      ["Container", "Resealable tub"],
      ["Shelf life", "12 months from production"],
    ],
    casePack: 6,
    tiers: [
      [6, 11.5],
      [30, 10.6],
      [120, 9.8],
    ],
    createdAt: "2026-07-05",
  },
  {
    slug: "green-tea-bags-100-count",
    name: "Pure Green Tea Bags, 100 Count",
    category: "grocery-gourmet-food",
    brand: BRAND_C,
    summary: "Individually wrapped green tea bags for freshness on the go.",
    description: "Smooth, lightly grassy green tea in individually foil-wrapped bags. Naturally contains caffeine.",
    specs: [
      ["Count", "100 tea bags"],
      ["Wrapping", "Individually foil-wrapped"],
      ["Caffeine", "Naturally caffeinated"],
    ],
    casePack: 12,
    tiers: [
      [12, 4.1],
      [60, 3.7],
      [240, 3.35],
    ],
    createdAt: "2026-05-22",
  },

  // Kitchen & Dining
  {
    slug: "stainless-steel-mixing-bowls-set-of-5",
    name: "Stainless Steel Mixing Bowls, Set of 5",
    category: "kitchen-dining",
    brand: BRAND_A,
    summary: "Nesting mixing bowls from 0.75 to 5 quarts with non-slip silicone bases.",
    description:
      "Brushed stainless steel bowls that nest for compact storage. Non-slip bases and wide rims for easy pouring.",
    specs: [
      ["Pieces", "5 bowls"],
      ["Sizes", "0.75, 1.5, 3, 4, 5 qt"],
      ["Material", "Stainless steel, silicone base"],
      ["Care", "Dishwasher safe"],
    ],
    casePack: 6,
    tiers: [
      [6, 14.9],
      [24, 13.6],
      [96, 12.4],
    ],
    featured: true,
    createdAt: "2026-09-05",
  },
  {
    slug: "silicone-spatula-set-4-piece",
    name: "Heat-Resistant Silicone Spatula Set, 4 Piece",
    category: "kitchen-dining",
    brand: BRAND_B,
    summary: "Seamless one-piece silicone spatulas, heat-resistant to 600 °F.",
    description: "Seamless construction with no gaps for food to collect. Safe for non-stick cookware.",
    specs: [
      ["Pieces", "4 spatulas"],
      ["Heat resistance", "Up to 600 °F"],
      ["Material", "Food-grade silicone"],
      ["Care", "Dishwasher safe"],
    ],
    casePack: 24,
    tiers: [
      [24, 5.25],
      [96, 4.75],
      [288, 4.3],
    ],
    createdAt: "2026-06-12",
  },
  {
    slug: "glass-food-storage-containers-10-piece",
    name: "Glass Food Storage Containers, 10 Piece",
    category: "kitchen-dining",
    brand: BRAND_C,
    summary: "Five borosilicate glass containers with locking, leak-proof lids.",
    description: "Oven, microwave and freezer safe glass bases. Snap-lock lids with silicone seals.",
    specs: [
      ["Pieces", "5 containers + 5 lids"],
      ["Material", "Borosilicate glass"],
      ["Lids", "BPA-free, 4-side locking"],
      ["Care", "Dishwasher safe"],
    ],
    casePack: 4,
    tiers: [
      [4, 19.5],
      [20, 17.9],
      [80, 16.4],
    ],
    stock: "out_of_stock",
    createdAt: "2026-04-30",
  },

  // Home & Kitchen
  {
    slug: "clear-stackable-storage-bins-6-pack",
    name: "Clear Stackable Storage Bins, 6 Pack",
    category: "home-kitchen",
    brand: BRAND_A,
    summary: "Clear plastic organizer bins with cut-out handles for pantry and closet.",
    description: "Shatter-resistant, BPA-free bins that stack securely. Cut-out handles make them easy to pull out.",
    specs: [
      ["Pieces", "6 bins"],
      ["Bin size", "11 × 6 × 4 in"],
      ["Material", "BPA-free PET plastic"],
    ],
    casePack: 4,
    tiers: [
      [4, 16.8],
      [20, 15.4],
      [80, 14.1],
    ],
    createdAt: "2026-08-22",
  },
  {
    slug: "microfiber-cleaning-cloths-24-pack",
    name: "Microfiber Cleaning Cloths, 24 Pack",
    category: "home-kitchen",
    brand: BRAND_B,
    summary: "Lint-free, reusable cleaning cloths in four colors.",
    description:
      "Highly absorbent microfiber that cleans with or without chemicals. Machine washable hundreds of times.",
    specs: [
      ["Count", "24 cloths"],
      ["Size", "12 × 12 in"],
      ["Material", "80% polyester, 20% polyamide"],
    ],
    casePack: 20,
    tiers: [
      [20, 7.4],
      [80, 6.75],
      [240, 6.1],
    ],
    featured: true,
    createdAt: "2026-09-12",
  },
  {
    slug: "velvet-hangers-50-pack",
    name: "Non-Slip Velvet Hangers, 50 Pack",
    category: "home-kitchen",
    brand: BRAND_C,
    summary: "Ultra-thin velvet hangers with 360° swivel hooks to save closet space.",
    description: "Slim profile frees up closet space while the velvet finish keeps garments from slipping.",
    specs: [
      ["Count", "50 hangers"],
      ["Width", "17.5 in"],
      ["Hook", "360° swivel, chrome"],
    ],
    casePack: 6,
    tiers: [
      [6, 15.2],
      [30, 13.9],
      [120, 12.7],
    ],
    createdAt: "2026-03-18",
  },

  // Tools & Home Improvement
  {
    slug: "tape-measure-25-ft",
    name: "Retractable Tape Measure, 25 ft",
    category: "tools-home-improvement",
    brand: BRAND_A,
    summary: "Durable 25 ft tape with a 1 in wide blade, belt clip and thumb lock.",
    description: "Impact-resistant case with rubber overmold. Blade marked in inches and centimeters.",
    specs: [
      ["Length", "25 ft / 7.5 m"],
      ["Blade width", "1 in"],
      ["Features", "Thumb lock, belt clip"],
    ],
    casePack: 24,
    tiers: [
      [24, 4.95],
      [96, 4.45],
      [288, 4],
    ],
    createdAt: "2026-07-14",
  },
  {
    slug: "precision-screwdriver-set-32-piece",
    name: "Precision Screwdriver Set, 32 Piece",
    category: "tools-home-improvement",
    brand: BRAND_B,
    summary: "Magnetic precision driver with 31 bits for electronics and small repairs.",
    description: "Aluminium handle with swivel cap and a magnetic bit holder. Bits stored in a labelled case.",
    specs: [
      ["Pieces", "1 driver + 31 bits"],
      ["Bit steel", "S2 alloy steel"],
      ["Case", "Labelled storage case"],
    ],
    casePack: 20,
    tiers: [
      [20, 6.9],
      [80, 6.25],
      [240, 5.65],
    ],
    featured: true,
    createdAt: "2026-09-01",
  },
  {
    slug: "rechargeable-led-work-light",
    name: "Rechargeable LED Work Light",
    category: "tools-home-improvement",
    brand: BRAND_C,
    summary: "Portable USB-C rechargeable work light with magnetic base and hook.",
    description: "Three brightness modes up to 1,000 lumens. Folding stand, magnetic base and hanging hook.",
    specs: [
      ["Output", "Up to 1,000 lumens"],
      ["Charging", "USB-C"],
      ["Runtime", "Up to 5 hours"],
      ["Mounting", "Magnetic base, hook, stand"],
    ],
    casePack: 12,
    tiers: [
      [12, 13.4],
      [48, 12.2],
      [144, 11.1],
    ],
    createdAt: "2026-06-03",
  },

  // Automotive
  {
    slug: "microfiber-car-drying-towels-3-pack",
    name: "Microfiber Car Drying Towels, 3 Pack",
    category: "automotive",
    brand: BRAND_A,
    summary: "Large twisted-loop drying towels that absorb water without streaks.",
    description: "Soft, scratch-free twisted-loop weave. Edgeless design is safe on paint and glass.",
    specs: [
      ["Count", "3 towels"],
      ["Size", "20 × 30 in"],
      ["Weight", "1,200 GSM"],
    ],
    casePack: 24,
    tiers: [
      [24, 8.6],
      [96, 7.8],
      [288, 7.1],
    ],
    createdAt: "2026-08-09",
  },
  {
    slug: "digital-tire-pressure-gauge",
    name: "Digital Tire Pressure Gauge",
    category: "automotive",
    brand: BRAND_B,
    summary: "Backlit digital gauge reading 3–150 PSI with a non-slip grip.",
    description: "Accurate to ±0.5 PSI with a lighted nozzle for night use. Auto shut-off preserves battery.",
    specs: [
      ["Range", "3–150 PSI"],
      ["Accuracy", "±0.5 PSI"],
      ["Units", "PSI, BAR, KPA, KG/CM²"],
    ],
    casePack: 36,
    tiers: [
      [36, 4.6],
      [144, 4.15],
      [432, 3.75],
    ],
    featured: true,
    createdAt: "2026-09-15",
  },
  {
    slug: "foldable-windshield-sun-shade",
    name: "Foldable Windshield Sun Shade",
    category: "automotive",
    brand: BRAND_C,
    summary: "Reflective accordion-fold sun shade that fits most cars and SUVs.",
    description: "Blocks UV rays and reduces cabin temperature. Folds flat with a hook-and-loop strap.",
    specs: [
      ["Size", "63 × 31.5 in"],
      ["Material", "Reflective bubble foil"],
      ["Fits", "Most cars and SUVs"],
    ],
    casePack: 20,
    tiers: [
      [20, 5.4],
      [80, 4.9],
      [240, 4.45],
    ],
    stock: "low_stock",
    createdAt: "2026-05-02",
  },

  // Industrial & Scientific
  {
    slug: "anti-fog-safety-glasses-12-pack",
    name: "Anti-Fog Safety Glasses, 12 Pack",
    category: "industrial-scientific",
    brand: BRAND_A,
    summary: "Clear wraparound safety glasses with anti-fog, anti-scratch lenses.",
    description: "Lightweight polycarbonate lenses with side protection. Designed to meet ANSI Z87.1 requirements.",
    specs: [
      ["Count", "12 pairs"],
      ["Lens", "Clear polycarbonate, anti-fog"],
      ["Standard", "ANSI Z87.1"],
    ],
    casePack: 10,
    tiers: [
      [10, 14.5],
      [50, 13.2],
      [200, 12],
    ],
    createdAt: "2026-07-27",
  },
  {
    slug: "nitrile-coated-work-gloves-12-pairs",
    name: "Nitrile-Coated Work Gloves, 12 Pairs",
    category: "industrial-scientific",
    brand: BRAND_B,
    summary: "Seamless knit work gloves with a nitrile palm coating for grip.",
    description: "Breathable polyester knit with a foam nitrile palm for oily and dry grip. Size large.",
    specs: [
      ["Count", "12 pairs"],
      ["Size", "Large"],
      ["Coating", "Foam nitrile palm"],
    ],
    casePack: 10,
    tiers: [
      [10, 11.8],
      [50, 10.7],
      [200, 9.7],
    ],
    featured: true,
    createdAt: "2026-09-08",
  },
  {
    slug: "plastic-graduated-cylinder-set",
    name: "Plastic Graduated Cylinder Set, 5 Sizes",
    category: "industrial-scientific",
    brand: BRAND_C,
    summary: "Clear polypropylene measuring cylinders from 10 to 250 ml.",
    description: "Raised graduations and hexagonal bases for stability. Autoclavable polypropylene.",
    specs: [
      ["Sizes", "10, 25, 50, 100, 250 ml"],
      ["Material", "Polypropylene"],
      ["Graduations", "Raised, molded"],
    ],
    casePack: 12,
    tiers: [
      [12, 9.2],
      [48, 8.35],
      [144, 7.6],
    ],
    createdAt: "2026-04-11",
  },

  // Sports & Outdoors
  {
    slug: "resistance-bands-set-of-5",
    name: "Loop Resistance Bands, Set of 5",
    category: "sports-outdoors",
    brand: BRAND_A,
    summary: "Five color-coded latex loop bands from extra-light to extra-heavy.",
    description: "Ideal for strength training, physio and mobility work. Comes with a carry pouch.",
    specs: [
      ["Bands", "5 resistance levels"],
      ["Size", "12 × 2 in"],
      ["Material", "Natural latex"],
      ["Includes", "Carry pouch"],
    ],
    casePack: 30,
    tiers: [
      [30, 3.9],
      [120, 3.5],
      [360, 3.15],
    ],
    createdAt: "2026-06-19",
  },
  {
    slug: "insulated-water-bottle-32-oz",
    name: "Insulated Stainless Steel Water Bottle, 32 oz",
    category: "sports-outdoors",
    brand: BRAND_B,
    summary: "Double-wall vacuum-insulated bottle with a leak-proof straw lid.",
    description: "Keeps drinks cold for 24 hours or hot for 12. Powder-coated finish resists sweat and scratches.",
    specs: [
      ["Capacity", "32 fl oz (946 ml)"],
      ["Insulation", "Double-wall vacuum"],
      ["Material", "18/8 stainless steel"],
      ["Lid", "Leak-proof straw lid"],
    ],
    casePack: 24,
    tiers: [
      [24, 8.95],
      [96, 8.1],
      [288, 7.35],
    ],
    featured: true,
    createdAt: "2026-09-20",
  },
  {
    slug: "non-slip-yoga-mat-6mm",
    name: "Non-Slip Yoga Mat, 6 mm",
    category: "sports-outdoors",
    brand: BRAND_C,
    summary: "Cushioned TPE exercise mat with alignment lines and carry strap.",
    description: "Double-sided non-slip texture and 6 mm cushioning for joints. Free from PVC and latex.",
    specs: [
      ["Size", "72 × 24 in"],
      ["Thickness", "6 mm"],
      ["Material", "TPE"],
      ["Includes", "Carry strap"],
    ],
    casePack: 10,
    tiers: [
      [10, 10.5],
      [50, 9.6],
      [200, 8.75],
    ],
    createdAt: "2026-03-29",
  },

  // Electronics
  {
    slug: "usb-c-to-usb-c-cable-6-ft",
    name: "USB-C to USB-C Charging Cable, 6 ft",
    category: "electronics",
    brand: BRAND_A,
    summary: "Braided 60 W fast-charging cable with data transfer up to 480 Mbps.",
    description: "Nylon-braided jacket and reinforced connectors tested for 10,000+ bends.",
    specs: [
      ["Length", "6 ft (1.8 m)"],
      ["Power", "Up to 60 W"],
      ["Data", "USB 2.0, 480 Mbps"],
      ["Jacket", "Nylon braided"],
    ],
    casePack: 50,
    tiers: [
      [50, 2.45],
      [200, 2.15],
      [600, 1.9],
    ],
    featured: true,
    createdAt: "2026-09-22",
  },
  {
    slug: "usb-c-wall-charger-20w",
    name: "20 W USB-C Wall Charger",
    category: "electronics",
    brand: BRAND_B,
    summary: "Compact USB-C PD wall charger for phones, tablets and earbuds.",
    description: "Power Delivery fast charging with over-current and over-temperature protection.",
    specs: [
      ["Output", "20 W USB-C PD"],
      ["Input", "100–240 V AC"],
      ["Certification", "UL listed"],
    ],
    casePack: 40,
    tiers: [
      [40, 3.75],
      [160, 3.35],
      [480, 3],
    ],
    createdAt: "2026-07-09",
  },
  {
    slug: "aa-alkaline-batteries-24-pack",
    name: "AA Alkaline Batteries, 24 Pack",
    category: "electronics",
    brand: BRAND_C,
    summary: "Long-lasting 1.5 V AA alkaline batteries with a 10-year shelf life.",
    description: "Reliable everyday power for remotes, toys and household devices. Mercury-free.",
    specs: [
      ["Count", "24 batteries"],
      ["Size / voltage", "AA, 1.5 V"],
      ["Shelf life", "10 years"],
    ],
    casePack: 12,
    tiers: [
      [12, 7.2],
      [48, 6.55],
      [192, 5.95],
    ],
    createdAt: "2026-05-15",
  },

  // Musical Instruments
  {
    slug: "guitar-picks-variety-50-pack",
    name: "Guitar Picks Variety Pack, 50 Pieces",
    category: "musical-instruments",
    brand: BRAND_A,
    summary: "Celluloid picks in thin, medium and heavy gauges with a storage tin.",
    description: "Assorted colors and gauges for acoustic, electric and bass guitar.",
    specs: [
      ["Count", "50 picks"],
      ["Gauges", "0.46, 0.71, 0.96 mm"],
      ["Material", "Celluloid"],
    ],
    casePack: 50,
    tiers: [
      [50, 2.1],
      [200, 1.85],
      [600, 1.65],
    ],
    createdAt: "2026-06-25",
  },
  {
    slug: "instrument-cable-10-ft",
    name: "Instrument Cable, 10 ft",
    category: "musical-instruments",
    brand: BRAND_B,
    summary: '1/4" straight-to-straight shielded cable for guitar, bass and keyboards.',
    description: "Low-noise oxygen-free copper conductor with braided shielding and metal connectors.",
    specs: [
      ["Length", "10 ft (3 m)"],
      ["Connectors", '1/4" TS straight / straight'],
      ["Shielding", "Braided copper"],
    ],
    casePack: 20,
    tiers: [
      [20, 4.4],
      [80, 3.95],
      [240, 3.55],
    ],
    featured: true,
    createdAt: "2026-09-03",
  },
  {
    slug: "clip-on-chromatic-tuner",
    name: "Clip-On Chromatic Tuner",
    category: "musical-instruments",
    brand: BRAND_C,
    summary: "Color-display headstock tuner for guitar, bass, ukulele and violin.",
    description: "Vibration sensor ignores room noise. Rotating display and auto power-off.",
    specs: [
      ["Modes", "Chromatic, guitar, bass, ukulele, violin"],
      ["Display", "Full-color, 360° rotation"],
      ["Battery", "CR2032 (included)"],
    ],
    casePack: 40,
    tiers: [
      [40, 3.1],
      [160, 2.8],
      [480, 2.5],
    ],
    createdAt: "2026-04-20",
  },

  // Arts, Crafts & Sewing
  {
    slug: "acrylic-paint-set-24-colors",
    name: "Acrylic Paint Set, 24 Colors",
    category: "arts-crafts-sewing",
    brand: BRAND_A,
    summary: "Non-toxic, fast-drying acrylic paints in 22 ml tubes.",
    description: "Rich, opaque colors for canvas, wood, paper and crafts. Conforms to ASTM D-4236.",
    specs: [
      ["Count", "24 tubes × 22 ml"],
      ["Finish", "Satin"],
      ["Safety", "Non-toxic, ASTM D-4236"],
    ],
    casePack: 12,
    tiers: [
      [12, 6.8],
      [48, 6.15],
      [192, 5.6],
    ],
    featured: true,
    createdAt: "2026-09-11",
  },
  {
    slug: "polyester-sewing-thread-24-spools",
    name: "Polyester Sewing Thread, 24 Spools",
    category: "arts-crafts-sewing",
    brand: BRAND_B,
    summary: "All-purpose polyester thread in 24 colors for hand and machine sewing.",
    description: "Strong, low-lint thread suitable for most fabrics. Supplied in a clear storage box.",
    specs: [
      ["Spools", "24 × 250 yd"],
      ["Material", "100% polyester"],
      ["Weight", "40 wt"],
    ],
    casePack: 12,
    tiers: [
      [12, 7.9],
      [48, 7.15],
      [192, 6.5],
    ],
    createdAt: "2026-06-07",
  },
  {
    slug: "canvas-panels-8x10-12-pack",
    name: "Primed Canvas Panels, 8 × 10 in, 12 Pack",
    category: "arts-crafts-sewing",
    brand: BRAND_C,
    summary: "Triple-primed cotton canvas panels for acrylic and oil painting.",
    description: "Acid-free, triple-gesso-primed cotton canvas mounted on rigid board.",
    specs: [
      ["Count", "12 panels"],
      ["Size", "8 × 10 in"],
      ["Primer", "Triple-coat acid-free gesso"],
    ],
    casePack: 6,
    tiers: [
      [6, 9.4],
      [30, 8.6],
      [120, 7.8],
    ],
    createdAt: "2026-02-26",
  },

  // Office Products
  {
    slug: "gel-pens-0-7mm-12-pack",
    name: "Retractable Gel Pens, 0.7 mm, 12 Pack",
    category: "office-products",
    brand: BRAND_A,
    summary: "Smooth-writing black gel ink pens with comfort grips.",
    description: "Quick-drying, smudge-resistant gel ink with a retractable tip and pocket clip.",
    specs: [
      ["Count", "12 pens"],
      ["Tip", "0.7 mm medium"],
      ["Ink", "Black gel"],
    ],
    casePack: 24,
    tiers: [
      [24, 3.6],
      [96, 3.25],
      [288, 2.95],
    ],
    createdAt: "2026-08-18",
  },
  {
    slug: "sticky-notes-3x3-24-pads",
    name: "Sticky Notes, 3 × 3 in, 24 Pads",
    category: "office-products",
    brand: BRAND_B,
    summary: "Repositionable sticky notes in assorted pastel colors.",
    description: "Clean-removing adhesive that sticks and re-sticks without residue. 100 sheets per pad.",
    specs: [
      ["Count", "24 pads × 100 sheets"],
      ["Size", "3 × 3 in"],
      ["Colors", "Assorted pastels"],
    ],
    casePack: 12,
    tiers: [
      [12, 6.3],
      [48, 5.7],
      [192, 5.15],
    ],
    featured: true,
    createdAt: "2026-09-14",
  },
  {
    slug: "letter-size-file-folders-100-count",
    name: "Letter-Size File Folders, 100 Count",
    category: "office-products",
    brand: BRAND_C,
    summary: "Manila file folders with 1/3-cut assorted tabs.",
    description: "Heavyweight 11 pt manila stock with scored expansion for extra capacity.",
    specs: [
      ["Count", "100 folders"],
      ["Size", "Letter (8.5 × 11 in)"],
      ["Tab", "1/3-cut, assorted positions"],
    ],
    casePack: 10,
    tiers: [
      [10, 10.9],
      [50, 9.9],
      [200, 9],
    ],
    createdAt: "2026-03-08",
  },

  // Toys & Games
  {
    slug: "jigsaw-puzzle-1000-piece",
    name: "Landscape Jigsaw Puzzle, 1000 Piece",
    category: "toys-games",
    brand: BRAND_A,
    summary: "Premium thick-board jigsaw with a matte, anti-glare finish.",
    description: "Precision-cut, snug-fitting pieces with a reference poster included. Ages 12+.",
    specs: [
      ["Pieces", "1,000"],
      ["Finished size", "27 × 20 in"],
      ["Age", "12+"],
    ],
    casePack: 12,
    tiers: [
      [12, 7.5],
      [48, 6.8],
      [192, 6.2],
    ],
    createdAt: "2026-07-31",
  },
  {
    slug: "building-blocks-set-500-piece",
    name: "Classic Building Blocks Set, 500 Piece",
    category: "toys-games",
    brand: BRAND_B,
    summary: "Compatible interlocking bricks in assorted colors with storage tub.",
    description: "Open-ended building set that encourages creativity. Includes idea booklet. Ages 4+.",
    specs: [
      ["Pieces", "500"],
      ["Material", "ABS plastic"],
      ["Age", "4+"],
      ["Safety", "Meets ASTM F963"],
    ],
    casePack: 8,
    tiers: [
      [8, 12.6],
      [40, 11.5],
      [160, 10.5],
    ],
    featured: true,
    createdAt: "2026-09-25",
  },
  {
    slug: "bubble-wands-12-pack",
    name: "Bubble Wands Party Pack, 12 Count",
    category: "toys-games",
    brand: BRAND_C,
    summary: "Individually sealed bubble wands with non-toxic solution.",
    description: "Ideal for party favors and outdoor play. Each wand holds 1 fl oz of solution. Ages 3+.",
    specs: [
      ["Count", "12 wands"],
      ["Solution", "Non-toxic, 1 fl oz each"],
      ["Age", "3+"],
    ],
    casePack: 24,
    tiers: [
      [24, 3.2],
      [96, 2.9],
      [288, 2.6],
    ],
    stock: "low_stock",
    createdAt: "2026-05-27",
  },

  // Baby
  {
    slug: "unscented-baby-wipes-12-pack",
    name: "Unscented Baby Wipes, 12 × 72 Count",
    category: "baby",
    brand: BRAND_A,
    summary: "Gentle, fragrance-free water-based wipes for sensitive skin.",
    description: "99% water-based wipes, hypoallergenic and free from alcohol and parabens.",
    specs: [
      ["Count", "12 packs × 72 wipes"],
      ["Fragrance", "Unscented"],
      ["Free from", "Alcohol, parabens"],
    ],
    casePack: 4,
    tiers: [
      [4, 14.8],
      [20, 13.6],
      [80, 12.4],
    ],
    featured: true,
    createdAt: "2026-09-17",
  },
  {
    slug: "silicone-baby-bibs-3-pack",
    name: "Waterproof Silicone Baby Bibs, 3 Pack",
    category: "baby",
    brand: BRAND_B,
    summary: "Soft silicone bibs with a deep food-catcher pocket and adjustable neck.",
    description: "Wipe-clean, BPA-free silicone that rolls up for travel. Fits 6–36 months.",
    specs: [
      ["Count", "3 bibs"],
      ["Material", "Food-grade silicone, BPA-free"],
      ["Age", "6–36 months"],
    ],
    casePack: 24,
    tiers: [
      [24, 5.9],
      [96, 5.35],
      [288, 4.85],
    ],
    createdAt: "2026-06-30",
  },
  {
    slug: "cotton-baby-washcloths-12-pack",
    name: "Soft Cotton Baby Washcloths, 12 Pack",
    category: "baby",
    brand: BRAND_C,
    summary: "Absorbent terry washcloths in neutral colors.",
    description: "Gentle 100% cotton terry, pre-washed for softness. Machine washable.",
    specs: [
      ["Count", "12 washcloths"],
      ["Size", "10 × 10 in"],
      ["Material", "100% cotton terry"],
    ],
    casePack: 20,
    tiers: [
      [20, 6.1],
      [80, 5.55],
      [240, 5.05],
    ],
    createdAt: "2026-04-04",
  },
];

export const products: Product[] = seeds.map(define);

const duplicate = products.find((p, i) => products.findIndex((o) => o.slug === p.slug) !== i);
if (duplicate) throw new Error(`Duplicate product slug: ${duplicate.slug}`);
