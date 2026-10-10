import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart", href: routes.cart }, { label: "Checkout" }]} />
      <h1 className="mt-6 font-serif text-4xl font-medium text-navy sm:text-5xl">Checkout</h1>
      <p className="mt-3 max-w-2xl text-muted">
        No card details needed. We&apos;ll email you to confirm shipping, your total and how to pay.
      </p>
      <CheckoutForm />
    </div>
  );
}
