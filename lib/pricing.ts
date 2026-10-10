import { site } from "@/lib/site";
import type { PriceTier, Product } from "@/lib/types";

// Pure wholesale pricing rules, shared by the UI and server-side checkout so totals always agree.
// All amounts are integer cents.

export type PricingInfo = Pick<Product, "tiers" | "moq" | "casePack">;

/** Upper bound on a single line, to keep accidental huge orders out of checkout. */
export const MAX_LINE_QUANTITY = 100_000;

const currencyFormatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
});

export function formatPrice(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

/** Index of the tier that applies to `quantity` (the highest tier whose minQty is reached). */
export function getTierIndex(tiers: PriceTier[], quantity: number): number {
  let index = 0;
  for (let i = 0; i < tiers.length; i++) {
    if (quantity >= tiers[i].minQty) index = i;
  }
  return index;
}

export function getUnitPrice(tiers: PriceTier[], quantity: number): number {
  return tiers[getTierIndex(tiers, quantity)].unitPrice;
}

/** The lowest per-unit price available ("From $X / unit"). */
export function getFromPrice(tiers: PriceTier[]): number {
  return Math.min(...tiers.map((t) => t.unitPrice));
}

/** "50–199" or "200+" for the tier at `index`. */
export function getTierRangeLabel(tiers: PriceTier[], index: number): string {
  const tier = tiers[index];
  const next = tiers[index + 1];
  return next ? `${tier.minQty}–${next.minQty - 1}` : `${tier.minQty}+`;
}

/** Clamp to the MOQ and round up to a whole number of cases. */
export function normalizeQuantity(product: Pick<Product, "moq" | "casePack">, quantity: number): number {
  const { moq, casePack } = product;
  if (!Number.isFinite(quantity) || quantity < moq) return moq;
  const capped = Math.min(Math.floor(quantity), MAX_LINE_QUANTITY);
  return Math.max(moq, Math.ceil(capped / casePack) * casePack);
}

export function isValidQuantity(product: Pick<Product, "moq" | "casePack">, quantity: number): boolean {
  return (
    Number.isInteger(quantity) &&
    quantity >= product.moq &&
    quantity <= MAX_LINE_QUANTITY &&
    quantity % product.casePack === 0
  );
}

export type LinePrice = {
  tierIndex: number;
  unitPrice: number;
  lineTotal: number;
  /** What the line would cost at the base (first) tier price. */
  baseLineTotal: number;
  savings: number;
};

export function priceLine(product: PricingInfo, quantity: number): LinePrice {
  const tierIndex = getTierIndex(product.tiers, quantity);
  const unitPrice = product.tiers[tierIndex].unitPrice;
  const lineTotal = unitPrice * quantity;
  const baseLineTotal = product.tiers[0].unitPrice * quantity;
  return { tierIndex, unitPrice, lineTotal, baseLineTotal, savings: baseLineTotal - lineTotal };
}

export type CartTotals = {
  subtotal: number;
  baseTotal: number;
  savings: number;
  units: number;
};

export function priceCart(lines: (PricingInfo & { quantity: number })[]): CartTotals {
  return lines.reduce<CartTotals>(
    (totals, line) => {
      const p = priceLine(line, line.quantity);
      return {
        subtotal: totals.subtotal + p.lineTotal,
        baseTotal: totals.baseTotal + p.baseLineTotal,
        savings: totals.savings + p.savings,
        units: totals.units + line.quantity,
      };
    },
    { subtotal: 0, baseTotal: 0, savings: 0, units: 0 },
  );
}
