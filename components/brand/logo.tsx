import { useId } from "react";
import { cn } from "@/lib/utils";

// "CE" set in Cormorant Garamond 500, converted to outlines so the monogram renders identically everywhere.
const CE_PATH =
  "M56.41 59.10Q57.78 59.10 58.95 59.23Q60.12 59.36 61.14 59.64Q62.17 59.93 63.10 60.40Q63.39 60.51 63.45 60.63Q63.50 60.76 63.54 61.19L64 65.73Q64 65.80 63.82 65.84Q63.68 65.87 63.61 65.84Q63.57 65.80 63.57 65.76Q62.67 62.78 60.84 61.25Q59 59.72 56.16 59.72Q53.28 59.72 51.12 61.05Q48.96 62.38 47.73 64.81Q46.51 67.24 46.51 70.55Q46.51 73 47.26 75.05Q48.02 77.10 49.37 78.63Q50.72 80.16 52.50 80.99Q54.28 81.82 56.34 81.82Q59.22 81.82 61 80.38Q62.78 78.94 63.86 75.99Q63.93 75.88 64.11 75.92Q64.29 75.95 64.29 76.06L63.90 80.16Q63.86 80.60 63.77 80.70Q63.68 80.81 63.43 80.96Q61.59 81.78 59.92 82.13Q58.24 82.47 56.34 82.47Q52.52 82.47 49.55 80.97Q46.58 79.48 44.89 76.83Q43.20 74.19 43.20 70.70Q43.20 68.10 44.19 65.98Q45.18 63.86 46.98 62.31Q48.78 60.76 51.17 59.93Q53.56 59.10 56.41 59.10M83.94 82L68.60 82Q68.50 82 68.50 81.78Q68.50 81.57 68.60 81.57Q69.83 81.57 70.46 81.39Q71.09 81.21 71.30 80.67Q71.52 80.13 71.52 79.08L71.52 62.42Q71.52 61.37 71.30 60.85Q71.09 60.33 70.46 60.13Q69.83 59.93 68.60 59.93Q68.50 59.93 68.50 59.72Q68.50 59.50 68.60 59.50L83.29 59.50Q83.65 59.50 83.65 59.82L83.72 64.36Q83.72 64.47 83.53 64.49Q83.33 64.50 83.29 64.40Q83.04 62.42 81.89 61.39Q80.74 60.36 78.86 60.36L77.03 60.36Q75.95 60.36 75.37 60.54Q74.80 60.72 74.58 61.21Q74.36 61.70 74.36 62.56L74.36 69.87L78.32 69.87Q80.16 69.87 81.02 69.24Q81.89 68.61 81.89 67.28Q81.89 67.20 82.09 67.20Q82.28 67.20 82.28 67.28Q82.28 68.39 82.27 69Q82.25 69.62 82.25 70.30Q82.25 71.13 82.30 71.96Q82.36 72.78 82.36 73.72Q82.36 73.79 82.14 73.79Q81.92 73.79 81.92 73.72Q81.92 72.17 81.04 71.43Q80.16 70.70 78.22 70.70L74.36 70.70L74.36 78.94Q74.36 79.80 74.56 80.29Q74.76 80.78 75.30 80.97Q75.84 81.17 76.81 81.17L79.19 81.17Q81.24 81.17 82.57 79.97Q83.90 78.76 84.41 76.53Q84.41 76.49 84.41 76.49Q84.44 76.42 84.62 76.46Q84.84 76.49 84.84 76.60Q84.70 77.57 84.59 78.94Q84.48 80.31 84.48 81.46Q84.48 82 83.94 82";

/** A gradient id that is safe inside url(#…) references. */
function useGradientId() {
  return `gold${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function GoldGradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8C6A2F" />
        <stop offset="0.45" stopColor="#D9B872" />
        <stop offset="0.7" stopColor="#B8924A" />
        <stop offset="1" stopColor="#7A5A24" />
      </linearGradient>
    </defs>
  );
}

function Seal({ fill }: { fill: string }) {
  return (
    <>
      <circle cx="64" cy="70" r="46" fill="none" stroke={fill} strokeWidth="1.6" />
      <circle cx="64" cy="70" r="40" fill="none" stroke={fill} strokeWidth="0.6" />
      <path d="M64 22 l3 4 -3 4 -3 -4z M64 110 l3 4 -3 4 -3 -4z" fill={fill} />
      <path d={CE_PATH} fill={fill} />
    </>
  );
}

type LogoProps = {
  /** "light" = for light backgrounds (navy wordmark); "dark" = for dark backgrounds (ivory wordmark). */
  tone?: "light" | "dark";
  className?: string;
};

/** Full horizontal logo: CE seal + CHAUDHARY wordmark + ENTERPRISES · LLC. */
export function Logo({ tone = "light", className }: LogoProps) {
  const gradientId = useGradientId();
  const gold = `url(#${gradientId})`;
  return (
    <svg viewBox="14 18 470 104" role="img" aria-label="Chaudhary Enterprises LLC" className={cn("h-auto", className)}>
      <GoldGradient id={gradientId} />
      <Seal fill={gold} />
      <line x1="134" y1="38" x2="134" y2="102" stroke={gold} strokeWidth="0.8" />
      <text
        x="158"
        y="76"
        fontWeight="500"
        fontSize="42"
        letterSpacing="8"
        fill={tone === "light" ? "#14213D" : "#F4EEE2"}
        style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
      >
        CHAUDHARY
      </text>
      <line x1="160" y1="92" x2="196" y2="92" stroke={gold} strokeWidth="0.8" />
      <text
        x="208"
        y="96"
        fontWeight="400"
        fontSize="11"
        letterSpacing="6.5"
        fill={gold}
        style={{ fontFamily: "var(--font-montserrat), Montserrat, Arial, sans-serif" }}
      >
        ENTERPRISES · LLC
      </text>
      <line x1="440" y1="92" x2="476" y2="92" stroke={gold} strokeWidth="0.8" />
    </svg>
  );
}

/** Compact "CE" monogram seal, used in the mobile header. */
export function LogoMark({ className }: { className?: string }) {
  const gradientId = useGradientId();
  return (
    <svg viewBox="16 22 96 96" role="img" aria-label="Chaudhary Enterprises LLC" className={className}>
      <GoldGradient id={gradientId} />
      <Seal fill={`url(#${gradientId})`} />
    </svg>
  );
}
