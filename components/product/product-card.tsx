import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductBadge } from "@/components/product/product-badge";
import { WishlistButton } from "@/components/product/wishlist-button";
import { formatPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/** White card; the product image sits on a light-blue tint. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-200 hover:shadow-card">
      <div className="relative aspect-square bg-blue-tint">
        <div className="absolute inset-4 overflow-hidden rounded-md bg-white">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 30vw, 45vw"
            priority={priority}
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <ProductBadge product={product} className="absolute top-2.5 left-2.5" />
        <WishlistButton slug={product.slug} name={product.name} className="absolute top-2 right-2" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-medium text-muted sm:text-sm">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold tracking-normal sm:text-[15px]">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0 hover:text-blue">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-3 text-lg font-bold text-blue tabular-nums">{formatPrice(product.price)}</p>
        <AddToCartButton
          slug={product.slug}
          name={product.name}
          size="sm"
          disabled={product.stock === "out_of_stock"}
          className="mt-3 w-full"
        />
      </div>
    </article>
  );
}

export function ProductGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4", className)}>{children}</div>;
}
