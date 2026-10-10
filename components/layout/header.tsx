import Link from "next/link";
import { Heart, Mail, Phone, ShoppingBag, UserRound } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { SearchForm } from "@/components/layout/search-form";
import { StickyHeader } from "@/components/layout/sticky-header";
import { routes, site } from "@/lib/site";

function TopBar() {
  return (
    <div className="bg-navy-deep text-ivory">
      <div className="container-site flex h-9 items-center justify-center text-[11px] tracking-[0.12em] uppercase lg:justify-between">
        <p className="min-w-0 truncate">{site.topBarMessage}</p>
        <div className="hidden shrink-0 items-center gap-6 whitespace-nowrap lg:flex">
          <a
            href={`mailto:${site.contact.email}`}
            className="flex items-center gap-2 normal-case hover:text-gold-light"
          >
            <Mail className="size-3.5 text-gold" aria-hidden />
            <span className="tracking-wide">{site.contact.email}</span>
          </a>
          <a href={site.contact.phoneHref} className="flex items-center gap-2 hover:text-gold-light">
            <Phone className="size-3.5 text-gold" aria-hidden />
            <span className="tracking-wide">{site.contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-navy px-4 py-2 text-sm text-ivory-light focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <TopBar />
      <StickyHeader>
        <div className="container-site grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-20">
          {/* Left: burger (mobile) / logo (desktop) */}
          <div className="flex items-center">
            <div className="lg:hidden">
              <MobileNav />
            </div>
            <Link href={routes.home} className="hidden lg:block" aria-label={`${site.name} — home`}>
              <Logo className="w-56 xl:w-64" />
            </Link>
          </div>

          {/* Centre: monogram (mobile) / nav (desktop) */}
          <div className="flex justify-center">
            <Link href={routes.home} className="lg:hidden" aria-label={`${site.name} — home`}>
              <LogoMark className="size-12" />
            </Link>
            <nav aria-label="Main" className="hidden lg:block">
              <NavLinks />
            </nav>
          </div>

          {/* Right: search + account, wishlist, cart */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <SearchForm className="mr-2 hidden w-56 lg:block xl:w-64" />
            {/* TODO(phase 6): switch to "My Account" when signed in. */}
            <HeaderIconLink
              href={routes.login}
              label="Login / Register"
              icon={UserRound}
              className="hidden sm:inline-flex"
            />
            <HeaderIconLink href={routes.wishlist} label="Wishlist" icon={Heart} count={0} />
            <HeaderIconLink href={routes.cart} label="Cart" icon={ShoppingBag} count={0} />
          </div>
        </div>
      </StickyHeader>
    </>
  );
}
