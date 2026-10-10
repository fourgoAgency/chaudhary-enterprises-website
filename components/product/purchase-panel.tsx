"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartProduct } from "@/lib/cart-store";
import { formatPrice, getTierRangeLabel, MAX_LINE_QUANTITY, normalizeQuantity, priceLine } from "@/lib/pricing";
import { routes, site } from "@/lib/site";
import type { StockStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type PurchasePanelProps = {
  product: CartProduct & { stock: StockStatus };
};

export function PurchasePanel({ product }: PurchasePanelProps) {
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(product.moq);
  // Raw text while typing, so the field can be cleared and retyped; normalised on blur.
  const [draft, setDraft] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { tiers, moq, casePack } = product;
  const line = priceLine(product, quantity);
  const nextTier = tiers[line.tierIndex + 1];
  const outOfStock = product.stock === "out_of_stock";

  function commit(value: number) {
    setQuantity(normalizeQuantity(product, value));
    setDraft(null);
    setAdded(false);
  }

  function addToCart() {
    add(product, quantity);
    setAdded(true);
  }

  const quoteHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `Bulk quote request: ${product.name} (${product.sku})`,
  )}`;

  return (
    <div>
      <table className="w-full border border-line bg-white text-sm">
        <caption className="sr-only">Wholesale price tiers</caption>
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            <th scope="col" className="px-4 py-2.5 font-medium">
              Quantity (units)
            </th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">
              Unit price
            </th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const current = i === line.tierIndex;
            return (
              <tr
                key={tier.minQty}
                aria-current={current ? "true" : undefined}
                className={cn("border-b border-line/70 last:border-0", current && "bg-ivory")}
              >
                <td className="px-4 py-2.5 tabular-nums">
                  <span className={cn(current && "font-semibold text-navy")}>{getTierRangeLabel(tiers, i)}</span>
                  {current && <span className="ml-2 text-xs text-gold-dark">Your price</span>}
                </td>
                <td
                  className={cn(
                    "px-4 py-2.5 text-right tabular-nums",
                    current ? "font-semibold text-navy" : "text-ink",
                  )}
                >
                  {formatPrice(tier.unitPrice)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <dl className="mt-4 grid grid-cols-2 gap-px border border-line bg-line text-sm">
        <div className="bg-ivory-light px-4 py-3">
          <dt className="text-xs text-muted">Minimum order</dt>
          <dd className="mt-0.5 font-semibold text-ink">{moq} units</dd>
        </div>
        <div className="bg-ivory-light px-4 py-3">
          <dt className="text-xs text-muted">Case pack</dt>
          <dd className="mt-0.5 font-semibold text-ink">{casePack} units per case</dd>
        </div>
      </dl>

      <div className="mt-6">
        <label htmlFor="quantity" className="text-sm font-semibold text-navy">
          Quantity <span className="font-normal text-muted">(units, in multiples of {casePack})</span>
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <div className="flex h-12 border border-navy/30 bg-white">
            <button
              type="button"
              onClick={() => commit(quantity - casePack)}
              disabled={quantity <= moq || outOfStock}
              aria-label={`Remove one case (${casePack} units)`}
              className="inline-flex w-12 items-center justify-center text-navy hover:bg-ivory disabled:text-muted/40 disabled:hover:bg-transparent"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <input
              id="quantity"
              type="number"
              inputMode="numeric"
              min={moq}
              max={MAX_LINE_QUANTITY}
              step={casePack}
              value={draft ?? quantity}
              disabled={outOfStock}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => draft !== null && commit(Number(draft))}
              onKeyDown={(e) => e.key === "Enter" && draft !== null && commit(Number(draft))}
              aria-describedby="quantity-help"
              className="w-20 border-x border-navy/30 text-center text-base font-semibold text-ink tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => commit(quantity + casePack)}
              disabled={outOfStock}
              aria-label={`Add one case (${casePack} units)`}
              className="inline-flex w-12 items-center justify-center text-navy hover:bg-ivory disabled:text-muted/40"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <p id="quantity-help" className="text-sm text-muted">
            {quantity / casePack} {quantity / casePack === 1 ? "case" : "cases"}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5" aria-live="polite">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">
            {quantity} × {formatPrice(line.unitPrice)}
          </span>
          <span className="text-2xl font-semibold text-navy tabular-nums">{formatPrice(line.lineTotal)}</span>
        </div>
        {line.savings > 0 && (
          <p className="mt-1 text-right text-sm text-emerald-800">
            You save {formatPrice(line.savings)} vs. the base price
          </p>
        )}
        {nextTier && (
          <p className="mt-3 text-sm text-muted">
            Order {nextTier.minQty - quantity} more units to pay{" "}
            <button
              type="button"
              onClick={() => commit(nextTier.minQty)}
              className="font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-dark"
            >
              {formatPrice(nextTier.unitPrice)} per unit
            </button>
            .
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="w-full sm:w-auto sm:flex-1" onClick={addToCart} disabled={outOfStock}>
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto sm:flex-1">
          {/* TODO(phase 6): open the bulk-quote form instead. */}
          <a href={quoteHref}>Request bulk quote</a>
        </Button>
      </div>

      {added && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 border border-emerald-800/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          <Check className="size-4 shrink-0" aria-hidden />
          Added {quantity} units to your cart.
          <Link href={routes.cart} className="ml-auto font-semibold underline underline-offset-4">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
