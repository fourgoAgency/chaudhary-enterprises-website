"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatPrice, MAX_LINE_QUANTITY } from "@/lib/pricing";
import { routes } from "@/lib/site";
import type { StockStatus } from "@/lib/types";

type PurchasePanelProps = {
  product: { slug: string; name: string; price: number; stock: StockStatus };
};

export function PurchasePanel({ product }: PurchasePanelProps) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === "out_of_stock";

  return (
    <div>
      <p className="text-3xl font-bold text-blue tabular-nums">{formatPrice(product.price)}</p>

      <div className="mt-6">
        <label htmlFor="quantity" className="mb-2 block text-sm font-semibold">
          Quantity <span className="font-normal text-muted">(max {MAX_LINE_QUANTITY})</span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper id="quantity" value={quantity} onChange={setQuantity} disabled={outOfStock} />
          {quantity > 1 && (
            <p className="text-sm text-muted">
              Total{" "}
              <span className="font-semibold text-black tabular-nums">{formatPrice(product.price * quantity)}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton
          slug={product.slug}
          name={product.name}
          quantity={quantity}
          size="lg"
          disabled={outOfStock}
          className="w-full"
          onAdded={() => setJustAdded(true)}
        />
        <Button
          size="lg"
          variant="secondary"
          disabled={outOfStock}
          className="w-full"
          onClick={() => {
            add(product.slug, quantity);
            router.push(routes.checkout);
          }}
        >
          <Zap aria-hidden />
          Buy Now
        </Button>
      </div>
      <WishlistButton slug={product.slug} name={product.name} variant="full" className="mt-3 w-full" />

      {justAdded && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 rounded-md border border-blue bg-blue-tint px-4 py-3 text-sm font-medium"
        >
          <Check className="size-4 shrink-0 text-blue" aria-hidden strokeWidth={2.5} />
          Added to your cart.
          <Link href={routes.cart} className="ml-auto font-semibold text-blue underline underline-offset-4">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
