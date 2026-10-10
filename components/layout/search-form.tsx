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
        placeholder="Search products"
        className="h-10 w-full border border-line bg-white pr-10 pl-3 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-navy hover:text-gold-dark"
      >
        <Search className="size-4" aria-hidden />
      </button>
    </Form>
  );
}
