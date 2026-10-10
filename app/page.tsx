import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSlider, type HeroSlide } from "@/components/home/hero-slider";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { aboutParagraphs, mission, orderSteps, reasons } from "@/data/company";
import { getAllProducts, getCategories, getFeaturedProducts, getProductCountsByCategory } from "@/lib/catalog";
import { routes, site } from "@/lib/site";
import { cn } from "@/lib/utils";

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

export default async function HomePage() {
  const [categories, counts, featured, all] = await Promise.all([
    getCategories(),
    getProductCountsByCategory(),
    getFeaturedProducts(8),
    getAllProducts(),
  ]);

  const introImages = (featured.length >= 3 ? featured : all).slice(0, 4).map((p) => p.images[0]);
  const slides: HeroSlide[] = [
    {
      kind: "intro",
      title: "Genuine products, delivered across the US",
      text: "Brand-new products from trusted brands, packed with care and shipped from our team in Sheridan, Wyoming.",
      cta: { label: "Shop all products", href: routes.shop },
      secondary: { label: "About us", href: routes.about },
      images: introImages,
    },
    ...featured.slice(0, 4).map((p): HeroSlide => ({
      kind: "product",
      eyebrow: p.brand,
      title: p.name,
      text: p.description,
      href: `/product/${p.slug}`,
      image: p.images[0],
      product: { slug: p.slug, sku: p.sku, name: p.name, image: p.images[0].src, price: p.price },
      inStock: p.stock !== "out_of_stock",
    })),
  ];

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Why shop with us */}
      <section aria-label="Why shop with us" className="border-b border-line bg-white">
        <ul className="container-site grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {reasons.map((r) => (
            <li key={r.title}>
              <h2 className="font-sans text-sm font-semibold text-navy">{r.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section className="container-site py-16 sm:py-20">
        <SectionHeader title="Shop by category" action={<TextLink href={routes.shop}>View all products</TextLink>} />
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
        <div className="container-site py-16 sm:py-20">
          <SectionHeader title="Featured products" action={<TextLink href={routes.shop}>Shop all</TextLink>} />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {(featured.length ? featured : all.slice(0, 8)).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section className="bg-navy text-ivory">
        <div className="container-site py-16 sm:py-20">
          <h2 className="font-serif text-3xl text-ivory-light sm:text-[2.5rem]">How ordering works</h2>
          <p className="mt-3 max-w-2xl text-ivory/80">
            No card details online. We confirm every order with you by email before you pay.
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {orderSteps.map((step, i) => (
              <li key={step.title} className="border-t border-ivory/25 pt-5">
                <span className="text-sm font-semibold text-gold-light tabular-nums">0{i + 1}</span>
                <h3 className="mt-2 font-sans text-base font-semibold text-ivory-light">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/80">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-28">
        <div className="container-site grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <h2 className="section-title">About Chaudhary Enterprises</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-[1.8] text-ink">
              {aboutParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="lg:pt-16">
            <blockquote className="border-l-2 border-gold pl-6">
              <p className="font-serif text-2xl leading-snug text-navy sm:text-3xl">{mission}</p>
              <footer className="mt-3 text-sm text-muted">Our promise</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-line bg-ivory">
        <div className="container-site flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl text-navy">Questions about a product or order?</h2>
            <p className="mt-3 text-muted">Call or email us and we&apos;ll get back to you.</p>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button asChild size="lg">
              <a href={`mailto:${site.contact.email}`}>Email us</a>
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
