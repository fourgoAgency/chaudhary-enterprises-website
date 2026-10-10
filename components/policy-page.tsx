import type { Metadata } from "next";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPolicy } from "@/lib/policies";
import { policies, type PolicySlug } from "@/lib/site";
import { cn } from "@/lib/utils";

const components: Components = {
  h3: ({ children }) => <h2 className="mt-10 mb-3 text-xl first:mt-0">{children}</h2>,
  p: ({ children }) => <p className="my-4">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-5 marker:text-blue">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-5 marker:text-muted">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue underline underline-offset-4 hover:text-blue-hover">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-black/30 py-2 pr-4 text-left font-semibold">{children}</th>,
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
        <ul className="space-y-1 border-t border-line pt-4 text-sm lg:sticky lg:top-28 lg:border-t-0 lg:pt-0">
          {policies.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}`}
                aria-current={p.slug === slug ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 hover:bg-blue-tint",
                  p.slug === slug && "bg-blue-tint font-semibold text-blue",
                )}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">{policy.title}</h1>
        <p className="mt-2 text-sm text-muted">Effective date: {policy.effectiveDate}</p>
        <div className="mt-8 leading-[1.75] text-black/85">
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {policy.body}
          </Markdown>
        </div>
      </article>
    </div>
  );
}
