import { Suspense } from "react";
import { AuthForms } from "@/components/account/auth-forms";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function AuthPage({ initial }: { initial: "login" | "register" }) {
  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={[{ label: initial === "login" ? "Login" : "Create account" }]} />
      <h1 className="mt-4 text-3xl sm:text-4xl">My account</h1>
      {/* Reads ?next= from the URL, so it renders on the client. */}
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-lg bg-blue-tint" />}>
        <AuthForms initial={initial} />
      </Suspense>
    </div>
  );
}
