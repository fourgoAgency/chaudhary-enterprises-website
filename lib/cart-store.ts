"use client";

import { useMemo, useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StorefrontCatalog, StorefrontItem } from "@/lib/catalog";
import { normalizeQuantity } from "@/lib/pricing";
import { safeJSONStorage } from "@/lib/safe-storage";

// Cart saved in the browser. It stores only product slugs and quantities: names, prices and stock
// are always read from the catalog, and the server re-prices every order.

export type CartLine = { slug: string; quantity: number };

type CartState = {
  lines: CartLine[];
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === slug);
          const lines = existing
            ? state.lines.map((l) =>
                l.slug === slug ? { slug, quantity: normalizeQuantity(l.quantity + quantity) } : l,
              )
            : [...state.lines, { slug, quantity: normalizeQuantity(quantity) }];
          return { lines };
        }),
      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.slug === slug ? { slug, quantity: normalizeQuantity(quantity) } : l)),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "ce-cart",
      version: 3,
      storage: safeJSONStorage,
      // v2 lines carried a price snapshot; keep just slug + quantity. Older carts start fresh.
      migrate: (persisted, version) => {
        if (version === 2 && persisted && typeof persisted === "object" && "lines" in persisted) {
          const lines = (persisted as { lines: unknown[] }).lines.flatMap((l) => {
            const { slug, quantity } = (l ?? {}) as Partial<CartLine>;
            return typeof slug === "string" ? [{ slug, quantity: normalizeQuantity(Number(quantity)) }] : [];
          });
          return { lines };
        }
        return { lines: [] };
      },
    },
  ),
);

export type PricedCartLine = StorefrontItem & { quantity: number };

/** Cart lines joined with current catalog data. Products no longer sold are listed in `missing`. */
export function usePricedCart(catalog: StorefrontCatalog) {
  const lines = useCart((s) => s.lines);
  return useMemo(() => {
    const items: PricedCartLine[] = [];
    const missing: string[] = [];
    for (const line of lines) {
      const product = catalog[line.slug];
      if (product) items.push({ ...product, quantity: line.quantity });
      else missing.push(line.slug);
    }
    return { items, missing };
  }, [lines, catalog]);
}

const noopSubscribe = () => () => {};

/** False during SSR and the first client render, so browser-stored values don't cause hydration mismatches. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
