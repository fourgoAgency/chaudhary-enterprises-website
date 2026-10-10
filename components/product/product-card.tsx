import Image from "next/image";
import Link from "next/link";
import { StockBadge } from "@/components/product/stock-badge";
import { formatPrice, getFromPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

// TODO(phase 6): wishlist heart toggle on the image.
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden border border-line bg-ivory transition-colors group-hover:border-navy/40">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.stock !== "in_stock" && (
          <StockBadge status={product.stock} className="absolute top-3 left-3 bg-ivory-light/95 px-2 py-1" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs text-muted">
          {product.brand} · {product.sku}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-sans text-[15px] leading-snug font-medium text-ink">
          <Link
            href={`/product/${product.slug}`}
            className="group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4 after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-3 text-sm text-ink">
          From <span className="text-base font-semibold text-navy">{formatPrice(getFromPrice(product.tiers))}</span>{" "}
          <span className="text-muted">/ unit</span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          MOQ {product.moq} units · case of {product.casePack}
        </p>
      </div>
    </article>
  );
}
