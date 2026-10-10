"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { shopHref, SORT_OPTIONS, type ShopState, type SortKey } from "@/lib/shop-params";

export function SortSelect({ basePath, state }: { basePath: string; state: ShopState }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="shop-sort" className="hidden text-sm text-muted sm:inline">
        Sort by
      </label>
      <div className="relative">
        <select
          id="shop-sort"
          value={state.sort}
          onChange={(e) =>
            router.push(shopHref(basePath, { ...state, sort: e.target.value as SortKey, page: 1 }), { scroll: false })
          }
          className="h-10 appearance-none rounded-md border border-black/25 bg-white pr-9 pl-3 text-sm font-medium text-black focus:border-blue focus:shadow-[0_0_0_3px_var(--color-blue-soft)] focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
    </div>
  );
}
