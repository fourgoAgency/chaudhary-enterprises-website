import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CartIconLink } from "@/components/layout/cart-icon-link";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { AccountIconLink, WishlistIconLink } from "@/components/layout/header-account-links";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchForm } from "@/components/layout/search-form";
import { StickyHeader } from "@/components/layout/sticky-header";
import { getCategories, getProductCountsByCategory } from "@/lib/catalog";
import { routes, site } from "@/lib/site";

function TopBar() {
  return (
    <div className="bg-black text-white">
      <div className="container-site flex h-9 items-center justify-between gap-4 text-[13px] font-medium">
        <p className="truncate">{site.topBarMessage}</p>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <a href={site.contact.phoneHref} className="hover:underline">
            <span className="sr-only">Phone: </span>
            {site.contact.phone}
          </a>
          <a href={`mailto:${site.contact.email}`} className="hidden hover:underline md:inline">
            <span className="sr-only">Email: </span>
            {site.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}

export async function Header() {
  const [categories, counts] = await Promise.all([getCategories(), getProductCountsByCategory()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-blue px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <TopBar />
      <StickyHeader>
        <div className="container-site flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-8">
          <div className="lg:hidden">
            <MobileNav categories={categories} />
          </div>

          <Link href={routes.home} aria-label={`${site.name} home`} className="shrink-0">
            <Logo compact className="sm:hidden" />
            <Logo className="hidden sm:inline-flex" />
          </Link>

          <div className="hidden lg:block">
            <DesktopNav categories={categories.map((c) => ({ ...c, count: counts[c.slug] ?? 0 }))} />
          </div>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1.5">
            <SearchForm className="mr-2 hidden w-56 lg:block xl:w-72" />
            <AccountIconLink className="hidden sm:inline-flex" />
            <WishlistIconLink />
            <CartIconLink />
          </div>
        </div>
      </StickyHeader>
    </>
  );
}
