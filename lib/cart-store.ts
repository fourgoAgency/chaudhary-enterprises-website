"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { normalizeQuantity, type PricingInfo } from "@/lib/pricing";
import type { Product } from "@/lib/types";

// Cart saved in the browser (localStorage). Lines keep a snapshot of pricing for display only;
// order totals are always recalculated on the server from the catalog.

export type CartLine = PricingInfo & {
  slug: string;
  sku: string;
  name: string;
  image: string;
  quantity: number;
};

export type CartProduct = Pick<Product, "slug" | "sku" | "name" | "moq" | "casePack" | "tiers"> & { image: string };

type CartState = {
  lines: CartLine[];
  add: (product: CartProduct, quantity: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product, quantity) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === product.slug
                  ? { ...l, ...product, quantity: normalizeQuantity(product, l.quantity + quantity) }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...product, quantity: normalizeQuantity(product, quantity) }] };
        }),
      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.slug === slug ? { ...l, quantity: normalizeQuantity(l, quantity) } : l)),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "ce-cart", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

/** Total number of units in the cart. */
export const selectItemCount = (state: CartState) => state.lines.reduce((sum, l) => sum + l.quantity, 0);

const noopSubscribe = () => () => {};

/** False during SSR and the first client render, so browser-stored values don't cause hydration mismatches. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
