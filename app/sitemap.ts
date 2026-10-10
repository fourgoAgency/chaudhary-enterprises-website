import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/lib/catalog";
import { policies, routes, site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const url = (path: string) => new URL(path, site.url).toString();

  return [
    { url: url(routes.home), changeFrequency: "weekly", priority: 1 },
    { url: url(routes.shop), changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({
      url: url(`${routes.shop}/${c.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: url(`/product/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.images.map((i) => url(i.src)),
    })),
    ...policies.map((p) => ({ url: url(`/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
