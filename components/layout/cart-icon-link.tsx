"use client";

import { ShoppingBag } from "lucide-react";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { useCart, useHydrated } from "@/lib/cart-store";
import { routes } from "@/lib/site";

/** Cart icon with the number of products (lines) in the cart. */
export function CartIconLink() {
  const lineCount = useCart((s) => s.lines.length);
  const hydrated = useHydrated();
  return <HeaderIconLink href={routes.cart} label="Cart" icon={ShoppingBag} count={hydrated ? lineCount : 0} />;
}
