import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false },
  alternates: { canonical: "/account" },
};

export default function AccountPage() {
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "My account" }]} />
      <h1 className="mt-4 text-3xl sm:text-4xl">My account</h1>
      <AccountDashboard />
    </div>
  );
}
