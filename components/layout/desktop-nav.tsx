"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import { ArrowRight, ChevronDown } from "lucide-react";
import { mainNav, routes } from "@/lib/site";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const linkClass =
  "relative inline-flex h-10 items-center px-3 text-[15px] font-semibold text-black transition-colors hover:text-blue data-active:text-blue";

type NavCategory = Category & { count: number };

export function DesktopNav({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const inCategory = pathname.startsWith(`${routes.shop}/`);

  return (
    // `static` so the mega-menu panel positions against the sticky header, not this list.
    <NavigationMenu.Root aria-label="Main" className="static" delayDuration={80}>
      <NavigationMenu.List className="flex items-center gap-1">
        {mainNav.map((item) => (
          <NavigationMenu.Item key={item.href}>
            <NavigationMenu.Link asChild active={pathname === item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={cn(linkClass, "group gap-1", inCategory && "text-blue")}>
            Categories
            <ChevronDown
              className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute inset-x-0 top-full border-b border-line bg-white shadow-card">
            <div className="container-site grid grid-cols-[1fr_16rem] gap-10 py-7">
              <ul className="grid grid-cols-3 gap-x-8 gap-y-1">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <NavigationMenu.Link asChild active={pathname === `${routes.shop}/${c.slug}`}>
                      <Link
                        href={`${routes.shop}/${c.slug}`}
                        className="flex items-baseline justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-blue-tint data-active:bg-blue-tint data-active:text-blue"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-sm text-muted tabular-nums">{c.count}</span>
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
              <div className="surface-blue rounded-lg bg-blue p-5 text-white">
                <p className="text-lg font-bold">Browse the full range</p>
                <p className="mt-1 text-sm">Every product from every category in one place.</p>
                <NavigationMenu.Link asChild>
                  <Link
                    href={routes.shop}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
                  >
                    Shop all products
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </NavigationMenu.Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
