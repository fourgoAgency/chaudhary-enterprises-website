import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { StockBadge } from "@/components/product/stock-badge";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

// TODO(phase 6): wishlist heart toggle on the image.
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden border border-line bg-white transition-colors group-hover:border-navy/40">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          priority={priority}
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.stock !== "in_stock" && (
          <StockBadge status={product.stock} className="absolute top-3 left-3 bg-ivory-light/95 px-2 py-1" />
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs text-muted">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 font-sans text-[15px] leading-snug font-medium text-ink">
          <Link
            href={`/product/${product.slug}`}
            className="group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4 after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-3 text-lg font-semibold text-navy tabular-nums">{formatPrice(product.price)}</p>
        <AddToCartButton
          product={{
            slug: product.slug,
            sku: product.sku,
            name: product.name,
            image: image.src,
            price: product.price,
          }}
          disabled={product.stock === "out_of_stock"}
          className="mt-3 w-full"
        />
      </div>
    </article>
  );
}
