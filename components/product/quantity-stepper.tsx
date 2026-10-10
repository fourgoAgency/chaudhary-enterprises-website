"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MAX_LINE_QUANTITY, normalizeQuantity } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  id: string;
  value: number;
  /** Receives an already-normalised quantity (1 to MAX_LINE_QUANTITY). */
  onChange: (quantity: number) => void;
  disabled?: boolean;
  size?: "md" | "sm";
  /** Accessible label when there is no visible <label for={id}>. */
  "aria-label"?: string;
};

export function QuantityStepper({ id, value, onChange, disabled, size = "md", ...aria }: QuantityStepperProps) {
  // Raw text while typing, so the field can be cleared and retyped; normalised on blur / Enter.
  const [draft, setDraft] = useState<string | null>(null);

  function commit(next: number) {
    setDraft(null);
    const normalized = normalizeQuantity(next);
    if (normalized !== value) onChange(normalized);
  }

  const button =
    "inline-flex items-center justify-center text-navy hover:bg-ivory disabled:text-muted/40 disabled:hover:bg-transparent";
  const sm = size === "sm";

  return (
    <div className={cn("inline-flex border border-navy/30 bg-white", sm ? "h-10" : "h-12")}>
      <button
        type="button"
        onClick={() => commit(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className={cn(button, sm ? "w-9" : "w-12")}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_LINE_QUANTITY}
        value={draft ?? value}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => draft !== null && commit(Number(draft))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && draft !== null) {
            e.preventDefault();
            commit(Number(draft));
          }
        }}
        {...aria}
        className={cn(
          "border-x border-navy/30 text-center font-semibold text-ink tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none",
          sm ? "w-12 text-sm" : "w-16 text-base",
        )}
      />
      <button
        type="button"
        onClick={() => commit(value + 1)}
        disabled={disabled || value >= MAX_LINE_QUANTITY}
        aria-label="Increase quantity"
        className={cn(button, sm ? "w-9" : "w-12")}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
