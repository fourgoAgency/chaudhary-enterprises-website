import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/pricing";
import { routes, site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Full-width blue banner: headline and calls to action, with three featured products. */
export function Hero({ products }: { products: Product[] }) {
  return (
    <section className="surface-blue bg-blue text-white">
      <div className="container-site grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-20">
        <div>
          <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]">{site.tagline}</h1>
          <p className="mt-5 max-w-lg text-lg">
            Genuine products from trusted brands, from wellness and beauty to electronics and sports gear, shipped
            across the United States.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href={routes.shop}>
                Shop Now
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline-light">
              <Link href={routes.about}>About us</Link>
            </Button>
          </div>
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-[1.4fr_1fr] gap-3 sm:gap-4">
            {products.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={cn(
                  "group flex flex-col rounded-lg bg-white p-3 text-black transition-shadow hover:shadow-card",
                  i === 0 && "row-span-2",
                )}
              >
                <span className="relative block flex-1 overflow-hidden rounded-md bg-white">
                  <span className={cn("relative block", i === 0 ? "h-full min-h-56" : "aspect-[4/3]")}>
                    <Image
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </span>
                </span>
                <span className="mt-2.5 flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-muted">{p.brand}</span>
                  <span className="shrink-0 font-bold text-blue">{formatPrice(p.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
