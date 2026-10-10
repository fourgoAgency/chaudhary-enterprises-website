import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full min-w-0 border border-line bg-white px-3 text-[15px] text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none aria-invalid:border-red-700 disabled:bg-ivory";

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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

/** aria-describedby value pointing at a Field's hint or error. */
export function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function FormSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={cn("border-t border-line pt-6", className)}>
      <legend className="float-left mb-5 w-full font-serif text-2xl text-navy">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}
