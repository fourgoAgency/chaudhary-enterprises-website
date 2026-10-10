"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { mainNav, routes } from "@/lib/site";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex h-10 items-center px-3 text-[15px] font-semibold text-black transition-colors hover:text-blue";

type NavCategory = Category & { count: number };

export function DesktopNav({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(linkClass, pathname === item.href && "text-blue")}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <CategoriesMenu categories={categories} pathname={pathname} />
        </li>
      </ul>
    </nav>
  );
}

/** "Categories" dropdown: opens on click or hover; closes on Escape, outside click or navigation. */
function CategoriesMenu({ categories, pathname }: { categories: NavCategory[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // True when hover just opened the menu, so the click that usually follows doesn't close it again.
  const openedByHover = useRef(false);
  const panelId = useId();
  const inCategory = pathname.startsWith(`${routes.shop}/`);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Hover opens straight away and closes after a short delay, so moving onto the panel is forgiving.
  const onMouseEnter = (e: React.MouseEvent) => {
    if ((e.nativeEvent as PointerEvent).pointerType === "touch") return;
    clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const onMouseLeave = () => {
    clearTimeout(closeTimer.current);
    openedByHover.current = false;
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHover.current) openedByHover.current = false;
          else setOpen((o) => !o);
        }}
        className={cn(linkClass, "gap-1", (open || inCategory) && "text-blue")}
      >
        Categories
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-0 z-50 w-[30rem] pt-2 data-[open]:animate-[fade-in_150ms]"
        data-open={open ? "" : undefined}
      >
        <div className="rounded-lg border border-line bg-white p-3 shadow-card">
          <ul className="grid grid-cols-2 gap-1">
            {categories.map((c) => {
              const href = `${routes.shop}/${c.slug}`;
              const active = pathname === href;
              return (
                <li key={c.slug}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-blue-tint hover:text-blue",
                      active && "bg-blue-tint font-semibold text-blue",
                    )}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted tabular-nums">{c.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={routes.shop}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-between rounded-md bg-blue px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-hover"
          >
            Shop all products
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
