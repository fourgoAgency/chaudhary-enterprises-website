import type { StockStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const dots: Record<StockStatus, string> = {
  in_stock: "bg-emerald-700",
  low_stock: "bg-amber-600",
  out_of_stock: "bg-muted",
};

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-ink", className)}>
      <span className={cn("size-1.5 rounded-full", dots[status])} aria-hidden />
      {labels[status]}
    </span>
  );
}
