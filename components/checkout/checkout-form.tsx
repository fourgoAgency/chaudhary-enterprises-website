"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describedBy, Field, FormSection, inputClass } from "@/components/ui/field";
import { placeOrder } from "@/lib/actions/order";
import { useCart, useHydrated } from "@/lib/cart-store";
import { checkoutSchema, type CheckoutDetails, type CheckoutInput } from "@/lib/order-schema";
import { useOrders } from "@/lib/order-store";
import { formatPrice, priceCart } from "@/lib/pricing";
import { routes } from "@/lib/site";
import { US_STATES } from "@/lib/us-states";

type Path = FieldPath<CheckoutInput>;

function errorAt(errors: FieldErrors<CheckoutInput>, path: string): string | undefined {
  const node = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], errors);
  return (node as { message?: string } | undefined)?.message;
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.addOrder);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput, unknown, CheckoutDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: { line1: "", line2: "", city: "", zip: "" },
      notes: "",
      website: "",
    },
  });

  if (!hydrated) return <div className="mt-8 h-96 animate-pulse bg-ivory" aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-line px-6 py-16 text-center">
        <p className="font-serif text-2xl text-navy">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted">Add products to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href={routes.shop}>Browse products</Link>
        </Button>
      </div>
    );
  }

  const totals = priceCart(lines);

  async function onSubmit(details: CheckoutDetails) {
    setFormError(null);
    const items = useCart.getState().lines.map((l) => ({ slug: l.slug, quantity: l.quantity }));
    try {
      const result = await placeOrder(details, items);
      if (!result.ok) {
        for (const [path, message] of Object.entries(result.fieldErrors ?? {})) setError(path as Path, { message });
        setFormError(result.error);
        return;
      }
      addOrder(result.order);
      clearCart();
      router.push(`${routes.checkout}/success?order=${encodeURIComponent(result.order.number)}`);
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    }
  }

  /** Props and error for a registered field; `hint` adds the Field's hint to aria-describedby. */
  const field = (name: Path, id: string, hint?: boolean) => {
    const error = errorAt(errors, name);
    return {
      id,
      error,
      props: {
        id,
        ...register(name),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy(id, error, hint ? "hint" : undefined),
      },
    };
  };
  const name = field("name", "name");
  const email = field("email", "email", true);
  const phone = field("phone", "phone");
  const line1 = field("address.line1", "address-line1");
  const line2 = field("address.line2", "address-line2");
  const city = field("address.city", "address-city");
  const state = field("address.state", "address-state");
  const zip = field("address.zip", "address-zip");
  const notes = field("notes", "notes");
  const terms = field("acceptTerms", "accept-terms");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
      <div className="space-y-10">
        {/* Honeypot: hidden from people and assistive tech. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <FormSection title="Contact details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={name.id} label="Full name" error={name.error} className="sm:col-span-2">
              <input {...name.props} autoComplete="name" className={inputClass} />
            </Field>
            <Field id={email.id} label="Email" error={email.error} hint="We'll send your order confirmation here.">
              <input {...email.props} type="email" autoComplete="email" className={inputClass} />
            </Field>
            <Field id={phone.id} label="Phone" error={phone.error}>
              <input {...phone.props} type="tel" autoComplete="tel" className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Shipping address">
          <div className="grid gap-4 sm:grid-cols-6">
            <Field id={line1.id} label="Street address" error={line1.error} className="sm:col-span-6">
              <input {...line1.props} autoComplete="shipping address-line1" className={inputClass} />
            </Field>
            <Field
              id={line2.id}
              label="Apartment, suite or unit"
              optional
              error={line2.error}
              className="sm:col-span-6"
            >
              <input {...line2.props} autoComplete="shipping address-line2" className={inputClass} />
            </Field>
            <Field id={city.id} label="City" error={city.error} className="sm:col-span-3">
              <input {...city.props} autoComplete="shipping address-level2" className={inputClass} />
            </Field>
            <Field id={state.id} label="State" error={state.error} className="sm:col-span-2">
              <select {...state.props} autoComplete="shipping address-level1" defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select
                </option>
                {US_STATES.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={zip.id} label="ZIP code" error={zip.error} className="sm:col-span-1">
              <input {...zip.props} inputMode="numeric" autoComplete="shipping postal-code" className={inputClass} />
            </Field>
          </div>
          <Field id={notes.id} label="Order notes" optional error={notes.error} className="mt-6">
            <textarea {...notes.props} rows={3} className={`${inputClass} h-auto py-2.5`} />
          </Field>
        </FormSection>
      </div>

      <aside aria-label="Order review" className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-line bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-navy">Your order</h2>
            <Link href={routes.cart} className="text-sm text-muted underline underline-offset-4 hover:text-navy">
              Edit cart
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-3 py-3">
                <div className="relative size-14 shrink-0 border border-line bg-white">
                  <Image src={line.image} alt="" fill sizes="3.5rem" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-2 leading-snug">{line.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{formatPrice(line.price * line.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-navy">Subtotal</span>
            <span className="text-xl font-semibold text-navy tabular-nums">{formatPrice(totals.subtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            No payment is taken now. We&apos;ll email you to confirm shipping, your total and how to pay.
          </p>

          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" {...terms.props} className="mt-0.5 size-4 shrink-0 accent-navy" />
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="underline underline-offset-4">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/returns-policy" target="_blank" className="underline underline-offset-4">
                  Returns Policy
                </Link>
                .
              </span>
            </label>
            {terms.error && (
              <p id={`${terms.id}-error`} className="mt-1.5 text-xs text-red-800">
                {terms.error}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="mt-4 border border-red-800/20 bg-red-50 px-3 py-2.5 text-sm text-red-900">
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={isSubmitting}>
            <Lock aria-hidden />
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
        </div>
      </aside>
    </form>
  );
}
