import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { getStorefrontCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
  alternates: { canonical: "/wishlist" },
};

export default async function WishlistPage() {
  const catalog = await getStorefrontCatalog();
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Wishlist</h1>
      <WishlistView catalog={catalog} />
    </div>
  );
}
