"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlacedOrder } from "@/lib/order-email";
import { safeJSONStorage } from "@/lib/safe-storage";

// Order history saved only in this browser (shown on the success page and in My Account). Newest first.

export type StoredOrder = PlacedOrder & {
  /** Local account (lowercase email) that was signed in when the order was placed. */
  account?: string;
};

type OrderState = {
  orders: StoredOrder[];
  addOrder: (order: StoredOrder) => void;
  /** Forget orders belonging to a local account (used when deleting account data). */
  removeForAccount: (account: string) => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders].slice(0, 100) })),
      removeForAccount: (account) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.account !== account && o.email.toLowerCase() !== account),
        })),
    }),
    {
      name: "ce-orders",
      version: 3,
      storage: safeJSONStorage,
      migrate: (persisted, version) => {
        const orders = version === 2 ? ((persisted as { orders?: StoredOrder[] })?.orders ?? []) : [];
        return { orders: orders.map((o) => ({ ...o, phone: o.phone ?? "", notes: o.notes ?? "" })) };
      },
    },
  ),
);

/** Orders placed while signed in to this account, or with its email address. */
export function ordersForAccount(orders: StoredOrder[], account: string) {
  return orders.filter((o) => o.account === account || o.email.toLowerCase() === account);
}
