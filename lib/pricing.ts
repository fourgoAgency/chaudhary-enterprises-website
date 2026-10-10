import { site } from "@/lib/site";

// Pricing helpers shared by the UI and the server-side order handler. All amounts are integer cents.

/** Upper bound on a single cart line. */
export const MAX_LINE_QUANTITY = 10;

const currencyFormatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
});

export function formatPrice(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

/** A whole number between 1 and MAX_LINE_QUANTITY. */
export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.min(Math.floor(quantity), MAX_LINE_QUANTITY);
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_LINE_QUANTITY;
}

export type CartTotals = { subtotal: number; items: number };

export function priceCart(lines: { price: number; quantity: number }[]): CartTotals {
  return lines.reduce<CartTotals>(
    (totals, line) => ({ subtotal: totals.subtotal + line.price * line.quantity, items: totals.items + line.quantity }),
    { subtotal: 0, items: 0 },
  );
}
