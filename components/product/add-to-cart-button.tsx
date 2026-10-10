"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  slug: string;
  name: string;
  quantity?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
  onAdded?: () => void;
};

/** Adds to the browser cart and briefly confirms. */
export function AddToCartButton({
  slug,
  name,
  quantity = 1,
  disabled,
  size = "md",
  variant = "primary",
  className,
  onAdded,
}: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <Button
      type="button"
      size={size}
      variant={added ? "secondary" : variant}
      disabled={disabled}
      onClick={() => {
        add(slug, quantity);
        setAdded(true);
        onAdded?.();
      }}
      className={cn("relative z-10", className)}
    >
      {added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
      {disabled ? "Out of stock" : added ? "Added" : "Add to Cart"}
      <span className="sr-only" role="status">
        {added ? `${name} added to cart` : ""}
      </span>
    </Button>
  );
}
