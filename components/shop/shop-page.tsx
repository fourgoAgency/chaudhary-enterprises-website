import { Suspense } from "react";
import Link from "next/link";
import { LayoutGrid, List, X } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { ProductListItem } from "@/components/product/product-list-item";
import { MobileFilters } from "@/components/shop/mobile-filters";
import { Pagination } from "@/components/shop/pagination";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { getCategories, getFacets, getProductCountsByCategory, queryProducts } from "@/lib/catalog";
import { routes } from "@/lib/site";
import {
  hasActiveFilters,
  parseShopParams,
  shopHref,
  toProductQuery,
  toSearchParams,
  type ShopState,
} from "@/lib/shop-params";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

type RawParams = Record<string, string | string[] | undefined>;

type ShopPageProps = {
  category?: Category;
  searchParams: Promise<RawParams>;
};

/** Shared layout for /shop and /shop/[category]. The heading is static; results stream in. */
export function ShopPage({ category, searchParams }: ShopPageProps) {
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs
        items={category ? [{ label: "Shop", href: routes.shop }, { label: category.name }] : [{ label: "Shop" }]}
      />
      <header className="mt-6 max-w-2xl border-b border-line pb-8">
        <h1 className="font-serif text-4xl font-medium text-navy sm:text-5xl">
          {category ? category.name : "All products"}
        </h1>
        <p className="mt-3 text-muted">
          {category
            ? category.description
            : "Wholesale pricing on every product, with lower unit prices as your order grows."}
        </p>
      </header>

      <Suspense fallback={<ResultsSkeleton />}>
        <ShopResults category={category} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopResults({ category, searchParams }: ShopPageProps) {
  const state = parseShopParams(await searchParams);
  const basePath = category ? `${routes.shop}/${category.slug}` : routes.shop;

  const [result, facets, categories, counts] = await Promise.all([
    queryProducts({ ...toProductQuery(state), category: category?.slug }),
    getFacets(category?.slug),
    getCategories(),
    getProductCountsByCategory(),
  ]);

  const filterProps = {
    basePath,
    state,
    facets,
    activeCategory: category?.slug,
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, count: counts[c.slug] })),
  };
  // Remount the uncontrolled filter form whenever the URL state changes.
  const formKey = toSearchParams(state).toString();
  const start = (result.page - 1) * result.perPage + 1;
  const end = start + result.items.length - 1;

  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
      <aside className="hidden lg:block" aria-label="Filters">
        <ShopFilters key={formKey} {...filterProps} idPrefix="filter" />
      </aside>

      <section aria-label="Products" className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="lg:hidden">
            <MobileFilters key={formKey} {...filterProps} activeCount={activeFilterCount(state)} />
          </div>
          <p className="mr-auto text-sm text-muted" aria-live="polite">
            {result.total === 0
              ? "No products found"
              : `Showing ${start}–${end} of ${result.total} ${result.total === 1 ? "product" : "products"}`}
            {state.q && (
              <>
                {" "}
                for <span className="font-semibold text-ink">“{state.q}”</span>
              </>
            )}
          </p>
          <SortSelect basePath={basePath} state={state} />
          <ViewToggle basePath={basePath} state={state} />
        </div>

        <ActiveFilters basePath={basePath} state={state} />

        {result.total === 0 ? (
          <div className="mt-10 border border-dashed border-line px-6 py-16 text-center">
            <p className="font-serif text-2xl text-navy">No products match your search</p>
            <p className="mt-2 text-sm text-muted">Try removing a filter or searching for a different term.</p>
            <Link
              href={routes.shop}
              className="mt-6 inline-block text-sm font-semibold text-navy underline decoration-gold underline-offset-4"
            >
              View all products
            </Link>
          </div>
        ) : state.view === "list" ? (
          <div className="mt-4 border-t border-line">
            {result.items.map((p) => (
              <ProductListItem key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
            {result.items.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        )}

        <Pagination basePath={basePath} state={{ ...state, page: result.page }} pageCount={result.pageCount} />
      </section>
    </div>
  );
}

function activeFilterCount(state: ShopState) {
  return (
    state.brands.length +
    Number(state.inStock) +
    Number(state.min !== undefined || state.max !== undefined) +
    Number(state.moqMin !== undefined || state.moqMax !== undefined)
  );
}

function ViewToggle({ basePath, state }: { basePath: string; state: ShopState }) {
  const options = [
    { view: "grid" as const, label: "Grid view", Icon: LayoutGrid },
    { view: "list" as const, label: "List view", Icon: List },
  ];
  return (
    <div className="flex border border-line bg-white" role="group" aria-label="Layout">
      {options.map(({ view, label, Icon }) => (
        <Link
          key={view}
          href={shopHref(basePath, { ...state, view })}
          scroll={false}
          aria-label={label}
          aria-current={state.view === view ? "true" : undefined}
          className={cn(
            "inline-flex size-10 items-center justify-center",
            state.view === view ? "bg-navy text-ivory-light" : "text-muted hover:text-navy",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </Link>
      ))}
    </div>
  );
}

function ActiveFilters({ basePath, state }: { basePath: string; state: ShopState }) {
  if (!hasActiveFilters(state) && !state.q) return null;
  const reset = { ...state, page: 1 };
  const money = (n: number) => `$${n}`;

  const chips: { label: string; remove: Partial<ShopState> }[] = [
    ...(state.q ? [{ label: `Search: ${state.q}`, remove: { ...reset, q: "" } }] : []),
    ...state.brands.map((b) => ({ label: b, remove: { ...reset, brands: state.brands.filter((x) => x !== b) } })),
    ...(state.inStock ? [{ label: "In stock", remove: { ...reset, inStock: false } }] : []),
    ...(state.min !== undefined || state.max !== undefined
      ? [
          {
            label: `Price ${state.min !== undefined ? money(state.min) : "any"} – ${state.max !== undefined ? money(state.max) : "any"}`,
            remove: { ...reset, min: undefined, max: undefined },
          },
        ]
      : []),
    ...(state.moqMin !== undefined || state.moqMax !== undefined
      ? [
          {
            label: `MOQ ${state.moqMin ?? 0} – ${state.moqMax ?? "any"}`,
            remove: { ...reset, moqMin: undefined, moqMax: undefined },
          },
        ]
      : []),
  ];

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.label}>
          <Link
            href={shopHref(basePath, chip.remove)}
            scroll={false}
            className="inline-flex items-center gap-1.5 border border-line bg-white py-1 pr-2 pl-3 text-xs text-ink hover:border-navy"
          >
            {chip.label}
            <X className="size-3.5 text-muted" aria-label="Remove" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[15rem_1fr] lg:gap-12" aria-busy="true" aria-label="Loading products">
      <div className="hidden space-y-3 lg:block">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-5 animate-pulse bg-ivory" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="aspect-square animate-pulse bg-ivory" />
            <div className="mt-4 h-4 w-3/4 animate-pulse bg-ivory" />
            <div className="mt-2 h-4 w-1/2 animate-pulse bg-ivory" />
          </div>
        ))}
      </div>
    </div>
  );
}
