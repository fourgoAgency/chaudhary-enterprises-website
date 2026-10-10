import { newProductSlugs } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones = {
  blue: "bg-blue text-white",
  black: "bg-black text-white",
  muted: "border border-line bg-white text-muted",
} as const;

export function Badge({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span className={cn("inline-block rounded px-2 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

/** The most relevant label for a product, based only on real catalog data. */
export function ProductBadge({ product, className }: { product: Product; className?: string }) {
  if (product.stock === "out_of_stock") {
    return (
      <Badge tone="muted" className={className}>
        Sold out
      </Badge>
    );
  }
  if (product.stock === "low_stock") {
    return (
      <Badge tone="black" className={className}>
        Low stock
      </Badge>
    );
  }
  if (newProductSlugs.has(product.slug)) {
    return (
      <Badge tone="blue" className={className}>
        New
      </Badge>
    );
  }
  if (product.featured) {
    return (
      <Badge tone="black" className={className}>
        Featured
      </Badge>
    );
  }
  return null;
}
