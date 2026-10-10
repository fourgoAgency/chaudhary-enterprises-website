import type { StockStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const dots: Record<StockStatus, string> = {
  in_stock: "bg-blue",
  low_stock: "bg-black",
  out_of_stock: "bg-muted",
};

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        status === "out_of_stock" ? "text-muted" : "text-black",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", dots[status])} aria-hidden />
      {labels[status]}
    </span>
  );
}
