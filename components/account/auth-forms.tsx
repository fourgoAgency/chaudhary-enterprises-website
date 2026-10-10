"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describedBy, Field, FieldError, FormAlert, inputClass } from "@/components/ui/field";
import {
  loginSchema,
  registerSchema,
  safeRedirect,
  type LoginInput,
  type RegisterInput,
  type RegisterOutput,
} from "@/lib/account-schema";
import { useAccounts, useSessionKey } from "@/lib/account-store";
import { useHydrated } from "@/lib/cart-store";
import { routes, site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** Login | Create account. Two panels side by side on desktop, tabs on mobile. */
export function AuthForms({ initial }: { initial: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("next"));
  const hydrated = useHydrated();
  const signedIn = useSessionKey();

  // Already signed in on this device: go straight on.
  useEffect(() => {
    if (hydrated && signedIn) router.replace(next);
  }, [hydrated, signedIn, next, router]);

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={mode === value}
      aria-controls={`panel-${value}`}
      onClick={() => setMode(value)}
      className={cn(
        "-mb-px flex-1 border-b-2 py-3 font-semibold",
        mode === value ? "border-blue text-black" : "border-transparent text-muted",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Account" className="flex border-b border-line lg:hidden">
        {tab("login", "Login")}
        {tab("register", "Create account")}
      </div>

      <div className="grid gap-8 pt-6 lg:grid-cols-2 lg:pt-0">
        <section
          id="panel-login"
          aria-labelledby="login-title"
          className={cn("rounded-lg border border-line p-6 sm:p-8", mode !== "login" && "hidden lg:block")}
        >
          <h2 id="login-title" className="text-2xl">
            Login
          </h2>
          <p className="mt-1 text-sm text-muted">Welcome back. Log in to see your orders and saved details.</p>
          <LoginForm onDone={() => router.push(next)} />
        </section>

        <section
          id="panel-register"
          aria-labelledby="register-title"
          className={cn("rounded-lg border border-line p-6 sm:p-8", mode !== "register" && "hidden lg:block")}
        >
          <h2 id="register-title" className="text-2xl">
            Create account
          </h2>
          <p className="mt-1 text-sm text-muted">Save your details for faster checkout and keep a wishlist.</p>
          <RegisterForm onDone={() => router.push(next)} />
        </section>
      </div>

      <p className="mt-6 flex items-start gap-2 text-sm text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden />
        Your account is saved on this device. It isn&apos;t shared with other browsers or devices.
      </p>
    </div>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const login = useAccounts((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const result = await login(values.email, values.password, values.remember);
    if (result.ok) onDone();
    else setError(result.error ?? "Couldn't log in.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
      <Field id="login-email" label="Email" error={errors.email?.message}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("login-email", errors.email?.message)}
          className={inputClass}
          {...register("email")}
        />
      </Field>
      <Field id="login-password" label="Password" error={errors.password?.message}>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={describedBy("login-password", errors.password?.message)}
          className={inputClass}
          {...register("password")}
        />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-4 accent-blue" {...register("remember")} />
          Remember me
        </label>
        <span className="text-muted">
          Forgot your password?{" "}
          <a href={`mailto:${site.contact.email}`} className="font-semibold text-blue underline underline-offset-4">
            Contact us
          </a>
        </span>
      </div>
      {error && <FormAlert>{error}</FormAlert>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>
    </form>
  );
}

function RegisterForm({ onDone }: { onDone: () => void }) {
  const createAccount = useAccounts((s) => s.register);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput, unknown, RegisterOutput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  async function onSubmit(values: RegisterOutput) {
    setError(null);
    const result = await createAccount(values);
    if (result.ok) onDone();
    else setError(result.error ?? "Couldn't create your account.");
  }

  const text = (
    name: "name" | "email" | "password" | "confirm",
    label: string,
    type: string,
    autoComplete: string,
    hint?: string,
  ) => {
    const id = `register-${name}`;
    const message = errors[name]?.message;
    return (
      <Field id={id} label={label} error={message} hint={hint}>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy(id, message, hint)}
          className={inputClass}
          {...register(name)}
        />
      </Field>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
      {text("name", "Full name", "text", "name")}
      {text("email", "Email", "email", "email")}
      <div className="grid gap-4 sm:grid-cols-2">
        {text("password", "Password", "password", "new-password", "At least 8 characters.")}
        {text("confirm", "Confirm password", "password", "new-password")}
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-blue"
            aria-invalid={errors.acceptTerms ? true : undefined}
            aria-describedby={errors.acceptTerms ? "register-terms-error" : undefined}
            {...register("acceptTerms")}
          />
          <span>
            I accept the{" "}
            <Link href="/terms" target="_blank" className="text-blue underline underline-offset-4">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" target="_blank" className="text-blue underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && <FieldError id="register-terms-error">{errors.acceptTerms.message}</FieldError>}
      </div>
      {error && <FormAlert>{error}</FormAlert>}
      <Button type="submit" size="lg" variant="secondary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted">
        Prefer not to?{" "}
        <Link href={routes.shop} className="font-semibold text-blue underline underline-offset-4">
          Continue shopping as a guest
        </Link>
      </p>
    </form>
  );
}
