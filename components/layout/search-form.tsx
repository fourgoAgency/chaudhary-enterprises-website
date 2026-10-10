import Form from "next/form";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Product search. Submits to /shop?q=… and works without JavaScript. */
export function SearchForm({ className, id = "site-search" }: { className?: string; id?: string }) {
  return (
    <Form action="/shop" role="search" className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search products…"
        className="h-10 w-full rounded-md border border-black/20 bg-white pr-11 pl-3.5 text-sm text-black placeholder:text-muted focus:border-blue focus:shadow-[0_0_0_3px_var(--color-blue-soft)] focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute inset-y-1 right-1 inline-flex w-8 items-center justify-center rounded bg-blue text-white transition-colors hover:bg-blue-hover"
      >
        <Search className="size-4" aria-hidden />
      </button>
    </Form>
  );
}
