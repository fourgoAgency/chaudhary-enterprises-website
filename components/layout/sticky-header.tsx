"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky header shell that gains a soft shadow once the page has scrolled. */
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
        "sticky top-0 z-40 border-b border-line bg-white transition-shadow duration-200",
        scrolled && "shadow-card",
      )}
    >
      {children}
    </header>
  );
}
