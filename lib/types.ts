// Catalog domain types. All money values are integer US cents.

export type CategorySlug =
  | "health-household"
  | "beauty-personal-care"
  | "grocery-gourmet-food"
  | "kitchen-dining"
  | "home-kitchen"
  | "tools-home-improvement"
  | "automotive"
  | "industrial-scientific"
  | "sports-outdoors"
  | "electronics"
  | "musical-instruments"
  | "arts-crafts-sewing"
  | "office-products"
  | "toys-games"
  | "baby";

export type Category = {
  slug: CategorySlug;
  name: string;
  /** One-line summary for tiles and collection headers. */
  description: string;
};

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  upc?: string;
  brand: string;
  category: CategorySlug;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  images: ProductImage[];
  /** Unit price in cents. */
  price: number;
  stock: StockStatus;
  featured?: boolean;
  /** Position in the source file; later entries count as newer. */
  position: number;
};
