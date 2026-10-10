"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartProduct } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: CartProduct;
  quantity?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Adds to the browser cart and briefly confirms. */
export function AddToCartButton({ product, quantity = 1, disabled, size = "sm", className }: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <Button
      type="button"
      size={size}
      disabled={disabled}
      onClick={() => {
        add(product, quantity);
        setAdded(true);
      }}
      className={cn("relative z-10", className)}
    >
      {added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
      {disabled ? "Out of stock" : added ? "Added" : "Add to cart"}
      <span className="sr-only" role="status">
        {added ? `${product.name} added to cart` : ""}
      </span>
    </Button>
  );
}
