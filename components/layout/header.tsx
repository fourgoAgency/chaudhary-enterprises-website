import Link from "next/link";
import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchForm } from "@/components/layout/search-form";
import { StickyHeader } from "@/components/layout/sticky-header";
import { getCategories } from "@/lib/catalog";
import { routes, site } from "@/lib/site";

export async function Header() {
  const categories = await getCategories();

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-navy px-4 py-2 text-sm text-ivory-light focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <StickyHeader>
        <div className="container-site flex h-16 items-center gap-4 lg:h-[4.75rem] lg:gap-10">
          <div className="lg:hidden">
            <MobileNav categories={categories} />
          </div>

          <Link href={routes.home} aria-label={`${site.name} home`} className="shrink-0">
            <LogoMark className="size-11 lg:hidden" />
            <Logo className="hidden w-52 lg:block xl:w-60" />
          </Link>

          <div className="hidden lg:block">
            <DesktopNav categories={categories} />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <SearchForm className="mr-3 hidden w-64 lg:block xl:w-80" />
            {/* TODO(phase 6): switch to "My account" when signed in. */}
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
