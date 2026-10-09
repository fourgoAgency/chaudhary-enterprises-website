"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky header shell that gains a shadow once the page has scrolled. */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-ivory-light/95 backdrop-blur transition-shadow duration-300",
        scrolled && "shadow-[0_6px_24px_-12px_rgba(14,22,38,0.25)]",
      )}
    >
      {children}
    </header>
  );
}
