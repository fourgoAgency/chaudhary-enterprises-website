"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { useCart, useHydrated, usePricedCart, type PricedCartLine } from "@/lib/cart-store";
import type { StorefrontCatalog } from "@/lib/catalog";
import { formatPrice, priceCart } from "@/lib/pricing";
import { routes } from "@/lib/site";

export function CartView({ catalog }: { catalog: StorefrontCatalog }) {
  const hydrated = useHydrated();
  const { items, missing } = usePricedCart(catalog);
  const remove = useCart((s) => s.remove);

  if (!hydrated) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-black/25 px-6 py-16 text-center sm:py-20">
        <ShoppingBag className="mx-auto size-10 text-blue" strokeWidth={1.5} aria-hidden />
        <p className="mt-4 text-xl font-bold">Your cart is empty</p>
        <p className="mt-1 text-muted">Browse the store and add something you like.</p>
        <Button asChild className="mt-6">
          <Link href={routes.shop}>Start shopping</Link>
        </Button>
      </div>
    );
  }

  const totals = priceCart(items);
  const unavailable = items.filter((l) => l.stock === "out_of_stock");

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10">
      <section aria-label="Cart items">
        {missing.length > 0 && (
          <div
            role="status"
            className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-blue bg-blue-tint px-4 py-3 text-sm"
          >
            <p className="flex-1">
              {missing.length === 1 ? "A product" : `${missing.length} products`} in your cart{" "}
              {missing.length === 1 ? "is" : "are"} no longer available and won&apos;t be ordered.
            </p>
            <Button size="sm" variant="outline" onClick={() => missing.forEach(remove)}>
              OK
            </Button>
          </div>
        )}

        <div className="hidden grid-cols-[1fr_8rem_7rem] gap-4 border-b border-line pb-3 text-sm font-semibold text-muted sm:grid">
          <span>Product</span>
          <span>Quantity</span>
          <span className="text-right">Total</span>
        </div>
        <ul>
          {items.map((line) => (
            <CartLineRow key={line.slug} line={line} />
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-6">
          <Link href={routes.shop}>
            <ArrowLeft aria-hidden />
            Continue shopping
          </Link>
        </Button>
      </section>

      <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-xl">Order summary</h2>
          <dl className="mt-5 border-t border-line pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-semibold">
                Subtotal ({totals.items} {totals.items === 1 ? "item" : "items"})
              </dt>
              <dd className="text-2xl font-bold text-blue tabular-nums">{formatPrice(totals.subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted">
            Shipping and tax confirmed with your order. No payment is taken online.
          </p>
          {unavailable.length > 0 && <FieldError>Remove out-of-stock items to continue.</FieldError>}
          {unavailable.length > 0 ? (
            <Button size="lg" className="mt-5 w-full" disabled>
              Proceed to checkout
            </Button>
          ) : (
            <Button asChild size="lg" className="mt-5 w-full">
              <Link href={routes.checkout}>Proceed to checkout</Link>
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

function CartLineRow({ line }: { line: PricedCartLine }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const href = `/product/${line.slug}`;

  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[1fr_8rem_7rem] sm:items-center">
      <div className="contents sm:flex sm:gap-4">
        <Link href={href} className="relative size-20 shrink-0 rounded-md bg-blue-tint" tabIndex={-1} aria-hidden>
          <span className="absolute inset-1.5 overflow-hidden rounded bg-white">
            <Image src={line.image} alt="" fill sizes="5rem" className="object-contain" />
          </span>
        </Link>
        <div className="min-w-0">
          <p className="text-sm text-muted">{line.brand}</p>
          <h3 className="text-[15px] leading-snug font-semibold tracking-normal">
            <Link href={href} className="hover:text-blue">
              {line.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted tabular-nums">{formatPrice(line.price)} each</p>
          {line.stock === "out_of_stock" && <FieldError>Out of stock</FieldError>}
          <button
            type="button"
            onClick={() => remove(line.slug)}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-blue"
          >
            <Trash2 className="size-4" aria-hidden />
            Remove<span className="sr-only"> {line.name}</span>
          </button>
        </div>
      </div>

      <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:contents">
        <QuantityStepper
          id={`qty-${line.slug}`}
          size="sm"
          value={line.quantity}
          onChange={(q) => setQuantity(line.slug, q)}
          aria-label={`Quantity for ${line.name}`}
        />
        <p className="font-bold tabular-nums sm:text-right">{formatPrice(line.price * line.quantity)}</p>
      </div>
    </li>
  );
}

function CartSkeleton() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]" aria-busy="true" aria-label="Loading cart">
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-blue-tint" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-lg bg-blue-tint" />
    </div>
  );
}
