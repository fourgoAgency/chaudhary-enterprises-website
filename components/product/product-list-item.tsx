import Image from "next/image";
import Link from "next/link";
import { StockBadge } from "@/components/product/stock-badge";
import { formatPrice, getTierRangeLabel } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/** Horizontal product row for the shop's list view, with the full tier summary. */
export function ProductListItem({ product }: { product: Product }) {
  const image = product.images[0];
  const href = `/product/${product.slug}`;

  return (
    <article className="group relative grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[9rem_1fr_15rem] sm:gap-6">
      <div className="relative aspect-square overflow-hidden border border-line bg-ivory">
        <Image src={image.src} alt={image.alt} fill sizes="9rem" className="object-cover" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {product.brand} · {product.sku}
        </p>
        <h3 className="mt-1 font-sans text-base leading-snug font-medium text-ink">
          <Link
            href={href}
            className="group-hover:underline group-hover:underline-offset-4 after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{product.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <StockBadge status={product.stock} />
          <span>
            MOQ {product.moq} units · case of {product.casePack}
          </span>
        </div>
      </div>

      <dl className="col-span-2 grid grid-cols-3 gap-px self-start border border-line bg-line text-center text-xs sm:col-span-1">
        {product.tiers.map((tier, i) => (
          <div key={tier.minQty} className="bg-white px-2 py-2.5">
            <dt className="text-muted tabular-nums">{getTierRangeLabel(product.tiers, i)}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-navy tabular-nums">{formatPrice(tier.unitPrice)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
