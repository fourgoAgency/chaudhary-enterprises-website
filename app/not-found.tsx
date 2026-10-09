import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[55vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="section-title mt-4">Page not found</h1>
      <div className="gold-rule mt-6" />
      <p className="mt-6 max-w-md text-muted">
        The page you&apos;re looking for has moved or no longer exists. Browse our wholesale range or get in touch with
        our team.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/shop">Browse the shop</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
