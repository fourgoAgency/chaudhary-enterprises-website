import { cn } from "@/lib/utils";

// Same artwork as /public/logo.svg (light) and /public/logo-dark.svg (dark), drawn inline so the
// wordmark uses the Inter font loaded in the root layout.

const FONT = "var(--font-inter), Inter, 'Helvetica Neue', Arial, sans-serif";

type LogoProps = {
  /** "light" = for white backgrounds (black wordmark); "dark" = for black/blue backgrounds (white wordmark). */
  tone?: "light" | "dark";
  className?: string;
};

export function Logo({ tone = "light", className }: LogoProps) {
  return (
    <svg
      viewBox="0 16 272 76"
      role="img"
      aria-label="Chaudhary Enterprises LLC"
      className={cn("h-auto w-40 overflow-visible", className)}
    >
      <text
        x="6"
        y="60"
        fontFamily={FONT}
        fontWeight="800"
        fontSize="50"
        letterSpacing="-2.4"
        fill={tone === "dark" ? "#FFFFFF" : "#000000"}
      >
        chaudhary<tspan fill="#0066FF">.</tspan>
      </text>
      <text x="9" y="84" fontFamily={FONT} fontWeight="600" fontSize="12" letterSpacing="7.4" fill="#0066FF">
        ENTERPRISES LLC
      </text>
    </svg>
  );
}
