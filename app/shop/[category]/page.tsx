import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop/shop-page";
import { getCategories, getCategory } from "@/lib/catalog";

// Every real category is prerendered by generateStaticParams, so navigations to them are instant.
// Unknown categories are allowed to block so they return a proper 404 status instead of a streamed shell.
export const instant = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return {
    title: `${category.name} wholesale`,
    description: category.description,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

export default async function Page({ params, searchParams }: PageProps<"/shop/[category]">) {
  const category = await getCategory((await params).category);
  if (!category) notFound();
  return <ShopPage category={category} searchParams={searchParams} />;
}
