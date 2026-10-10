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

export function HeaderIconLink({ href, label, icon: Icon, count, className }: HeaderIconLinkProps) {
  const hasCount = count !== undefined;
  const accessibleLabel = hasCount ? `${label}, ${count} ${count === 1 ? "item" : "items"}` : label;

  return (
    <Link
      href={href}
      aria-label={accessibleLabel}
      title={label}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-md text-black transition-colors hover:bg-blue-tint hover:text-blue",
        className,
      )}
    >
      <Icon className="size-[1.35rem]" aria-hidden strokeWidth={1.75} />
      {hasCount && count > 0 && (
        // Keyed by count so the badge pops whenever the number changes.
        <span
          key={count}
          className="absolute top-0.5 right-0 flex h-[1.15rem] min-w-[1.15rem] animate-pop items-center justify-center rounded-full bg-blue px-1 text-[11px] leading-none font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
