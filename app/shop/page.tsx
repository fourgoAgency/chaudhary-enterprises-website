import type { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Shop genuine, brand-new products by category, with delivery across the United States.",
  alternates: { canonical: "/shop" },
};

export default function Page({ searchParams }: PageProps<"/shop">) {
  return <ShopPage searchParams={searchParams} />;
}
