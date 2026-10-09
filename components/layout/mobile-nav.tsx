"use client";

import { useState } from "react";
import { Mail, Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "@/components/layout/nav-links";
import { SearchForm } from "@/components/layout/search-form";
import { site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="inline-flex size-10 items-center justify-center text-navy hover:text-gold-dark"
      >
        <Menu className="size-6" aria-hidden strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" title="Menu">
        <div className="p-5">
          <SearchForm id="mobile-search" />
        </div>
        <nav aria-label="Mobile">
          <NavLinks orientation="vertical" onNavigate={() => setOpen(false)} />
        </nav>
        <div className="space-y-3 p-5 text-sm text-muted">
          <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 hover:text-navy">
            <Mail className="size-4 text-gold-dark" aria-hidden />
            {site.contact.email}
          </a>
          <a href={site.contact.phoneHref} className="flex items-center gap-3 hover:text-navy">
            <Phone className="size-4 text-gold-dark" aria-hidden />
            {site.contact.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
