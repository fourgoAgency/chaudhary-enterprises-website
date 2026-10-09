"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavLinksProps = {
  orientation?: "horizontal" | "vertical";
  /** Called after a link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
};

export function NavLinks({ orientation = "horizontal", onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const vertical = orientation === "vertical";

  return (
    <ul className={cn(vertical ? "flex flex-col" : "flex items-center gap-8")}>
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative text-xs font-semibold tracking-label text-navy uppercase transition-colors hover:text-gold-dark",
                vertical
                  ? "block border-b border-line px-5 py-4"
                  : "py-2 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100",
                active && (vertical ? "text-gold-dark" : "after:scale-x-100"),
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
