// Central business details. Values marked TODO are placeholders awaiting client copy.
export const site = {
  name: "Chaudhary Enterprises LLC",
  shortName: "Chaudhary Enterprises",
  tagline: "Wholesale supply for Amazon sellers",
  description:
    "Chaudhary Enterprises LLC is a wholesale supplier for Amazon sellers and Amazon Business buyers, offering tiered bulk pricing, fast dispatch and FBA-ready stock.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chaudharyenterprisesllc.com",
  // ISO 4217 code used for all prices and Stripe Checkout
  currency: "GBP",
  locale: "en-GB",
  // TODO: client copy — replace placeholder contact details
  contact: {
    email: "sales@chaudharyenterprisesllc.com",
    phone: "+00 0000 000000",
    phoneHref: "tel:+000000000000",
    address: ["Chaudhary Enterprises LLC", "Street address", "City, Postcode", "Country"],
    hours: [
      { days: "Mon – Fri", time: "9:00 – 17:30" },
      { days: "Sat – Sun", time: "Closed" },
    ],
  },
  topBarMessage: "Wholesale supply for Amazon sellers · Tiered bulk pricing on every order",
  // TODO: client copy — add real profile URLs or remove
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// Footer customer-service links. The policy pages are pending client approval.
export const serviceNav = [
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "FAQ", href: "/contact#faq" },
] as const;
