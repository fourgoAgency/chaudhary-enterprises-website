import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/logo";
import { accountNav, mainNav, routes, serviceNav, site } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const linkClass = "text-ivory/85 transition-colors hover:text-ivory-light hover:underline underline-offset-4";

function LinkColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-sans text-sm font-semibold text-ivory-light">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const a = site.contact.address;

  return (
    <footer className="bg-navy-deep text-ivory">
      <div className="container-site grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link href={routes.home} aria-label={`${site.name} home`} className="inline-block">
            <Logo tone="dark" className="w-56" />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-ivory/85">
            Genuine, brand-new products from Sheridan, Wyoming, delivered to customers across the United States.
          </p>
        </div>

        <LinkColumn title="Shop" links={mainNav} />
        <LinkColumn title="Account" links={accountNav} />
        <LinkColumn title="Policies" links={serviceNav} />
      </div>

      <div className="container-site">
        <address className="grid gap-6 border-t border-ivory/15 py-8 text-sm not-italic sm:grid-cols-3">
          <div>
            <p className="font-semibold text-ivory-light">{site.name}</p>
            <p className="mt-1 text-ivory/85">
              {a.street}
              <br />
              {a.city}, {a.region} {a.postalCode}
              <br />
              {a.country}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ivory-light">Phone</p>
            <a href={site.contact.phoneHref} className={`mt-1 inline-block ${linkClass}`}>
              {site.contact.phone}
            </a>
          </div>
          <div>
            <p className="font-semibold text-ivory-light">Email</p>
            <a href={`mailto:${site.contact.email}`} className={`mt-1 inline-block break-all ${linkClass}`}>
              {site.contact.email}
            </a>
          </div>
        </address>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container-site py-6 text-xs text-ivory/70">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
