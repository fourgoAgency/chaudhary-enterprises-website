"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSessionKey } from "@/lib/account-store";
import { safeJSONStorage } from "@/lib/safe-storage";

// Wishlists saved in this browser: one guest list, plus one per local account (keyed by email).
// When someone logs in, the guest list is merged into their account's list.

const GUEST = "guest";

type WishlistState = {
  lists: Record<string, string[]>;
  toggle: (owner: string | null, slug: string) => void;
  remove: (owner: string | null, slug: string) => void;
  clear: (owner: string | null) => void;
  /** Move the guest list into an account's list. */
  mergeGuestInto: (owner: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      lists: {},
      toggle: (owner, slug) =>
        set((s) => {
          const key = owner ?? GUEST;
          const list = s.lists[key] ?? [];
          const next = list.includes(slug) ? list.filter((x) => x !== slug) : [slug, ...list];
          return { lists: { ...s.lists, [key]: next } };
        }),
      remove: (owner, slug) =>
        set((s) => {
          const key = owner ?? GUEST;
          return { lists: { ...s.lists, [key]: (s.lists[key] ?? []).filter((x) => x !== slug) } };
        }),
      clear: (owner) =>
        set((s) => {
          const lists = { ...s.lists };
          delete lists[owner ?? GUEST];
          return { lists };
        }),
      mergeGuestInto: (owner) =>
        set((s) => {
          const guest = s.lists[GUEST] ?? [];
          if (!guest.length) return s;
          const merged = [...new Set([...guest, ...(s.lists[owner] ?? [])])];
          const lists = { ...s.lists, [owner]: merged };
          delete lists[GUEST];
          return { lists };
        }),
    }),
    { name: "ce-wishlist", version: 1, storage: safeJSONStorage },
  ),
);

const EMPTY: string[] = [];

/** The current visitor's wishlist (account list when signed in, guest list otherwise). */
export function useWishlist() {
  const owner = useSessionKey();
  const slugs = useWishlistStore((s) => s.lists[owner ?? GUEST] ?? EMPTY);
  const toggle = useWishlistStore((s) => s.toggle);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);

  // Merge any guest items as soon as someone is signed in.
  useEffect(() => {
    if (owner) useWishlistStore.getState().mergeGuestInto(owner);
  }, [owner]);

  return {
    slugs,
    has: (slug: string) => slugs.includes(slug),
    toggle: (slug: string) => toggle(owner, slug),
    remove: (slug: string) => remove(owner, slug),
    clear: () => clear(owner),
  };
}
