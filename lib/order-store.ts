"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PlacedOrder } from "@/lib/order-email";

// Order history saved only in this browser (shown in My Account). Newest first.

type OrderState = {
  orders: PlacedOrder[];
  addOrder: (order: PlacedOrder) => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders].slice(0, 100) })),
    }),
    { name: "ce-orders", version: 2, storage: createJSONStorage(() => localStorage), migrate: () => ({ orders: [] }) },
  ),
);
