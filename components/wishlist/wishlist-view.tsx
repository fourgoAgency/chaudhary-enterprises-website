"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { StockBadge } from "@/components/product/stock-badge";
import { Button } from "@/components/ui/button";
import { useCart, useHydrated } from "@/lib/cart-store";
import type { StorefrontCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { routes } from "@/lib/site";
import { useWishlist } from "@/lib/wishlist-store";

export function WishlistView({ catalog }: { catalog: StorefrontCatalog }) {
  const hydrated = useHydrated();
  const wishlist = useWishlist();
  const addToCart = useCart((s) => s.add);

  if (!hydrated) return <div className="mt-8 h-72 animate-pulse rounded-lg bg-blue-tint" aria-busy="true" />;

  // Products that are no longer sold are simply skipped.
  const items = wishlist.slugs.flatMap((slug) => catalog[slug] ?? []);

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-black/25 px-6 py-16 text-center sm:py-20">
        <Heart className="mx-auto size-10 text-blue" strokeWidth={1.5} aria-hidden />
        <p className="mt-4 text-xl font-bold">Your wishlist is empty</p>
        <p className="mt-1 text-muted">Tap the heart on any product to save it for later.</p>
        <Button asChild className="mt-6">
          <Link href={routes.shop}>Start shopping</Link>
        </Button>
      </div>
    );
  }

  const inStock = items.filter((i) => i.stock !== "out_of_stock");

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          {items.length} saved {items.length === 1 ? "product" : "products"}
        </p>
        <Button
          disabled={inStock.length === 0}
          onClick={() => {
            for (const item of inStock) {
              addToCart(item.slug, 1);
              wishlist.remove(item.slug);
            }
          }}
        >
          <ShoppingBag aria-hidden />
          Move all to cart
        </Button>
      </div>

      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item) => {
          const href = `/product/${item.slug}`;
          return (
            <li
              key={item.slug}
              className="grid grid-cols-[5rem_1fr] gap-4 py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center"
            >
              <Link
                href={href}
                className="relative size-20 rounded-md bg-blue-tint sm:size-24"
                tabIndex={-1}
                aria-hidden
              >
                <span className="absolute inset-1.5 overflow-hidden rounded bg-white">
                  <Image src={item.image} alt="" fill sizes="6rem" className="object-contain" />
                </span>
              </Link>
              <div className="min-w-0">
                <p className="text-sm text-muted">{item.brand}</p>
                <h2 className="text-[15px] leading-snug font-semibold tracking-normal">
                  <Link href={href} className="hover:text-blue">
                    {item.name}
                  </Link>
                </h2>
                <p className="mt-1 font-bold text-blue tabular-nums">{formatPrice(item.price)}</p>
                <StockBadge status={item.stock} className="mt-1" />
              </div>
              <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-3">
                <AddToCartButton slug={item.slug} name={item.name} size="sm" disabled={item.stock === "out_of_stock"} />
                <Button variant="ghost" size="sm" onClick={() => wishlist.remove(item.slug)}>
                  <Trash2 aria-hidden />
                  Remove<span className="sr-only"> {item.name}</span>
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
