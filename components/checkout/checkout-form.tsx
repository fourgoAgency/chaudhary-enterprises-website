"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describedBy, Field, FieldError, FormAlert, FormSection, inputClass } from "@/components/ui/field";
import { useAccounts, useCurrentAccount, useSessionKey, type Profile } from "@/lib/account-store";
import { placeOrder } from "@/lib/actions/order";
import { useCart, useHydrated, usePricedCart } from "@/lib/cart-store";
import type { StorefrontCatalog } from "@/lib/catalog";
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

export function CheckoutForm({ catalog }: { catalog: StorefrontCatalog }) {
  const hydrated = useHydrated();
  const { items } = usePricedCart(catalog);
  const account = useCurrentAccount();

  if (!hydrated) return <div className="mt-8 h-96 animate-pulse rounded-lg bg-blue-tint" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-lg border border-dashed border-black/25 px-6 py-16 text-center">
        <p className="text-xl font-bold">Your cart is empty</p>
        <p className="mt-1 text-muted">Add products to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href={routes.shop}>Start shopping</Link>
        </Button>
      </div>
    );
  }

  // Rendered only after hydration, so the form's default values can come from the saved account.
  return <CheckoutFormFields catalog={catalog} account={account} />;
}

function CheckoutFormFields({ catalog, account }: { catalog: StorefrontCatalog; account: Profile | null }) {
  const router = useRouter();
  const { items } = usePricedCart(catalog);
  const clearCart = useCart((s) => s.clear);
  const addOrder = useOrders((s) => s.addOrder);
  const sessionKey = useSessionKey();
  const updateProfile = useAccounts((s) => s.updateProfile);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveDetails, setSaveDetails] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput, unknown, CheckoutDetails>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: account?.name ?? "",
      email: account?.email ?? "",
      phone: account?.phone ?? "",
      address: account?.address ?? { line1: "", line2: "", city: "", zip: "" },
      notes: "",
      website: "",
    },
  });

  const totals = priceCart(items);

  async function onSubmit(details: CheckoutDetails) {
    setFormError(null);
    try {
      const result = await placeOrder(
        details,
        items.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      );
      if (!result.ok) {
        for (const [path, message] of Object.entries(result.fieldErrors ?? {})) setError(path as Path, { message });
        setFormError(result.error);
        return;
      }
      if (sessionKey && saveDetails) updateProfile({ phone: details.phone, address: details.address });
      addOrder({ ...result.order, account: sessionKey ?? undefined });
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
  const zip = field("address.zip", "address-zip", true);
  const notes = field("notes", "notes");
  const terms = field("acceptTerms", "accept-terms");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem] lg:gap-10">
      <div className="space-y-6">
        {/* Honeypot: hidden from people and assistive tech. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {!account && (
          <p className="rounded-md border border-line bg-blue-tint px-4 py-3 text-sm">
            Checking out as a guest.{" "}
            <Link
              href={`${routes.login}?next=${encodeURIComponent(routes.checkout)}`}
              className="font-semibold text-blue underline underline-offset-4"
            >
              Log in to prefill your details
            </Link>
          </p>
        )}

        <FormSection step={1} title="Contact">
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

        <FormSection step={2} title="Shipping address">
          <p className="-mt-2 mb-4 text-sm text-muted">We ship to addresses in the United States only.</p>
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
              <select {...state.props} autoComplete="shipping address-level1" className={inputClass}>
                <option value="">Select</option>
                {US_STATES.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={zip.id} label="ZIP code" error={zip.error} hint="e.g. 82801" className="sm:col-span-1">
              <input {...zip.props} inputMode="numeric" autoComplete="shipping postal-code" className={inputClass} />
            </Field>
            <Field id="address-country" label="Country" className="sm:col-span-6">
              <input id="address-country" value="United States" readOnly className={`${inputClass} bg-blue-tint`} />
            </Field>
          </div>
          {account && (
            <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className="size-4 accent-blue"
              />
              Save my phone and address to my account on this device
            </label>
          )}
        </FormSection>

        <FormSection step={3} title="Review your order">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((line) => (
              <li key={line.slug} className="flex items-center gap-3 py-3">
                <div className="relative size-14 shrink-0 rounded-md bg-blue-tint">
                  <span className="absolute inset-1 overflow-hidden rounded bg-white">
                    <Image src={line.image} alt="" fill sizes="3.5rem" className="object-contain" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="line-clamp-2 font-medium">{line.name}</p>
                  <p className="mt-0.5 text-muted tabular-nums">
                    {line.quantity} × {formatPrice(line.price)}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">{formatPrice(line.price * line.quantity)}</p>
              </li>
            ))}
          </ul>
          <Link
            href={routes.cart}
            className="mt-3 inline-block text-sm font-semibold text-blue underline underline-offset-4"
          >
            Edit cart
          </Link>
          <Field id={notes.id} label="Order note" optional error={notes.error} className="mt-6">
            <textarea
              {...notes.props}
              rows={3}
              placeholder="Anything we should know about your order or delivery?"
              className={`${inputClass} h-auto py-2.5`}
            />
          </Field>
        </FormSection>
      </div>

      <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="text-xl">Order summary</h2>
          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="font-semibold">
              Subtotal ({totals.items} {totals.items === 1 ? "item" : "items"})
            </span>
            <span className="text-2xl font-bold text-blue tabular-nums">{formatPrice(totals.subtotal)}</span>
          </div>
          <p className="mt-1 text-sm text-muted">Shipping and tax confirmed with your order.</p>

          <div className="mt-5 flex gap-3 rounded-md bg-blue-tint p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden />
            <p>
              <strong>No payment is taken online.</strong> After you place your order, our team will contact you to
              confirm availability, shipping and payment.
            </p>
          </div>

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input type="checkbox" {...terms.props} className="mt-0.5 size-4 shrink-0 accent-blue" />
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-blue underline underline-offset-4">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/returns-policy" target="_blank" className="text-blue underline underline-offset-4">
                  Returns Policy
                </Link>
                .
              </span>
            </label>
            {terms.error && <FieldError id={`${terms.id}-error`}>{terms.error}</FieldError>}
          </div>

          {formError && <FormAlert className="mt-4">{formError}</FormAlert>}

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Placing order…" : "Place Order"}
          </Button>
        </div>
      </aside>
    </form>
  );
}
