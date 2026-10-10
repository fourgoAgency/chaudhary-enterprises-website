import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/logo";
import { quickLinks, routes, serviceNav, site } from "@/lib/site";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const linkClass = "text-white/80 transition-colors hover:text-white hover:underline underline-offset-4";

function LinkColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-base font-bold text-white">{title}</h2>
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
    <footer className="mt-auto bg-black text-white">
      <div>
        <div className="container-site grid gap-x-10 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          <div className="max-w-sm">
            <Link href={routes.home} aria-label={`${site.name} home`} className="inline-block">
              <Logo tone="dark" className="w-44" />
            </Link>
            <p className="mt-5 text-sm text-white/80">
              Genuine products from trusted brands, shipped from Sheridan, Wyoming to customers across the United
              States.
            </p>
          </div>

          <LinkColumn title="Quick links" links={quickLinks} />
          <LinkColumn title="Policies" links={serviceNav} />

          <div>
            <h2 className="text-base font-bold text-white">Contact us</h2>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <p className="text-white/80">
                <span className="font-bold text-white">{site.name}</span>
                <br />
                {a.street}
                <br />
                {a.city}, {a.region} {a.postalCode}
                <br />
                {a.country}
              </p>
              <p>
                <a href={site.contact.phoneHref} className={`font-semibold ${linkClass}`}>
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.contact.email}`} className={`break-all ${linkClass}`}>
                  {site.contact.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="container-site flex flex-col gap-2 py-6 text-sm text-white/70 sm:flex-row sm:justify-between">
            <p>
              © <CopyrightYear /> {site.name}. All rights reserved.
            </p>
            <p>Prices in US dollars (USD).</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
