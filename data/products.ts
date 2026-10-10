import { existsSync } from "node:fs";
import path from "node:path";
import source from "@/data/products.json";
import type { Category, Product, StockStatus } from "@/lib/types";

// Loads data/products.json (the client's product file) into the site's shapes.
// To add or edit products, change products.json and put images in /public/products.
//
// Categories come from "categories" in the same file, in the order listed there; navigation, home
// tiles and shop filters are all built from it.
// Price: set "price" on a product in US dollars (e.g. "price": 19.1).
// The checks below fail the build if a product is missing something the store needs.

type SourceProduct = Omit<(typeof source.products)[number], "price"> & {
  price?: number;
  priceTiers?: { minQty: number; unitPrice: number }[];
  currency?: string;
};

export const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

const stockStatuses: StockStatus[] = ["in_stock", "low_stock", "out_of_stock"];

export const categories: Category[] = source.categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: c.description,
}));
const categorySlugs = new Set(categories.map((c) => c.slug));

/** Use the listed image if the file exists in /public, otherwise the placeholder. */
function resolveImage(src: string) {
  return existsSync(path.join(process.cwd(), "public", src)) ? src : PLACEHOLDER_IMAGE;
}

function toProduct(raw: SourceProduct, position: number): Product {
  const fail = (message: string): never => {
    throw new Error(`products.json → ${raw.sku}: ${message}`);
  };

  if (!categorySlugs.has(raw.categorySlug)) fail(`unknown categorySlug "${raw.categorySlug}"`);
  if (!stockStatuses.includes(raw.stockStatus as StockStatus)) fail(`unknown stockStatus "${raw.stockStatus}"`);
  if (raw.currency && raw.currency !== "USD") fail("prices must be in USD");

  const dollars = raw.price ?? [...(raw.priceTiers ?? [])].sort((a, b) => a.minQty - b.minQty)[0]?.unitPrice;
  if (typeof dollars !== "number" || !(dollars > 0)) fail('needs a "price"');

  const images = raw.images.length ? raw.images : [PLACEHOLDER_IMAGE];

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    sku: raw.sku,
    upc: raw.upc ?? undefined,
    brand: raw.brand,
    category: raw.categorySlug,
    description: raw.description,
    highlights: raw.highlights ?? [],
    specs: Object.entries(raw.specifications ?? {}).map(([label, value]) => ({ label, value: String(value) })),
    images: images.map((src, i) => ({
      src: resolveImage(src),
      alt: i === 0 ? raw.name : `${raw.name}, image ${i + 1}`,
    })),
    price: Math.round(dollars! * 100),
    stock: raw.stockStatus as StockStatus,
    featured: raw.featured,
    position,
  };
}

export const products: Product[] = (source.products as SourceProduct[]).map(toProduct);

for (const key of ["id", "slug", "sku"] as const) {
  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p[key])) throw new Error(`products.json: duplicate ${key} "${p[key]}"`);
    seen.add(p[key]);
  }
}
{
  const seen = new Set<string>();
  for (const c of categories) {
    if (seen.has(c.slug)) throw new Error(`products.json: duplicate category slug "${c.slug}"`);
    seen.add(c.slug);
  }
}
