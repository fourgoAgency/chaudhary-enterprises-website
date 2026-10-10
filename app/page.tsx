import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { aboutParagraphs, mission, orderSteps, reasons } from "@/data/company";
import { getCategories, getFeaturedProducts, getProductCountsByCategory } from "@/lib/catalog";
import { formatPrice, getTierRangeLabel } from "@/lib/pricing";
import { routes, site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

// TODO(phase 6): replace with the bulk-quote modal.
const quoteHref = `mailto:${site.contact.email}?subject=${encodeURIComponent("Bulk quote request")}`;

function SectionHeader({ title, intro, action }: { title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="section-title">{title}</h2>
        {intro && <p className="mt-3 text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

/** Shows how tiered pricing works using a real catalog product. */
function TierExample({ product }: { product: Product }) {
  const base = product.tiers[0].unitPrice;
  return (
    <figure className="border border-line bg-white p-6 shadow-[0_24px_48px_-32px_rgba(14,22,38,0.35)] sm:p-8">
      <figcaption>
        <p className="text-xs text-muted">How our pricing works</p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 block font-serif text-2xl leading-tight text-navy hover:text-gold-dark"
        >
          {product.name}
        </Link>
      </figcaption>
      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            <th scope="col" className="pb-2 font-medium">
              Quantity (units)
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              Unit price
            </th>
            <th scope="col" className="pb-2 text-right font-medium">
              You save
            </th>
          </tr>
        </thead>
        <tbody>
          {product.tiers.map((tier, i) => {
            const pct = Math.round(((base - tier.unitPrice) / base) * 100);
            return (
              <tr key={tier.minQty} className="border-b border-line/70 last:border-0">
                <td className="py-3 tabular-nums">{getTierRangeLabel(product.tiers, i)}</td>
                <td className="py-3 text-right font-semibold text-navy tabular-nums">{formatPrice(tier.unitPrice)}</td>
                <td className="py-3 text-right text-muted tabular-nums">{pct > 0 ? `${pct}%` : "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-5 text-xs text-muted">
        Minimum order {product.moq} units, sold in cases of {product.casePack}.
      </p>
    </figure>
  );
}

export default async function HomePage() {
  const [categories, counts, featured] = await Promise.all([
    getCategories(),
    getProductCountsByCategory(),
    getFeaturedProducts(8),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-site grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-24">
          <div>
            <h1 className="font-serif text-[2.75rem] leading-[1.05] font-medium text-navy sm:text-6xl lg:text-[4.25rem]">
              Trusted wholesale supply for modern retail
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Genuine, brand-new products in bulk for Amazon sellers, retailers and online stores. Order by the case,
              with prices that drop as your quantities grow.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={routes.shop}>Browse the catalog</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={quoteHref}>Request a quote</a>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted">
              Based in Sheridan, Wyoming. Supplying businesses across the United States.
            </p>
          </div>
          {featured[0] && <TierExample product={featured[0]} />}
        </div>
      </section>

      {/* Categories */}
      <section className="container-site py-16 sm:py-24">
        <SectionHeader
          title="Shop by category"
          intro="Case-packed products from authorized supply channels, ready to list."
          action={<TextLink href={routes.shop}>View all products</TextLink>}
        />
        <ul
          className={cn(
            "mt-10 grid border-t border-l border-line",
            categories.length > 4 ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "sm:grid-cols-2",
          )}
        >
          {categories.map((c) => (
            <li key={c.slug} className="border-r border-b border-line">
              <Link
                href={`${routes.shop}/${c.slug}`}
                className="group flex h-full flex-col justify-between gap-3 p-4 transition-colors hover:bg-white sm:gap-6 sm:p-5"
              >
                <span>
                  <span className="block font-serif text-lg leading-tight text-navy group-hover:text-gold-dark sm:text-xl">
                    {c.name}
                  </span>
                  {categories.length <= 4 && <span className="mt-2 block text-sm text-muted">{c.description}</span>}
                </span>
                <span className="flex items-center justify-between text-xs text-muted">
                  {counts[c.slug]} {counts[c.slug] === 1 ? "product" : "products"}
                  <ArrowRight
                    className="size-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured products */}
      <section className="border-t border-line bg-white">
        <div className="container-site py-16 sm:py-24">
          <SectionHeader title="Featured products" action={<TextLink href={routes.shop}>Shop all</TextLink>} />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section className="bg-navy text-ivory">
        <div className="container-site py-16 sm:py-20">
          <h2 className="font-serif text-3xl text-ivory-light sm:text-[2.5rem]">How ordering works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {orderSteps.map((step, i) => (
              <li key={step.title} className="border-t border-ivory/25 pt-5">
                <span className="font-serif text-lg text-gold-light tabular-nums">0{i + 1}</span>
                <h3 className="mt-2 font-sans text-base font-semibold text-ivory-light">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24">
        <div className="container-site grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <h2 className="section-title">About Chaudhary Enterprises</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-[1.8] text-ink">
              {aboutParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <blockquote className="mt-10 border-l-2 border-gold pl-6">
              <p className="font-serif text-2xl leading-snug text-navy">{mission}</p>
              <footer className="mt-3 text-sm text-muted">Our mission</footer>
            </blockquote>
          </div>

          <div className="lg:pt-2">
            <h3 className="font-sans text-base font-semibold text-navy">Why businesses work with us</h3>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {reasons.map((r) => (
                <div key={r.title} className="py-5">
                  <dt className="font-medium text-ink">{r.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{r.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Quote / contact */}
      <section className="border-t border-line bg-ivory">
        <div className="container-site flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-navy">Need a larger or recurring order?</h2>
            <p className="mt-3 text-muted">
              Tell us the products and quantities and we&apos;ll reply with a written quote.
            </p>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button asChild size="lg">
              <a href={quoteHref}>Request a quote</a>
            </Button>
            <div className="text-sm">
              <a href={site.contact.phoneHref} className="block font-semibold text-navy hover:text-gold-dark">
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} className="block break-all text-muted hover:text-navy">
                {site.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
