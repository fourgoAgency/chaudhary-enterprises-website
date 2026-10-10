import type { ProductQuery } from "@/lib/catalog";

// Shop filters live in the URL so results are shareable and work with the back button.
// Prices in the URL are whole dollars (?min=10&max=20); the catalog works in cents.

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export type ShopView = "grid" | "list";

export type ShopState = {
  q: string;
  brands: string[];
  min?: number;
  max?: number;
  inStock: boolean;
  sort: SortKey;
  view: ShopView;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const sortValues = new Set<string>(SORT_OPTIONS.map((o) => o.value));

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);
}

function positiveNumber(value: string | string[] | undefined) {
  const n = Number(first(value));
  return first(value) && Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseShopParams(params: RawParams): ShopState {
  const sort = first(params.sort);
  const page = Math.floor(positiveNumber(params.page) ?? 1);
  return {
    q: (first(params.q) ?? "").trim().slice(0, 100),
    brands: all(params.brand),
    min: positiveNumber(params.min),
    max: positiveNumber(params.max),
    inStock: first(params.stock) === "1",
    sort: sort && sortValues.has(sort) ? (sort as SortKey) : "featured",
    view: first(params.view) === "list" ? "list" : "grid",
    page: Math.max(1, page),
  };
}

export function toProductQuery(state: ShopState): Omit<ProductQuery, "category"> {
  return {
    q: state.q || undefined,
    brands: state.brands,
    minPrice: state.min !== undefined ? Math.round(state.min * 100) : undefined,
    maxPrice: state.max !== undefined ? Math.round(state.max * 100) : undefined,
    inStockOnly: state.inStock,
    sort: state.sort,
    page: state.page,
  };
}

/** Serialise state back to a query string, omitting defaults. */
export function toSearchParams(state: Partial<ShopState>): URLSearchParams {
  const sp = new URLSearchParams();
  if (state.q) sp.set("q", state.q);
  for (const b of state.brands ?? []) sp.append("brand", b);
  if (state.min !== undefined) sp.set("min", String(state.min));
  if (state.max !== undefined) sp.set("max", String(state.max));
  if (state.inStock) sp.set("stock", "1");
  if (state.sort && state.sort !== "featured") sp.set("sort", state.sort);
  if (state.view === "list") sp.set("view", "list");
  if (state.page && state.page > 1) sp.set("page", String(state.page));
  return sp;
}

export function shopHref(basePath: string, state: Partial<ShopState>): string {
  const qs = toSearchParams(state).toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function hasActiveFilters(state: ShopState) {
  return state.brands.length > 0 || state.min !== undefined || state.max !== undefined || state.inStock;
}
