"use client";

import { Heart } from "lucide-react";
import { useHydrated } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-store";

type WishlistButtonProps = {
  slug: string;
  name: string;
  /** "icon" = round heart for cards; "full" = button with a label for the product page. */
  variant?: "icon" | "full";
  className?: string;
};

export function WishlistButton({ slug, name, variant = "icon", className }: WishlistButtonProps) {
  const hydrated = useHydrated();
  const wishlist = useWishlist();
  const saved = hydrated && wishlist.has(slug);
  const label = saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={variant === "icon" ? label : undefined}
      title={variant === "icon" ? (saved ? "Remove from wishlist" : "Add to wishlist") : undefined}
      onClick={() => wishlist.toggle(slug)}
      className={cn(
        "relative z-10 inline-flex items-center justify-center gap-2 font-semibold transition-colors",
        variant === "icon"
          ? "size-9 rounded-full border border-line bg-white shadow-sm hover:border-blue hover:text-blue"
          : "h-12 rounded-md border border-black/25 bg-white px-6 hover:border-black",
        saved && "text-blue",
        className,
      )}
    >
      <Heart key={String(saved)} className={cn("size-[1.1rem]", saved && "animate-pop fill-current")} aria-hidden />
      {variant === "full" && (saved ? "Saved to wishlist" : "Add to wishlist")}
    </button>
  );
}
