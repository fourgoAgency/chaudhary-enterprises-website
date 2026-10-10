import { site } from "@/lib/site";

/** Renders a JSON-LD <script>. `<` is escaped so data can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  const a = site.contact.address;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        legalName: site.name,
        url: site.url,
        logo: `${site.url}/logo.svg`,
        image: `${site.url}/logo.svg`,
        description: site.description,
        email: site.contact.email,
        telephone: site.contact.phoneHref.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: a.street,
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.countryCode,
        },
        areaServed: { "@type": "Country", name: a.country },
        currenciesAccepted: site.currency,
      }}
    />
  );
}
