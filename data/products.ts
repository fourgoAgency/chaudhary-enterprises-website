import { existsSync } from "node:fs";
import path from "node:path";
import { categories } from "@/data/categories";
import source from "@/data/products.json";
import type { CategorySlug, Product, StockStatus } from "@/lib/types";

// Loads data/products.json (the client's product file) into the site's Product shape.
// To add or edit products, change products.json and put images in /public/products.
// The checks below fail the build if a product would break ordering or pricing.

type SourceProduct = (typeof source.products)[number];

export const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

const stockStatuses: StockStatus[] = ["in_stock", "low_stock", "out_of_stock"];
const categorySlugs = new Set<string>(categories.map((c) => c.slug));

/** Use the listed image if the file exists in /public, otherwise the placeholder. */
function resolveImage(src: string) {
  return existsSync(path.join(process.cwd(), "public", src)) ? src : PLACEHOLDER_IMAGE;
}

function toProduct(raw: SourceProduct, position: number): Product {
  const fail = (message: string) => {
    throw new Error(`products.json → ${raw.sku}: ${message}`);
  };

  if (!categorySlugs.has(raw.categorySlug)) fail(`unknown categorySlug "${raw.categorySlug}"`);
  if (!stockStatuses.includes(raw.stockStatus as StockStatus)) fail(`unknown stockStatus "${raw.stockStatus}"`);
  if (raw.currency !== "USD") fail("prices must be in USD");
  if (raw.moq % raw.casePack !== 0) fail("moq must be a whole number of cases");

  const sorted = [...raw.priceTiers].sort((a, b) => a.minQty - b.minQty);
  // Quantities below the MOQ can't be ordered, so the first tier starts at the MOQ.
  const tiers = sorted
    .filter((t, i) => i === 0 || t.minQty > raw.moq)
    .map((t, i) => ({ minQty: i === 0 ? raw.moq : t.minQty, unitPrice: Math.round(t.unitPrice * 100) }));
  tiers.forEach((t, i) => {
    if (t.minQty % raw.casePack !== 0) fail(`tier starting at ${t.minQty} is not a whole number of cases`);
    if (i > 0 && t.unitPrice >= tiers[i - 1].unitPrice) fail("tier prices must fall as quantity rises");
  });

  const images = raw.images.length ? raw.images : [PLACEHOLDER_IMAGE];

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    sku: raw.sku,
    upc: raw.upc ?? undefined,
    brand: raw.brand,
    category: raw.categorySlug as CategorySlug,
    description: raw.description,
    highlights: raw.highlights,
    specs: Object.entries(raw.specifications).map(([label, value]) => ({ label, value: String(value) })),
    images: images.map((src, i) => ({
      src: resolveImage(src),
      alt: i === 0 ? raw.name : `${raw.name}, image ${i + 1}`,
    })),
    casePack: raw.casePack,
    moq: raw.moq,
    stock: raw.stockStatus as StockStatus,
    tiers,
    featured: raw.featured,
    position,
  };
}

export const products: Product[] = source.products.map(toProduct);

for (const key of ["id", "slug", "sku"] as const) {
  const seen = new Set<string>();
  for (const p of products) {
    if (seen.has(p[key])) throw new Error(`products.json: duplicate ${key} "${p[key]}"`);
    seen.add(p[key]);
  }
}
