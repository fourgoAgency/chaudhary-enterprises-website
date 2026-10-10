import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderIconLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shows a count badge when set (cart / wishlist). */
  count?: number;
  className?: string;
};

// TODO(phase 4): pass live counts from the cart and wishlist stores.
export function HeaderIconLink({ href, label, icon: Icon, count, className }: HeaderIconLinkProps) {
  const hasCount = count !== undefined;
  const accessibleLabel = hasCount ? `${label}, ${count} ${count === 1 ? "item" : "items"}` : label;

  return (
    <Link
      href={href}
      aria-label={accessibleLabel}
      title={label}
      className={cn(
        "relative inline-flex size-10 items-center justify-center text-navy transition-colors hover:text-gold-dark",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden strokeWidth={1.5} />
      {hasCount && count > 0 && (
        <span className="absolute top-0.5 right-0 flex min-w-4.5 items-center justify-center rounded-full bg-navy px-1 text-[10px] leading-4.5 font-semibold text-ivory-light">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
