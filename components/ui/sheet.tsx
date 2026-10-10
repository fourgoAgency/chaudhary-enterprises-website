"use client";

import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "left" | "right";
  title: string;
  /** Visually hide the title (it is still announced to screen readers). */
  hideTitle?: boolean;
};

export function SheetContent({
  side = "left",
  title,
  hideTitle = false,
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-deep/60 data-[state=closed]:animate-[fade-out_200ms] data-[state=open]:animate-[fade-in_200ms]" />
      <SheetPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "fixed inset-y-0 z-50 flex w-[85vw] max-w-sm flex-col bg-ivory-light shadow-xl",
          side === "left"
            ? "left-0 data-[state=closed]:animate-[slide-out-left_200ms] data-[state=open]:animate-[slide-in-left_250ms]"
            : "right-0 data-[state=closed]:animate-[slide-out-right_200ms] data-[state=open]:animate-[slide-in-right_250ms]",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <SheetPrimitive.Title className={cn("font-serif text-2xl font-medium text-navy", hideTitle && "sr-only")}>
            {title}
          </SheetPrimitive.Title>
          <SheetPrimitive.Close
            className="-mr-2 ml-auto inline-flex size-10 items-center justify-center text-navy hover:text-gold-dark"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </SheetPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
