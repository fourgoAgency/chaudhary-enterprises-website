import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard, ProductGrid } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutParagraphs, mission } from "@/data/company";
import {
  getAllProducts,
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getProductCountsByCategory,
} from "@/lib/catalog";
import { routes, site } from "@/lib/site";

function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue hover:text-blue-hover"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export default async function HomePage() {
  const [categories, counts, featured, newArrivals, all] = await Promise.all([
    getCategories(),
    getProductCountsByCategory(),
    getFeaturedProducts(8),
    getNewArrivals(4),
    getAllProducts(),
  ]);

  const heroProducts = (featured.length >= 3 ? featured : all).slice(0, 3);
  const featuredShown = featured.length >= 8 ? featured.slice(0, 8) : (featured.length ? featured : all).slice(0, 4);
  const coverFor = (slug: string) => all.find((p) => p.category === slug)?.images[0];

  return (
    <>
      <Hero products={heroProducts} />
      <TrustBar />

      {/* Categories */}
      <section className="container-site py-14 sm:py-16">
        <SectionHeading
          title="Shop by Category"
          highlight="Category"
          action={<ViewAll href={routes.shop}>View all products</ViewAll>}
        />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => {
            const cover = coverFor(c.slug);
            return (
              <Reveal as="li" key={c.slug} delay={Math.min(i, 7) * 0.03}>
                <Link
                  href={`${routes.shop}/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-card"
                >
                  <span className="relative block aspect-[4/3] bg-blue-tint">
                    {cover && (
                      <Image
                        src={cover.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 20vw, 45vw"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    )}
                  </span>
                  <span className="flex flex-1 items-center justify-between gap-2 p-3 sm:p-4">
                    <span>
                      <span className="block font-semibold group-hover:text-blue">{c.name}</span>
                      <span className="text-sm text-muted">
                        {counts[c.slug]} {counts[c.slug] === 1 ? "product" : "products"}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-blue transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* Featured */}
      <section className="border-y border-line bg-blue-tint">
        <div className="container-site py-14 sm:py-16">
          <SectionHeading
            title="Featured Products"
            highlight="Products"
            action={<ViewAll href={routes.shop}>Shop all</ViewAll>}
          />
          <ProductGrid className="mt-8">
            {featuredShown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-site py-14 sm:py-16">
          <SectionHeading
            title="New Arrivals"
            highlight="Arrivals"
            action={<ViewAll href={`${routes.shop}?sort=newest`}>See all new products</ViewAll>}
          />
          <ProductGrid className="mt-8">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}

      {/* About */}
      <section id="about" className="scroll-mt-24 border-t border-line">
        <div className="container-site grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading title="About Chaudhary Enterprises" highlight="Chaudhary Enterprises" />
            <div className="mt-6 space-y-4 leading-relaxed text-black/85">
              {aboutParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-4">
            <figure className="surface-blue rounded-lg bg-blue p-6 text-white sm:p-8">
              <figcaption className="text-sm font-semibold">Our mission</figcaption>
              <blockquote className="mt-3 text-xl leading-snug font-semibold sm:text-2xl">{mission}</blockquote>
            </figure>
            <div className="rounded-lg border border-line p-6">
              <h3 className="text-lg">Need help with an order?</h3>
              <p className="mt-1 text-sm text-muted">Call or email us and a member of our team will help.</p>
              <p className="mt-4 space-y-1">
                <a href={site.contact.phoneHref} className="block font-semibold text-blue hover:underline">
                  {site.contact.phone}
                </a>
                <a href={`mailto:${site.contact.email}`} className="block break-all hover:text-blue hover:underline">
                  {site.contact.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
