"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Heart, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { describedBy, Field, FormAlert, inputClass } from "@/components/ui/field";
import {
  addressFormSchema,
  passwordSchema,
  profileSchema,
  type PasswordInput,
  type ProfileInput,
} from "@/lib/account-schema";
import { useAccounts, useCurrentAccount, useSessionKey, type Profile } from "@/lib/account-store";
import { useHydrated } from "@/lib/cart-store";
import type { ShippingAddress } from "@/lib/order-schema";
import { ordersForAccount, useOrders } from "@/lib/order-store";
import { formatPrice } from "@/lib/pricing";
import { routes } from "@/lib/site";
import { US_STATES } from "@/lib/us-states";
import { useWishlist, useWishlistStore } from "@/lib/wishlist-store";

export function AccountDashboard() {
  const router = useRouter();
  const hydrated = useHydrated();
  const account = useCurrentAccount();
  const logout = useAccounts((s) => s.logout);

  // Signed out: send to login, then back here.
  useEffect(() => {
    if (hydrated && !account) router.replace(`${routes.login}?next=${encodeURIComponent(routes.account)}`);
  }, [hydrated, account, router]);

  if (!hydrated || !account)
    return <div className="mt-8 h-96 animate-pulse rounded-lg bg-blue-tint" aria-busy="true" />;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg">
          Hello, <strong>{account.name}</strong>
        </p>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            router.push(routes.home);
          }}
        >
          <LogOut aria-hidden />
          Log out
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <OrderHistory />
          <ProfileCard account={account} />
          <AddressCard address={account.address} />
        </div>
        <div className="space-y-6">
          <WishlistCard />
          <PasswordCard />
          <DeleteCard />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line p-5 sm:p-6">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Saved({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-blue">
      <Check className="size-4" aria-hidden />
      Saved
    </p>
  );
}

function useSavedFlag() {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);
  return [saved, () => setSaved(true)] as const;
}

function OrderHistory() {
  const key = useSessionKey();
  const allOrders = useOrders((s) => s.orders);
  const orders = key ? ordersForAccount(allOrders, key) : [];

  return (
    <Card title="Order history">
      {orders.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted">You haven&apos;t placed any orders on this device yet.</p>
          <Button asChild size="sm">
            <Link href={routes.shop}>Start shopping</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {orders.map((order) => (
            <li key={order.number}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
                  <Package className="size-5 shrink-0 text-blue" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{order.number}</span>
                    <span className="text-sm text-muted">
                      {new Date(order.placedAt).toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
                      {order.totals.items} {order.totals.items === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(order.totals.subtotal)}</span>
                  <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="pb-4 pl-8 text-sm">
                  <ul className="space-y-1.5">
                    {order.lines.map((l) => (
                      <li key={l.slug} className="flex justify-between gap-4">
                        <Link href={`/product/${l.slug}`} className="hover:text-blue">
                          {l.quantity} × {l.name}
                        </Link>
                        <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-muted">Ship to: {order.shipTo}</p>
                  {order.notes && <p className="mt-1 text-muted">Note: {order.notes}</p>}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ProfileCard({ account }: { account: Profile }) {
  const updateProfile = useAccounts((s) => s.updateProfile);
  const [saved, markSaved] = useSavedFlag();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: account.name, phone: account.phone },
  });

  return (
    <Card title="Profile">
      <form
        noValidate
        onSubmit={handleSubmit((values) => {
          updateProfile(values);
          markSaved();
        })}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Field id="profile-name" label="Full name" error={errors.name?.message}>
          <input
            id="profile-name"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("profile-name", errors.name?.message)}
            className={inputClass}
            {...register("name")}
          />
        </Field>
        <Field id="profile-phone" label="Phone" optional error={errors.phone?.message}>
          <input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy("profile-phone", errors.phone?.message)}
            className={inputClass}
            {...register("phone")}
          />
        </Field>
        <Field id="profile-email" label="Email" className="sm:col-span-2">
          <input id="profile-email" value={account.email} readOnly className={`${inputClass} bg-blue-tint`} />
        </Field>
        <div className="flex items-center gap-4 sm:col-span-2">
          <Button type="submit">Save profile</Button>
          <Saved show={saved} />
        </div>
      </form>
    </Card>
  );
}

function AddressCard({ address }: { address?: ShippingAddress }) {
  const updateProfile = useAccounts((s) => s.updateProfile);
  const [saved, markSaved] = useSavedFlag();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: address ?? { line1: "", line2: "", city: "", zip: "" },
  });

  const input = (name: "line1" | "line2" | "city" | "zip", autoComplete: string) => {
    const id = `address-${name}`;
    const message = errors[name]?.message;
    return {
      id,
      message,
      props: {
        id,
        autoComplete: `shipping ${autoComplete}`,
        "aria-invalid": message ? true : undefined,
        "aria-describedby": describedBy(id, message),
        className: inputClass,
        ...register(name),
      },
    };
  };
  const line1 = input("line1", "address-line1");
  const line2 = input("line2", "address-line2");
  const city = input("city", "address-level2");
  const zip = input("zip", "postal-code");

  return (
    <Card title="Saved shipping address">
      <p className="-mt-2 mb-4 text-sm text-muted">Used to fill in checkout for you. US addresses only.</p>
      <form
        noValidate
        onSubmit={handleSubmit((values) => {
          updateProfile({ address: values });
          markSaved();
        })}
        className="grid gap-4 sm:grid-cols-6"
      >
        <Field id={line1.id} label="Street address" error={line1.message} className="sm:col-span-6">
          <input {...line1.props} />
        </Field>
        <Field id={line2.id} label="Apartment, suite or unit" optional error={line2.message} className="sm:col-span-6">
          <input {...line2.props} />
        </Field>
        <Field id={city.id} label="City" error={city.message} className="sm:col-span-3">
          <input {...city.props} />
        </Field>
        <Field id="address-state" label="State" error={errors.state?.message} className="sm:col-span-2">
          <select
            id="address-state"
            autoComplete="shipping address-level1"
            aria-invalid={errors.state ? true : undefined}
            aria-describedby={describedBy("address-state", errors.state?.message)}
            className={inputClass}
            {...register("state")}
          >
            <option value="">Select</option>
            {US_STATES.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={zip.id} label="ZIP code" error={zip.message} className="sm:col-span-1">
          <input {...zip.props} inputMode="numeric" />
        </Field>
        <div className="flex items-center gap-4 sm:col-span-6">
          <Button type="submit">Save address</Button>
          <Saved show={saved} />
        </div>
      </form>
    </Card>
  );
}

function WishlistCard() {
  const { slugs } = useWishlist();
  return (
    <Card title="Wishlist">
      <p className="flex items-center gap-2 text-muted">
        <Heart className="size-4 text-blue" aria-hidden />
        {slugs.length === 0
          ? "No saved products yet."
          : `${slugs.length} saved ${slugs.length === 1 ? "product" : "products"}.`}
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link href={routes.wishlist}>View wishlist</Link>
      </Button>
    </Card>
  );
}

function PasswordCard() {
  const changePassword = useAccounts((s) => s.changePassword);
  const [error, setError] = useState<string | null>(null);
  const [saved, markSaved] = useSavedFlag();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const input = (name: keyof PasswordInput, label: string, autoComplete: string) => {
    const id = `password-${name}`;
    const message = errors[name]?.message;
    return (
      <Field id={id} label={label} error={message}>
        <input
          id={id}
          type="password"
          autoComplete={autoComplete}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy(id, message)}
          className={inputClass}
          {...register(name)}
        />
      </Field>
    );
  };

  return (
    <Card title="Change password">
      <form
        noValidate
        onSubmit={handleSubmit(async (values) => {
          setError(null);
          const result = await changePassword(values.current, values.next);
          if (!result.ok) return setError(result.error ?? "Couldn't change your password.");
          reset();
          markSaved();
        })}
        className="space-y-4"
      >
        {input("current", "Current password", "current-password")}
        {input("next", "New password", "new-password")}
        {input("confirm", "Confirm new password", "new-password")}
        {error && <FormAlert>{error}</FormAlert>}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="secondary" disabled={isSubmitting}>
            Update password
          </Button>
          <Saved show={saved} />
        </div>
      </form>
    </Card>
  );
}

function DeleteCard() {
  const router = useRouter();
  const deleteAccount = useAccounts((s) => s.deleteAccount);
  const removeOrders = useOrders((s) => s.removeForAccount);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const [confirming, setConfirming] = useState(false);

  return (
    <Card title="Delete my account data">
      <p className="text-sm text-muted">
        Removes your account, saved address, wishlist and order history from this device. Orders you have already placed
        are not cancelled.
      </p>
      {confirming ? (
        <div className="mt-4 rounded-md border border-blue bg-blue-tint p-4">
          <p className="text-sm font-semibold">Are you sure? This can&apos;t be undone.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const key = deleteAccount();
                if (key) {
                  removeOrders(key);
                  clearWishlist(key);
                }
                router.push(routes.home);
              }}
            >
              Yes, delete my data
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" className="mt-4" onClick={() => setConfirming(true)}>
          Delete my account data from this device
        </Button>
      )}
    </Card>
  );
}
