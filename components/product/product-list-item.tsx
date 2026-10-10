import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductBadge } from "@/components/product/product-badge";
import { StockBadge } from "@/components/product/stock-badge";
import { WishlistButton } from "@/components/product/wishlist-button";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/** Horizontal product row for the shop's list view. */
export function ProductListItem({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="group relative grid grid-cols-[6.5rem_1fr] gap-4 rounded-lg border border-line bg-white p-3 transition-shadow hover:shadow-card sm:grid-cols-[9rem_1fr_11rem] sm:gap-6 sm:p-4">
      <div className="relative aspect-square rounded-md bg-blue-tint">
        <div className="absolute inset-2 overflow-hidden rounded bg-white">
          <Image src={image.src} alt={image.alt} fill sizes="9rem" className="object-contain" />
        </div>
        <ProductBadge product={product} className="absolute top-1.5 left-1.5" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{product.brand}</p>
        <h3 className="mt-1 text-base leading-snug font-semibold tracking-normal">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 hover:text-blue">
            {product.name}
          </Link>
        </h3>
        <div className="hidden sm:block">
          <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
        </div>
        <StockBadge status={product.stock} className="mt-3" />
      </div>

      <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center">
        <p className="text-xl font-bold text-blue tabular-nums">{formatPrice(product.price)}</p>
        <div className="flex items-center gap-2">
          <WishlistButton slug={product.slug} name={product.name} />
          <AddToCartButton
            slug={product.slug}
            name={product.name}
            size="sm"
            disabled={product.stock === "out_of_stock"}
          />
        </div>
      </div>
    </article>
  );
}
