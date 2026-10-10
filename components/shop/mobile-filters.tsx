"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type MobileFiltersProps = Omit<React.ComponentProps<typeof ShopFilters>, "idPrefix" | "onApplied"> & {
  activeCount: number;
};

export function MobileFilters({ activeCount, ...props }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-sm font-medium text-navy hover:border-navy">
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-navy text-[11px] text-ivory-light">
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" title="Filters">
        <div className="p-5">
          <ShopFilters {...props} idPrefix="mobile-filter" onApplied={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
