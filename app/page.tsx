import Link from "next/link";
import { Button } from "@/components/ui/button";

// Placeholder — the full home page is built in phase 3.
export default function HomePage() {
  return (
    <section className="bg-navy-deep text-ivory-light">
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-[11px] font-semibold tracking-eyebrow text-gold uppercase">Wholesale · B2B</p>
        <h1 className="mt-6 max-w-3xl font-serif text-4xl text-ivory-light sm:text-6xl">
          Trusted Wholesale Supply for Modern Retail
        </h1>
        <div className="gold-rule mt-8" />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild variant="gold" size="lg">
            <Link href="/shop">Shop wholesale</Link>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <a href="mailto:admin@chaudharyenterprisesllc.com?subject=Bulk%20quote%20request">Request a quote</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
