"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, ShoppingBag, Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button } from "@/components/ui/button";
import { getLiveCartProducts } from "@/lib/actions/cart";
import { useCart, useHydrated, type CartLine } from "@/lib/cart-store";
import { formatPrice, priceCart } from "@/lib/pricing";
import { routes } from "@/lib/site";
import type { StockStatus } from "@/lib/types";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const [removed, setRemoved] = useState<string[]>([]);
  const [stock, setStock] = useState<Record<string, StockStatus>>({});

  // Refresh prices and stock from the catalog once the browser cart has loaded.
  useEffect(() => {
    if (!hydrated) return;
    const slugs = useCart.getState().lines.map((l) => l.slug);
    if (!slugs.length) return;
    let cancelled = false;
    getLiveCartProducts(slugs)
      .then((live) => {
        if (cancelled) return;
        setRemoved(useCart.getState().sync(live));
        setStock(Object.fromEntries(live.map((p) => [p.slug, p.stock])));
      })
      .catch(() => {
        // Keep showing the saved cart; the server re-checks everything when the order is sent.
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-line px-6 py-20 text-center">
        <ShoppingBag className="mx-auto size-8 text-muted" strokeWidth={1.5} aria-hidden />
        <p className="mt-4 font-serif text-2xl text-navy">Your cart is empty</p>
        {removed.length > 0 && <RemovedNotice names={removed} />}
        <p className="mt-2 text-sm text-muted">Browse our products and add something you like.</p>
        <Button asChild className="mt-8">
          <Link href={routes.shop}>Browse products</Link>
        </Button>
      </div>
    );
  }

  const totals = priceCart(lines);
  const unavailable = lines.filter((l) => stock[l.slug] === "out_of_stock");

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
      <section aria-label="Cart items">
        {removed.length > 0 && <RemovedNotice names={removed} />}
        <ul className="border-t border-line">
          {lines.map((line) => (
            <CartLineRow key={line.slug} line={line} outOfStock={stock[line.slug] === "out_of_stock"} />
          ))}
        </ul>
        <Link
          href={routes.shop}
          className="mt-6 inline-block text-sm font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-dark"
        >
          Continue shopping
        </Link>
      </section>

      <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-line bg-white p-6">
          <h2 className="font-serif text-2xl text-navy">Order summary</h2>
          <dl className="mt-5 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-muted">
                Subtotal ({totals.items} {totals.items === 1 ? "item" : "items"})
              </dt>
              <dd className="text-xl font-semibold text-navy tabular-nums">{formatPrice(totals.subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Shipping and any sales tax are confirmed by email with your order. No payment is taken online.
          </p>
          {unavailable.length > 0 && (
            <p role="alert" className="mt-4 text-sm text-red-800">
              Remove out-of-stock items to continue.
            </p>
          )}
          {unavailable.length > 0 ? (
            <Button size="lg" className="mt-6 w-full" disabled>
              Proceed to checkout
            </Button>
          ) : (
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href={routes.checkout}>Proceed to checkout</Link>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

function CartLineRow({ line, outOfStock }: { line: CartLine; outOfStock: boolean }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const href = `/product/${line.slug}`;

  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[6rem_1fr_auto] sm:gap-6">
      <Link href={href} className="relative aspect-square border border-line bg-white" tabIndex={-1} aria-hidden>
        <Image src={line.image} alt="" fill sizes="6rem" className="object-contain p-1.5" />
      </Link>

      <div className="min-w-0">
        <h3 className="font-sans text-[15px] leading-snug font-medium text-ink">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {line.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted tabular-nums">{formatPrice(line.price)} each</p>
        {outOfStock && <p className="mt-1 text-sm font-medium text-red-800">Out of stock</p>}

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <QuantityStepper
            id={`qty-${line.slug}`}
            size="sm"
            value={line.quantity}
            onChange={(q) => setQuantity(line.slug, q)}
            aria-label={`Quantity for ${line.name}`}
          />
          <button
            type="button"
            onClick={() => remove(line.slug)}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-800"
          >
            <Trash2 className="size-4" aria-hidden />
            Remove<span className="sr-only"> {line.name}</span>
          </button>
        </div>
      </div>

      <p className="col-start-2 font-semibold text-navy tabular-nums sm:col-start-3 sm:text-right">
        {formatPrice(line.price * line.quantity)}
      </p>
    </li>
  );
}

function RemovedNotice({ names }: { names: string[] }) {
  return (
    <p role="status" className="mb-4 border border-amber-700/30 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Removed from your cart because they are no longer available: {names.join(", ")}.
    </p>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]" aria-busy="true" aria-label="Loading cart">
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 animate-pulse bg-ivory" />
        ))}
      </div>
      <div className="h-64 animate-pulse bg-ivory" />
    </div>
  );
}
