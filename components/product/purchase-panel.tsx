"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button } from "@/components/ui/button";
import { useCart, type CartProduct } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";
import { routes } from "@/lib/site";
import type { StockStatus } from "@/lib/types";

export function PurchasePanel({ product }: { product: CartProduct & { stock: StockStatus } }) {
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState<number | null>(null);
  const outOfStock = product.stock === "out_of_stock";

  return (
    <div>
      <p className="text-3xl font-semibold text-navy tabular-nums">{formatPrice(product.price)}</p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-ink">
            Quantity
          </label>
          <QuantityStepper
            id="quantity"
            value={quantity}
            onChange={(q) => {
              setQuantity(q);
              setAdded(null);
            }}
            disabled={outOfStock}
          />
        </div>
        <Button
          size="lg"
          className="min-w-48 flex-1"
          disabled={outOfStock}
          onClick={() => {
            add(product, quantity);
            setAdded(quantity);
          }}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>

      {quantity > 1 && (
        <p className="mt-3 text-sm text-muted">
          Total for {quantity}: <span className="font-semibold text-ink">{formatPrice(product.price * quantity)}</span>
        </p>
      )}

      {added !== null && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 border border-emerald-800/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          <Check className="size-4 shrink-0" aria-hidden />
          Added {added} to your cart.
          <Link href={routes.cart} className="ml-auto font-semibold underline underline-offset-4">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
