import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";

export const metadata: Metadata = {
  title: "Shop wholesale products",
  description:
    "Browse wholesale products by category with tiered bulk pricing, minimum order quantities and case packs.",
  alternates: { canonical: "/shop" },
};

export default function Page({ searchParams }: PageProps<"/shop">) {
  return <ShopPage searchParams={searchParams} />;
}
