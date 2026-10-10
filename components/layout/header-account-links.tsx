"use client";

import { Heart, UserRound } from "lucide-react";
import { HeaderIconLink } from "@/components/layout/header-icon-link";
import { useCurrentAccount } from "@/lib/account-store";
import { useHydrated } from "@/lib/cart-store";
import { routes } from "@/lib/site";
import { useWishlist } from "@/lib/wishlist-store";

/** Login / Register, or My Account when signed in on this device. */
export function AccountIconLink({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const account = useCurrentAccount();
  const signedIn = hydrated && account;
  return (
    <HeaderIconLink
      href={signedIn ? routes.account : routes.login}
      label={signedIn ? `My account (${account.name})` : "Login / Register"}
      icon={UserRound}
      className={className}
    />
  );
}

export function WishlistIconLink() {
  const hydrated = useHydrated();
  const { slugs } = useWishlist();
  return <HeaderIconLink href={routes.wishlist} label="Wishlist" icon={Heart} count={hydrated ? slugs.length : 0} />;
}
