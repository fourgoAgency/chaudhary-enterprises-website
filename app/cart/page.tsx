import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CartView } from "@/components/cart/cart-view";
import { getStorefrontCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
  alternates: { canonical: "/cart" },
};

export default async function CartPage() {
  // Prices and stock always come from the catalog, never from what the browser saved.
  const catalog = await getStorefrontCatalog();
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Your cart</h1>
      <CartView catalog={catalog} />
    </div>
  );
}
