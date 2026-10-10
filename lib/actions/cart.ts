"use server";

import { getProductsBySlugs } from "@/lib/catalog";
import type { CartProduct } from "@/lib/cart-store";
import type { StockStatus } from "@/lib/types";

export type LiveCartProduct = CartProduct & { stock: StockStatus };

/** Current catalog data for the products in a browser cart. Unknown slugs are omitted. */
export async function getLiveCartProducts(slugs: unknown): Promise<LiveCartProduct[]> {
  if (!Array.isArray(slugs)) return [];
  const clean = slugs.filter((s): s is string => typeof s === "string" && s.length <= 200).slice(0, 100);
  const products = await getProductsBySlugs(clean);
  return products.map((p) => ({
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    image: p.images[0].src,
    moq: p.moq,
    casePack: p.casePack,
    tiers: p.tiers,
    stock: p.stock,
  }));
}
