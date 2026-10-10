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
  topBarMessage: "Wholesale supply for Amazon sellers · Tiered bulk pricing on every order",
  // TODO: client copy — add real profile URLs. Icons are only shown for non-empty entries.
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
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
  { label: "Home", href: routes.home },
  { label: "Shop", href: routes.shop },
] as const;

export const quickLinks = [
  { label: "Shop", href: routes.shop },
  { label: "About us", href: routes.about },
  { label: "Wishlist", href: routes.wishlist },
  { label: "My Account", href: routes.account },
  { label: "Cart", href: routes.cart },
] as const;

// Footer customer-service links. The policy pages are pending client approval.
export const serviceNav = [
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;
