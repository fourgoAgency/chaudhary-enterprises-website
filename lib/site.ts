// Central business details. Contact values must match the LLC filing and Amazon account exactly.
export const site = {
  name: "Chaudhary Enterprises LLC",
  shortName: "Chaudhary Enterprises",
  tagline: "Trusted Wholesale Supply for Modern Retail",
  description:
    "Chaudhary Enterprises LLC is a Wyoming-based wholesale distributor supplying genuine branded products in bulk to retailers and online sellers across the United States.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chaudharyenterprisesllc.com",
  // ISO 4217 code used for all prices and Stripe Checkout
  currency: "USD",
  locale: "en-US",
  contact: {
    email: "admin@chaudharyenterprisesllc.com",
    phone: "+1 551-324-2092",
    phoneHref: "tel:+15513242092",
    address: {
      street: "30 N Gould St #59563",
      city: "Sheridan",
      region: "WY",
      postalCode: "82801",
      country: "United States",
      countryCode: "US",
    },
  },
} as const;

/** "30 N Gould St #59563, Sheridan, WY 82801, United States" */
export const formattedAddress = (() => {
  const a = site.contact.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}, ${a.country}`;
})();

export const routes = {
  home: "/",
  about: "/#about",
  shop: "/shop",
  wishlist: "/wishlist",
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
  login: "/account/login",
  register: "/account/register",
} as const;

export const mainNav = [
  { label: "Shop all", href: routes.shop },
  { label: "About", href: routes.about },
] as const;

export const accountNav = [
  { label: "My account", href: routes.account },
  { label: "Wishlist", href: routes.wishlist },
  { label: "Cart", href: routes.cart },
] as const;

// Footer policy links. Page content is supplied by the client.
export const serviceNav = [
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;
