import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getStorefrontCatalog } from "@/lib/catalog";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
  alternates: { canonical: "/checkout" },
};

export default async function CheckoutPage() {
  const catalog = await getStorefrontCatalog();
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart", href: routes.cart }, { label: "Checkout" }]} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Checkout</h1>
      <p className="mt-2 max-w-2xl text-muted">
        No payment is taken on this website. Place your order and our team will contact you to arrange payment.
      </p>
      <CheckoutForm catalog={catalog} />
    </div>
  );
}
