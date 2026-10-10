// Central business details. Contact values must match the LLC filing exactly.
export const site = {
  name: "Chaudhary Enterprises LLC",
  shortName: "Chaudhary Enterprises",
  tagline: "Quality Brands, Delivered to Your Door",
  description:
    "Shop genuine products from trusted brands at Chaudhary Enterprises LLC — wellness, beauty, electronics, sports gear and more, shipped across the United States.",
  /** Slim bar above the header. */
  topBarMessage: "Fast US shipping • Genuine brands",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chaudharyenterprisesllc.com",
  // ISO 4217 code used for all prices
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
  { label: "Home", href: routes.home },
  { label: "Shop", href: routes.shop },
] as const;

/** Footer quick links. */
export const quickLinks = [
  { label: "Shop", href: routes.shop },
  { label: "Wishlist", href: routes.wishlist },
  { label: "My Account", href: routes.account },
  { label: "About us", href: routes.about },
] as const;

// Policy pages; content lives in content/policies/<slug>.md.
export const policies = [
  { slug: "shipping-policy", label: "Shipping Policy" },
  { slug: "returns-policy", label: "Returns & Refunds" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms & Conditions" },
] as const;

export type PolicySlug = (typeof policies)[number]["slug"];

export const serviceNav = policies.map((p) => ({ label: p.label, href: `/${p.slug}` }));
