import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductTabs } from "@/components/product/product-tabs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StockBadge } from "@/components/product/stock-badge";
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

  const tabs = [
    {
      value: "description",
      label: "Description",
      content: (
        <>
          <p>{product.description}</p>
          {product.highlights.length > 0 && (
            <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-gold-dark">
              {product.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </>
      ),
    },
    {
      value: "specifications",
      label: "Specifications",
      content: (
        <dl className="divide-y divide-line border-y border-line text-sm">
          {[
            { label: "Brand", value: product.brand },
            { label: "SKU", value: product.sku },
            ...(product.upc ? [{ label: "UPC", value: product.upc }] : []),
            ...product.specs,
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      value: "shipping",
      label: "Shipping",
      content: (
        <div className="space-y-4">
          <p>
            We ship to addresses across the United States. After you send your order, we confirm availability, shipping
            cost and delivery time by email before anything is charged.
          </p>
          <p>
            Processing times, carriers and delivery estimates are in our{" "}
            <Link href="/shipping-policy" className="text-navy underline decoration-gold underline-offset-4">
              Shipping Policy
            </Link>
            . Returns are covered by our{" "}
            <Link href="/returns-policy" className="text-navy underline decoration-gold underline-offset-4">
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

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery images={product.images} />

          <div>
            <p className="text-sm text-muted">{product.brand}</p>
            <h1 className="mt-1 font-serif text-3xl leading-tight font-medium text-navy sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted">
              <span>SKU {product.sku}</span>
              {product.upc && <span>UPC {product.upc}</span>}
              <StockBadge status={product.stock} />
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/90">{product.description}</p>

            <div className="mt-7">
              <PurchasePanel
                product={{
                  slug: product.slug,
                  sku: product.sku,
                  name: product.name,
                  image: product.images[0].src,
                  price: product.price,
                  stock: product.stock,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <ProductTabs tabs={tabs} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="container-site py-14 sm:py-20">
            <h2 className="section-title">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductJsonLd product={product} />
    </>
  );
}
