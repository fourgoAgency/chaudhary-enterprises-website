"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { useHydrated } from "@/lib/cart-store";
import { orderDetailsText } from "@/lib/order-email";
import { useOrders } from "@/lib/order-store";
import { formatPrice } from "@/lib/pricing";
import { routes, site } from "@/lib/site";

export function OrderConfirmation({ orderNumber }: { orderNumber?: string }) {
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.number === orderNumber));

  if (!hydrated)
    return <div className="mx-auto h-80 max-w-2xl animate-pulse rounded-lg bg-blue-tint" aria-busy="true" />;

  return (
    <div className="mx-auto max-w-2xl">
      <CircleCheck className="size-12 text-blue" strokeWidth={1.75} aria-hidden />
      <h1 className="mt-4 text-3xl sm:text-4xl">Thank you for your order!</h1>
      <p className="mt-3 text-lg">
        Your order has been sent to our team. Our team will contact you to confirm availability, shipping and payment.
        No payment has been taken.
      </p>

      {order ? (
        <>
          <div className="mt-8 rounded-lg border border-line">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line bg-blue-tint px-5 py-4">
              <p>
                Order number <strong className="text-blue">{order.number}</strong>
              </p>
              <p className="text-sm text-muted">
                {new Date(order.placedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
              </p>
            </div>
            <ul className="divide-y divide-line">
              {order.lines.map((line) => (
                <li key={line.slug} className="flex justify-between gap-4 px-5 py-3 text-sm">
                  <span>
                    {line.name}
                    <span className="block text-muted tabular-nums">
                      {line.quantity} × {formatPrice(line.price)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line px-5 py-3">
              <span className="font-semibold">Subtotal ({order.totals.items} items)</span>
              <span className="font-bold text-blue tabular-nums">{formatPrice(order.totals.subtotal)}</span>
            </div>
            <div className="border-t border-line px-5 py-3 text-sm text-muted">
              Ship to: {order.shipTo}
              <br />A confirmation has been sent to {order.email}.
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <CopyButton text={orderDetailsText(order)} label="Copy order details" />
            <Button asChild>
              <Link href={routes.shop}>Continue shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={routes.account}>View order history</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={routes.shop}>Continue shopping</Link>
          </Button>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        Questions? Call{" "}
        <a href={site.contact.phoneHref} className="font-semibold text-blue underline underline-offset-4">
          {site.contact.phone}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-blue underline underline-offset-4">
          {site.contact.email}
        </a>
        .
      </p>
    </div>
  );
}
