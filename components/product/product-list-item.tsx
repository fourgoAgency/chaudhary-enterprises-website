import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { StockBadge } from "@/components/product/stock-badge";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/** Horizontal product row for the shop's list view. */
export function ProductListItem({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="group relative grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[9rem_1fr_11rem] sm:gap-6">
      <div className="relative aspect-square overflow-hidden border border-line bg-white">
        <Image src={image.src} alt={image.alt} fill sizes="9rem" className="object-contain p-2" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted">{product.brand}</p>
        <h3 className="mt-1 font-sans text-base leading-snug font-medium text-ink">
          <Link
            href={`/product/${product.slug}`}
            className="group-hover:underline group-hover:underline-offset-4 after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
        <StockBadge status={product.stock} className="mt-3" />
      </div>

      <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start">
        <p className="text-lg font-semibold text-navy tabular-nums">{formatPrice(product.price)}</p>
        <AddToCartButton
          product={{ slug: product.slug, sku: product.sku, name: product.name, image: image.src, price: product.price }}
          disabled={product.stock === "out_of_stock"}
        />
      </div>
    </article>
  );
}
