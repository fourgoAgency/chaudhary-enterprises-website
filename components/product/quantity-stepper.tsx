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

  const sm = size === "sm";
  const button = cn(
    "inline-flex h-full items-center justify-center text-black transition-colors hover:bg-blue-tint hover:text-blue disabled:text-muted/50 disabled:hover:bg-transparent",
    sm ? "w-8" : "w-11",
  );

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border border-black/25 bg-white has-[input:focus]:border-blue has-[input:focus]:shadow-[0_0_0_3px_var(--color-blue-soft)]",
        sm ? "h-9" : "h-12",
        disabled && "border-line",
      )}
    >
      <button
        type="button"
        onClick={() => commit(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className={button}
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
          "[appearance:textfield] border-x border-line bg-transparent text-center font-semibold text-black tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          sm ? "w-10 text-sm" : "w-14 text-base",
        )}
      />
      <button
        type="button"
        onClick={() => commit(value + 1)}
        disabled={disabled || value >= MAX_LINE_QUANTITY}
        aria-label="Increase quantity"
        className={button}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
