import type { Metadata } from "next";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPolicy } from "@/lib/policies";
import { policies, type PolicySlug } from "@/lib/site";
import { cn } from "@/lib/utils";

const components: Components = {
  h3: ({ children }) => <h2 className="mt-12 mb-4 font-serif text-2xl text-navy first:mt-0">{children}</h2>,
  p: ({ children }) => <p className="my-4">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-5 marker:text-gold-dark">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-5 marker:text-muted">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} className="text-navy underline decoration-gold underline-offset-4 hover:text-gold-dark">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-navy/30 py-2 pr-4 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-line py-2.5 pr-4">{children}</td>,
};

export async function policyMetadata(slug: PolicySlug): Promise<Metadata> {
  const { title } = await getPolicy(slug);
  return { title, alternates: { canonical: `/${slug}` } };
}

export async function PolicyPage({ slug }: { slug: PolicySlug }) {
  const policy = await getPolicy(slug);

  return (
    <div className="container-site grid gap-12 py-12 sm:py-16 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <nav aria-label="Policies" className="order-last lg:order-first">
        <ul className="space-y-1 border-t border-line pt-4 text-sm lg:sticky lg:top-28 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
          {policies.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                aria-current={p.slug === slug ? "page" : undefined}
                className={cn("block py-1.5 text-muted hover:text-navy", p.slug === slug && "font-semibold text-navy")}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="max-w-3xl">
        <h1 className="section-title">{policy.title}</h1>
        <p className="mt-3 text-sm text-muted">Effective date: {policy.effectiveDate}</p>
        <div className="mt-10 text-[15px] leading-[1.8] text-ink/90">
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {policy.body}
          </Markdown>
        </div>
      </article>
    </div>
  );
}
