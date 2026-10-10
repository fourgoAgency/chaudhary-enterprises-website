import { cn } from "@/lib/utils";

// Temporary text logo. The supplied /public/logo*.svg files use the old gold palette, so they
// aren't used until a blue/black/white logo is supplied.

type LogoProps = {
  /** "light" = for white backgrounds (black text); "dark" = for black/blue backgrounds (white text). */
  tone?: "light" | "dark";
  /** Hide the "Enterprises LLC" line (compact mobile header). */
  compact?: boolean;
  className?: string;
};

export function Logo({ tone = "light", compact = false, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("flex flex-col leading-none", tone === "dark" ? "text-white" : "text-black")}>
        <span className="text-xl font-bold tracking-[-0.02em]">Chaudhary</span>
        {!compact && (
          <span className={cn("mt-1 text-xs font-medium", tone === "dark" ? "text-white/80" : "text-muted")}>
            Enterprises LLC
          </span>
        )}
      </span>
    </span>
  );
}

/** "CE" monogram in a blue square. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-blue text-sm font-bold tracking-tight text-white",
        className,
      )}
    >
      CE
    </span>
  );
}
