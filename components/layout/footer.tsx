import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, PaymentBadges } from "@/components/brand/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { mainNav, serviceNav, site } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-5 font-sans text-[11px] font-semibold tracking-eyebrow text-gold uppercase">{children}</h2>;
}

const linkClass = "text-sm text-ivory transition-colors hover:text-gold-light";

const socials = [
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="bg-navy-deep text-ivory">
      <div className="h-px bg-linear-to-r from-transparent via-gold to-transparent" />
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr]">
        <div>
          <Link href="/" aria-label={`${site.name} — home`} className="inline-block">
            <Logo tone="dark" className="w-60" />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory">
            {/* TODO: client copy */}
            Trusted wholesale supply for Amazon sellers and Amazon Business buyers — tiered bulk pricing, fast dispatch
            and FBA-ready stock.
          </p>
          <ul className="mt-6 flex gap-3" aria-label="Social media">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="inline-flex size-9 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold-light"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <FooterHeading>Quick links</FooterHeading>
          <ul className="space-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" className={linkClass}>
                Cart
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Customer service">
          <FooterHeading>Customer service</FooterHeading>
          <ul className="space-y-3">
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>Contact</FooterHeading>
          <address className="space-y-3 text-sm not-italic">
            <a href={`mailto:${site.contact.email}`} className={`flex items-start gap-3 ${linkClass}`}>
              <Mail className="mt-1 size-4 shrink-0 text-gold" aria-hidden />
              {site.contact.email}
            </a>
            <a href={site.contact.phoneHref} className={`flex items-start gap-3 ${linkClass}`}>
              <Phone className="mt-1 size-4 shrink-0 text-gold" aria-hidden />
              {site.contact.phone}
            </a>
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.address.slice(1).join(", ")}</span>
            </p>
            <p className="flex items-start gap-3">
              <Clock className="mt-1 size-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}</span>
            </p>
          </address>

          <div className="mt-8">
            <FooterHeading>Trade newsletter</FooterHeading>
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-xs tracking-wide text-ivory">
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <PaymentBadges className="flex flex-wrap gap-2" />
        </div>
      </div>
    </footer>
  );
}
