// Catalog domain types. All money values are integer US cents.

/** A category slug from data/products.json "categories". */
export type CategorySlug = string;

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
