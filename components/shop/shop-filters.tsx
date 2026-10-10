"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CatalogFacets } from "@/lib/catalog";
import { routes } from "@/lib/site";
import { hasActiveFilters, shopHref, type ShopState } from "@/lib/shop-params";
import { cn } from "@/lib/utils";

type CategoryOption = { slug: string; name: string; count: number };

type ShopFiltersProps = {
  basePath: string;
  state: ShopState;
  categories: CategoryOption[];
  activeCategory?: string;
  facets: CatalogFacets;
  /** Keeps input ids unique when the panel is rendered twice (sidebar + mobile drawer). */
  idPrefix: string;
  onApplied?: () => void;
};

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="float-left mb-3 w-full font-bold">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}

const inputClass =
  "h-10 w-full min-w-0 rounded-md border border-black/25 bg-white px-3 text-sm text-black placeholder:text-muted focus:border-blue focus:outline-none";

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return undefined;
  const n = Number(text);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function ShopFilters({
  basePath,
  state,
  categories,
  activeCategory,
  facets,
  idPrefix,
  onApplied,
}: ShopFiltersProps) {
  const router = useRouter();
  const id = (name: string) => `${idPrefix}-${name}`;
  const dollars = (cents: number) => (cents / 100).toFixed(2);

  // Without JS the form submits as a normal GET; with JS we build a clean URL (no empty params).
  function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    router.push(
      shopHref(basePath, {
        q: state.q,
        sort: state.sort,
        view: state.view,
        brands: data.getAll("brand").map(String),
        min: optionalNumber(data.get("min")),
        max: optionalNumber(data.get("max")),
        inStock: data.get("stock") === "1",
      }),
      { scroll: false },
    );
    onApplied?.();
  }

  // Checkboxes apply immediately; number fields wait for "Apply".
  function onChange(event: React.ChangeEvent<HTMLFormElement>) {
    if (event.target instanceof HTMLInputElement && event.target.type === "checkbox") {
      event.currentTarget.requestSubmit();
    }
  }

  return (
    <form action={basePath} method="get" onSubmit={onSubmit} onChange={onChange} aria-label="Filter products">
      {state.q && <input type="hidden" name="q" value={state.q} />}
      {state.sort !== "featured" && <input type="hidden" name="sort" value={state.sort} />}
      {state.view === "list" && <input type="hidden" name="view" value="list" />}

      <FilterGroup title="Category">
        <ul className="-mx-3 space-y-0.5 text-[15px]">
          <li>
            <Link
              href={shopHref(routes.shop, { q: state.q, sort: state.sort, view: state.view })}
              aria-current={!activeCategory ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-1.5",
                !activeCategory ? "bg-blue-tint font-semibold text-blue" : "hover:bg-blue-tint",
              )}
            >
              All products
            </Link>
          </li>
          {categories.map((c) => {
            const active = c.slug === activeCategory;
            return (
              <li key={c.slug}>
                <Link
                  href={shopHref(`${routes.shop}/${c.slug}`, { q: state.q, sort: state.sort, view: state.view })}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex justify-between gap-2 rounded-md px-3 py-1.5",
                    active ? "bg-blue-tint font-semibold text-blue" : "hover:bg-blue-tint",
                  )}
                >
                  {c.name}
                  <span className="text-sm text-muted tabular-nums">{c.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {facets.brands.length > 0 && (
        <FilterGroup title="Brand">
          <ul className="space-y-2 text-[15px]">
            {facets.brands.map((b) => (
              <li key={b.name}>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    name="brand"
                    value={b.name}
                    defaultChecked={state.brands.includes(b.name)}
                    className="size-[1.1rem] accent-blue"
                  />
                  <span className="flex-1">{b.name}</span>
                  <span className="text-sm text-muted tabular-nums">{b.count}</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2.5 text-[15px]">
          <input
            type="checkbox"
            name="stock"
            value="1"
            defaultChecked={state.inStock}
            className="size-[1.1rem] accent-blue"
          />
          In stock only
        </label>
      </FilterGroup>

      <FilterGroup title="Price (USD)">
        <div className="flex items-center gap-2">
          <label htmlFor={id("min")} className="sr-only">
            Minimum price
          </label>
          <input
            id={id("min")}
            name="min"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder={dollars(facets.price.min)}
            defaultValue={state.min}
            className={inputClass}
          />
          <span className="text-muted" aria-hidden>
            to
          </span>
          <label htmlFor={id("max")} className="sr-only">
            Maximum price
          </label>
          <input
            id={id("max")}
            name="max"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder={dollars(facets.price.max)}
            defaultValue={state.max}
            className={inputClass}
          />
        </div>
      </FilterGroup>

      <div className="flex items-center gap-4 pt-5">
        <Button type="submit" size="sm">
          Apply filters
        </Button>
        {hasActiveFilters(state) && (
          <Link
            href={shopHref(basePath, { q: state.q, sort: state.sort, view: state.view })}
            onClick={onApplied}
            className="text-sm font-semibold text-blue underline underline-offset-4"
          >
            Clear all
          </Link>
        )}
      </div>
    </form>
  );
}
