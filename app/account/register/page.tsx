import type { Metadata } from "next";
import { AuthPage } from "@/components/account/auth-page";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false },
  alternates: { canonical: "/account/register" },
};

export default function RegisterPage() {
  return <AuthPage initial="register" />;
}
