"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[55vh] flex-col justify-center py-20">
      <h1 className="text-3xl sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        Sorry, this page didn&apos;t load properly. Please try again. If it keeps happening, email us at{" "}
        <a href={`mailto:${site.contact.email}`} className="font-semibold text-blue underline underline-offset-4">
          {site.contact.email}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
