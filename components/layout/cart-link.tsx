import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// TODO(phase 4): read the item count from the cart store.
export function CartLink({ count = 0 }: { count?: number }) {
  const label = count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty";
  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative inline-flex size-10 items-center justify-center text-navy transition-colors hover:text-gold-dark"
    >
      <ShoppingBag className="size-5" aria-hidden strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute top-0.5 right-0 flex min-w-[18px] items-center justify-center rounded-full bg-navy px-1 text-[10px] leading-[18px] font-semibold text-ivory-light">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
