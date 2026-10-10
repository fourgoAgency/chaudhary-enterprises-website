import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard, ProductGrid } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductTabs } from "@/components/product/product-tabs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StockBadge } from "@/components/product/stock-badge";
import { ProductBadge } from "@/components/product/product-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { PLACEHOLDER_IMAGE } from "@/data/products";
import { getAllProducts, getCategory, getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { routes, site } from "@/lib/site";
import type { Product } from "@/lib/types";

// Every real product is prerendered by generateStaticParams, so navigations to them are instant.
// Unknown slugs are allowed to block so they return a proper 404 status instead of a streamed shell.
export const instant = false;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  const description = `${product.description} ${formatPrice(product.price)}.`;
  const image = product.images[0].src;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      ...(image !== PLACEHOLDER_IMAGE ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}

const availability = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  out_of_stock: "https://schema.org/OutOfStock",
} as const;

function ProductJsonLd({ product }: { product: Product }) {
  const images = product.images.filter((i) => i.src !== PLACEHOLDER_IMAGE).map((i) => new URL(i.src, site.url).href);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        ...(product.upc && /^\d{12}$/.test(product.upc) ? { gtin12: product.upc } : {}),
        brand: { "@type": "Brand", name: product.brand },
        description: product.description,
        ...(images.length ? { image: images } : {}),
        offers: {
          "@type": "Offer",
          priceCurrency: site.currency,
          price: (product.price / 100).toFixed(2),
          availability: availability[product.stock],
          url: new URL(`/product/${product.slug}`, site.url).href,
          seller: { "@id": `${site.url}/#organization` },
        },
      }}
    />
  );
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();
  const [category, related] = await Promise.all([getCategory(product.category), getRelatedProducts(product)]);

  const policyLink = "font-semibold text-blue underline underline-offset-4 hover:text-blue-hover";
  const tabs = [
    {
      value: "description",
      label: "Description",
      content: <p>{product.description}</p>,
    },
    {
      value: "specifications",
      label: "Specifications",
      content: (
        <dl className="divide-y divide-line border-y border-line">
          {[
            { label: "Brand", value: product.brand },
            { label: "SKU", value: product.sku },
            ...(product.upc ? [{ label: "UPC", value: product.upc }] : []),
            ...product.specs,
          ].map((row) => (
            <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="text-muted">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      value: "shipping",
      label: "Shipping & Returns",
      content: (
        <div className="space-y-4">
          <p>
            We ship to addresses across the United States. After you place your order, our team contacts you to confirm
            availability, shipping and payment. No payment is taken on this website.
          </p>
          <p>
            Processing times, carriers and delivery estimates are in our{" "}
            <Link href="/shipping-policy" className={policyLink}>
              Shipping Policy
            </Link>
            . Returns are covered by our{" "}
            <Link href="/returns-policy" className={policyLink}>
              Returns &amp; Refund Policy
            </Link>
            .
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Shop", href: routes.shop },
            ...(category ? [{ label: category.name, href: `${routes.shop}/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <ProductGallery images={product.images} badge={<ProductBadge product={product} />} />

          <div>
            <p className="font-medium text-muted">{product.brand}</p>
            <h1 className="mt-1 text-3xl sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <StockBadge status={product.stock} />
              <span>SKU {product.sku}</span>
              {product.upc && <span>UPC {product.upc}</span>}
            </div>

            <div className="mt-7">
              <PurchasePanel
                product={{ slug: product.slug, name: product.name, price: product.price, stock: product.stock }}
              />
            </div>

            {product.highlights.length > 0 && (
              <div className="mt-8 border-t border-line pt-6">
                <h2 className="text-lg">Highlights</h2>
                <ul className="mt-3 space-y-2">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <Check className="mt-1 size-4 shrink-0 text-blue" aria-hidden strokeWidth={2.5} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <ProductTabs tabs={tabs} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-blue-tint">
          <div className="container-site py-14 sm:py-16">
            <SectionHeading title="You may also like" highlight="like" />
            <ProductGrid className="mt-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}

      <ProductJsonLd product={product} />
    </>
  );
}
