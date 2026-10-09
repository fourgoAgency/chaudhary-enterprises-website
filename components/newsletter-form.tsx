"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.email("Enter a valid email address") });
type Values = z.infer<typeof schema>;

type Status = "idle" | "success" | "error";

export function NewsletterForm({ tone = "dark", className }: { tone?: "light" | "dark"; className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  // TODO(phase 6): /api/newsletter is implemented alongside the contact handler.
  const onSubmit = async (values: Values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const dark = tone === "dark";
  const inputId = `newsletter-email-${tone}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={className}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex">
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="Your business email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={`${inputId}-msg`}
          {...register("email")}
          className={cn(
            "h-11 min-w-0 flex-1 border px-3 text-sm focus:outline-none",
            dark
              ? "border-ivory/25 bg-transparent text-ivory-light placeholder:text-ivory/70 focus:border-gold"
              : "border-line bg-white text-ink placeholder:text-muted focus:border-gold",
          )}
        />
        <Button type="submit" variant={dark ? "gold" : "primary"} disabled={isSubmitting} className="h-11">
          Subscribe
        </Button>
      </div>
      <p id={`${inputId}-msg`} role="status" className={cn("mt-2 min-h-5 text-xs", dark ? "text-ivory" : "text-muted")}>
        {errors.email?.message ??
          (status === "success"
            ? "Thanks — you're on the list."
            : status === "error"
              ? "Sorry, something went wrong. Please try again."
              : "")}
      </p>
    </form>
  );
}
