import { Suspense } from "react";
import Link from "next/link";
import { LayoutGrid, List, X } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { ProductListItem } from "@/components/product/product-list-item";
import { Button } from "@/components/ui/button";
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
    <>
      <header className="border-b border-line bg-blue-tint">
        <div className="container-site py-8 sm:py-10">
          <Breadcrumbs
            items={category ? [{ label: "Shop", href: routes.shop }, { label: category.name }] : [{ label: "Shop" }]}
          />
          <h1 className="mt-4 text-3xl sm:text-4xl">{category ? category.name : "All products"}</h1>
          <p className="mt-2 max-w-xl text-muted">
            {category
              ? category.description
              : "Genuine products from trusted brands, shipped across the United States."}
          </p>
        </div>
      </header>

      <div className="container-site pb-16">
        <Suspense fallback={<ResultsSkeleton />}>
          <ShopResults category={category} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
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
    <div className="grid gap-10 pt-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
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
                for <span className="font-semibold text-black">“{state.q}”</span>
              </>
            )}
          </p>
          <SortSelect basePath={basePath} state={state} />
          <ViewToggle basePath={basePath} state={state} />
        </div>

        <ActiveFilters basePath={basePath} state={state} />

        {result.total === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-black/25 px-6 py-16 text-center">
            <p className="text-xl font-bold">No products match your search</p>
            <p className="mt-2 text-muted">Try removing a filter or searching for a different term.</p>
            <Button asChild className="mt-6">
              <Link href={routes.shop}>View all products</Link>
            </Button>
          </div>
        ) : state.view === "list" ? (
          <div className="mt-6 space-y-3">
            {result.items.map((p) => (
              <ProductListItem key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
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
  return state.brands.length + Number(state.inStock) + Number(state.min !== undefined || state.max !== undefined);
}

function ViewToggle({ basePath, state }: { basePath: string; state: ShopState }) {
  const options = [
    { view: "grid" as const, label: "Grid view", Icon: LayoutGrid },
    { view: "list" as const, label: "List view", Icon: List },
  ];
  return (
    <div className="flex overflow-hidden rounded-md border border-black/25" role="group" aria-label="Layout">
      {options.map(({ view, label, Icon }) => (
        <Link
          key={view}
          href={shopHref(basePath, { ...state, view })}
          scroll={false}
          aria-label={label}
          aria-current={state.view === view ? "true" : undefined}
          className={cn(
            "inline-flex size-10 items-center justify-center",
            state.view === view ? "bg-black text-white" : "bg-white text-black hover:bg-blue-tint",
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
  ];

  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.label}>
          <Link
            href={shopHref(basePath, chip.remove)}
            scroll={false}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-tint pr-2 pl-3 text-sm font-medium hover:bg-blue-soft"
          >
            {chip.label}
            <X className="size-4" aria-label="Remove" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-10 pt-8 lg:grid-cols-[16rem_1fr] lg:gap-10" aria-busy="true" aria-label="Loading products">
      <div className="hidden h-96 animate-pulse rounded-lg bg-blue-tint lg:block" />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <div className="aspect-square animate-pulse rounded-md bg-blue-tint" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-blue-tint" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-blue-tint" />
          </div>
        ))}
      </div>
    </div>
  );
}
