"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { mainNav, routes } from "@/lib/site";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex h-10 items-center text-sm font-medium text-navy transition-colors hover:text-gold-dark data-[active]:text-gold-dark";

export function DesktopNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const inCategory = pathname.startsWith(`${routes.shop}/`);

  return (
    // `static` so the mega-menu panel positions against the sticky header, not this list.
    <NavigationMenu.Root aria-label="Main" className="static" delayDuration={80}>
      <NavigationMenu.List className="flex items-center gap-7">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={cn(linkClass, "group gap-1", inCategory && "text-gold-dark")}>
            Categories
            <ChevronDown
              className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute inset-x-0 top-full border-y border-line bg-ivory-light shadow-[0_18px_30px_-20px_rgba(14,22,38,0.35)]">
            <div className="container-site grid grid-cols-[1fr_16rem] gap-12 py-8">
              <ul className="grid grid-cols-3 gap-x-8">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <NavigationMenu.Link asChild active={pathname === `${routes.shop}/${c.slug}`}>
                      <Link
                        href={`${routes.shop}/${c.slug}`}
                        className="block border-b border-line/70 py-2.5 text-sm text-ink transition-colors hover:text-gold-dark data-[active]:font-semibold data-[active]:text-navy"
                      >
                        {c.name}
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
              <div className="border-l border-line pl-8 text-sm">
                <p className="font-serif text-xl text-navy">Buying in bulk?</p>
                <p className="mt-2 text-muted">
                  Every product has tiered pricing that drops as your order grows. Larger or recurring orders can be
                  quoted directly.
                </p>
                <NavigationMenu.Link asChild>
                  <Link
                    href={routes.shop}
                    className="mt-4 inline-block font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-dark"
                  >
                    Browse all products
                  </Link>
                </NavigationMenu.Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {mainNav.map((item) => (
          <NavigationMenu.Item key={item.href}>
            <NavigationMenu.Link asChild active={item.href === routes.shop && pathname === routes.shop}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
