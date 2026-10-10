import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { shopHref, type ShopState } from "@/lib/shop-params";
import { cn } from "@/lib/utils";

/** Page numbers to show: always first and last, plus a window around the current page. */
function pageList(current: number, total: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages.at(-1) !== "gap") pages.push("gap");
  }
  return pages;
}

const cell = "inline-flex size-10 items-center justify-center border text-sm tabular-nums";

export function Pagination({ basePath, state, pageCount }: { basePath: string; state: ShopState; pageCount: number }) {
  if (pageCount <= 1) return null;
  const href = (page: number) => shopHref(basePath, { ...state, page });
  const { page } = state;

  return (
    <nav aria-label="Pagination" className="mt-12 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              aria-label="Previous page"
              className={cn(cell, "border-line hover:border-navy")}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Link>
          ) : (
            <span className={cn(cell, "border-line text-muted/50")} aria-hidden>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </li>
        {pageList(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} className="px-1 text-muted" aria-hidden>
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  cell,
                  p === page ? "border-navy bg-navy text-ivory-light" : "border-line text-ink hover:border-navy",
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>
          {page < pageCount ? (
            <Link href={href(page + 1)} aria-label="Next page" className={cn(cell, "border-line hover:border-navy")}>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          ) : (
            <span className={cn(cell, "border-line text-muted/50")} aria-hidden>
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
