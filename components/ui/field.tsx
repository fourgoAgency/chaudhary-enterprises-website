import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full min-w-0 rounded-md border border-black/25 bg-white px-3.5 text-[15px] text-black placeholder:text-muted transition-shadow focus:border-blue focus:shadow-[0_0_0_3px_var(--color-blue-soft)] focus:outline-none aria-invalid:border-blue aria-invalid:shadow-[0_0_0_3px_var(--color-blue-soft)] disabled:border-line disabled:bg-line/40";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Label, control, hint and error message. The control should set aria-describedby={describedBy(id, …)}. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-black">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/** Inline validation message: black text with a blue alert icon (the palette has no red). */
export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-black">
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden />
      {children}
    </p>
  );
}

/** Form-level alert: black text in a blue-outlined box. */
export function FormAlert({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-md border border-blue bg-blue-tint px-4 py-3 text-sm font-medium text-black",
        className,
      )}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/** aria-describedby value pointing at a Field's hint or error. */
export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function FormSection({
  title,
  step,
  className,
  children,
}: {
  title: string;
  /** Optional step number shown in a blue circle before the title. */
  step?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("card p-5 sm:p-6", className)}>
      <legend className="float-left mb-5 flex w-full items-center gap-3 text-lg font-bold">
        {step !== undefined && (
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue text-sm text-white"
            aria-hidden
          >
            {step}
          </span>
        )}
        {title}
      </legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}
