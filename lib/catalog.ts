import { categories } from "@/data/categories";
import { categoryOverrides, products } from "@/data/products";
import type { SortKey } from "@/lib/shop-params";
import type { Category, CategorySlug, Product } from "@/lib/types";

// Catalog data layer. Everything outside this file reads products through these async functions,
// so data/products.json can later be swapped for a CMS without touching pages or components.

export const DEFAULT_PER_PAGE = 12;

export type ProductQuery = {
  q?: string;
  category?: CategorySlug;
  brands?: string[];
  /** Price filter, in cents. */
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type ProductQueryResult = {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type CatalogFacets = {
  brands: { name: string; count: number }[];
  /** Price bounds, in cents. */
  price: { min: number; max: number };
};

// ---- Categories ----

// Only categories that currently have products are shown; others appear once products are added.
const activeCategories = categories
  .filter((c) => products.some((p) => p.category === c.slug))
  .map((c) => ({ ...c, ...categoryOverrides.get(c.slug) }));

export async function getCategories(): Promise<Category[]> {
  return activeCategories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return activeCategories.find((c) => c.slug === slug);
}

// ---- Products ----

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

/** Same-category products first, topped up with featured items from other categories. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  const others = products.filter((p) => p.category !== product.category && p.featured);
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getProductCountsByCategory(): Promise<Record<CategorySlug, number>> {
  const counts = Object.fromEntries(categories.map((c) => [c.slug, 0])) as Record<CategorySlug, number>;
  for (const p of products) counts[p.category]++;
  return counts;
}

export async function queryProducts(query: ProductQuery = {}): Promise<ProductQueryResult> {
  const perPage = query.perPage ?? DEFAULT_PER_PAGE;
  const brands = query.brands?.length ? new Set(query.brands) : undefined;
  const terms = normalize(query.q ?? "")
    .split(" ")
    .filter(Boolean);

  const filtered = products.filter((p) => {
    if (query.category && p.category !== query.category) return false;
    if (brands && !brands.has(p.brand)) return false;
    if (query.inStockOnly && p.stock === "out_of_stock") return false;
    if (query.minPrice !== undefined && p.price < query.minPrice) return false;
    if (query.maxPrice !== undefined && p.price > query.maxPrice) return false;
    if (terms.length) {
      const haystack = searchText(p);
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort(comparators[query.sort ?? "featured"]);
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount);

  return {
    items: sorted.slice((page - 1) * perPage, page * perPage),
    total,
    page,
    perPage,
    pageCount,
  };
}

/** Filter options for the shop sidebar, scoped to a category when given. */
export async function getFacets(category?: CategorySlug): Promise<CatalogFacets> {
  const scope = category ? products.filter((p) => p.category === category) : products;
  const brandCounts = new Map<string, number>();
  for (const p of scope) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  const prices = scope.map((p) => p.price);

  return {
    brands: [...brandCounts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name)),
    price: { min: Math.min(...prices), max: Math.max(...prices) },
  };
}

// ---- Helpers ----

const categoryNames = new Map(activeCategories.map((c) => [c.slug, c.name]));

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function searchText(p: Product) {
  return normalize([p.name, p.sku, p.upc, p.brand, categoryNames.get(p.category)].join(" "));
}

function byNewest(a: Product, b: Product) {
  return b.position - a.position;
}

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.position - b.position,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  newest: byNewest,
};
