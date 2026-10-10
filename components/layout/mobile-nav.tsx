"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { SearchForm } from "@/components/layout/search-form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { mainNav, routes, site } from "@/lib/site";
import type { Category } from "@/lib/types";

const accountLinks = [
  { label: "My account", href: routes.account },
  { label: "Wishlist", href: routes.wishlist },
  { label: "Cart", href: routes.cart },
];

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const row = "block border-b border-line px-5 py-3.5 font-semibold hover:bg-blue-tint";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="-ml-2 inline-flex size-10 items-center justify-center rounded-md text-black hover:bg-blue-tint"
      >
        <Menu className="size-6" aria-hidden strokeWidth={1.75} />
      </SheetTrigger>
      <SheetContent side="left" title="Menu">
        <div className="p-5">
          <SearchForm id="mobile-search" />
        </div>
        <nav aria-label="Mobile">
          <ul className="border-t border-line">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className={row}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="px-5 pt-6 pb-2 text-sm font-semibold text-muted">Categories</p>
          <ul className="px-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${routes.shop}/${c.slug}`}
                  onClick={close}
                  className="block rounded-md px-3 py-2 hover:bg-blue-tint hover:text-blue"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 border-t border-line">
            {accountLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className={row}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-5 py-5 text-sm">
          <a href={site.contact.phoneHref} className="block font-semibold hover:text-blue">
            {site.contact.phone}
          </a>
          <a href={`mailto:${site.contact.email}`} className="mt-1 block break-all text-muted hover:text-blue">
            {site.contact.email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
