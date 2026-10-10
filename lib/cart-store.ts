"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { normalizeQuantity } from "@/lib/pricing";
import type { Product } from "@/lib/types";

// Cart saved in the browser (localStorage). Lines keep a snapshot of the price for display only;
// order totals are always recalculated on the server from the catalog.

export type CartProduct = Pick<Product, "slug" | "sku" | "name" | "price"> & { image: string };

export type CartLine = CartProduct & { quantity: number };

type CartState = {
  lines: CartLine[];
  add: (product: CartProduct, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Refresh lines from current catalog data; products no longer sold are removed. Returns removed names. */
  sync: (live: CartProduct[]) => string[];
};

/** Copy only the fields a cart line stores (callers may pass extra props such as stock). */
function toLine({ slug, sku, name, image, price }: CartProduct): CartProduct {
  return { slug, sku, name, image, price };
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === product.slug
                  ? { ...toLine(product), quantity: normalizeQuantity(l.quantity + quantity) }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...toLine(product), quantity: normalizeQuantity(quantity) }] };
        }),
      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.slug === slug ? { ...l, quantity: normalizeQuantity(quantity) } : l)),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      sync: (live) => {
        const bySlug = new Map(live.map((p) => [p.slug, p]));
        const { lines } = get();
        const removed = lines.filter((l) => !bySlug.has(l.slug)).map((l) => l.name);
        set({
          lines: lines.flatMap((l) => {
            const p = bySlug.get(l.slug);
            return p ? [{ ...toLine(p), quantity: l.quantity }] : [];
          }),
        });
        return removed;
      },
    }),
    {
      name: "ce-cart",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v1 carts held wholesale case quantities; start those fresh.
      migrate: () => ({ lines: [] }),
    },
  ),
);

const noopSubscribe = () => () => {};

/** False during SSR and the first client render, so browser-stored values don't cause hydration mismatches. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
