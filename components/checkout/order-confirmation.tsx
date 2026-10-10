"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/cart-store";
import { useOrders } from "@/lib/order-store";
import { formatPrice } from "@/lib/pricing";
import { routes, site } from "@/lib/site";

export function OrderConfirmation({ orderNumber }: { orderNumber?: string }) {
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.number === orderNumber));

  if (!hydrated) return <div className="mx-auto h-80 max-w-2xl animate-pulse bg-ivory" aria-busy="true" />;

  return (
    <div className="mx-auto max-w-2xl">
      <CheckCircle2 className="size-10 text-emerald-700" strokeWidth={1.5} aria-hidden />
      <h1 className="mt-4 font-serif text-4xl font-medium text-navy sm:text-5xl">Thank you for your order</h1>
      {order ? (
        <>
          <p className="mt-4 text-muted">
            Thanks, {order.name}. Your order <strong className="text-ink">{order.number}</strong> has been sent to our
            team. We&apos;ll email {order.email} to confirm shipping, your total and how to pay. No payment has been
            taken yet.
          </p>

          <div className="mt-8 border border-line bg-white">
            <ul className="divide-y divide-line">
              {order.lines.map((line) => (
                <li key={line.slug} className="flex justify-between gap-4 px-5 py-3 text-sm">
                  <span>
                    {line.name}
                    <span className="block text-xs text-muted">
                      {line.quantity} × {formatPrice(line.price)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line bg-ivory-light px-5 py-3 text-sm">
              <span className="font-semibold text-navy">Subtotal ({order.totals.items} items)</span>
              <span className="font-semibold text-navy tabular-nums">{formatPrice(order.totals.subtotal)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">Ship to: {order.shipTo}</p>
        </>
      ) : (
        <p className="mt-4 text-muted">
          Your order has been sent. We&apos;ll email you to confirm shipping, your total and how to pay.
        </p>
      )}

      <p className="mt-6 text-sm text-muted">
        Questions? Call{" "}
        <a href={site.contact.phoneHref} className="text-navy underline underline-offset-4">
          {site.contact.phone}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${site.contact.email}`} className="text-navy underline underline-offset-4">
          {site.contact.email}
        </a>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={routes.shop}>Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={routes.account}>View order history</Link>
        </Button>
      </div>
    </div>
  );
}
