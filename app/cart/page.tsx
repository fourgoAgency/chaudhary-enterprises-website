import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-6 font-serif text-4xl font-medium text-navy sm:text-5xl">Your cart</h1>
      <CartView />
    </div>
  );
}
