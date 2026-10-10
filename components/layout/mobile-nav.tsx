"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchForm } from "@/components/layout/search-form";
import { accountNav, mainNav, routes, site } from "@/lib/site";
import type { Category } from "@/lib/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="-ml-2 inline-flex size-10 items-center justify-center text-navy hover:text-gold-dark"
      >
        <Menu className="size-6" aria-hidden strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" title="Menu">
        <div className="p-5">
          <SearchForm id="mobile-search" />
        </div>
        <nav aria-label="Mobile">
          <ul className="border-t border-line">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="block border-b border-line px-5 py-3.5 font-medium text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="px-5 pt-6 pb-2 text-xs font-semibold text-muted">Categories</p>
          <ul className="px-5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${routes.shop}/${c.slug}`}
                  onClick={close}
                  className="block py-2 text-sm text-ink hover:text-gold-dark"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 border-t border-line px-5 py-4">
            {[{ label: "Login / Register", href: routes.login }, ...accountNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block py-2 text-sm text-navy">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line px-5 py-5 text-sm text-muted">
          <a href={site.contact.phoneHref} className="block hover:text-navy">
            {site.contact.phone}
          </a>
          <a href={`mailto:${site.contact.email}`} className="mt-1 block break-all hover:text-navy">
            {site.contact.email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
