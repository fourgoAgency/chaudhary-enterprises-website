import type { Metadata } from "next";
import { AuthPage } from "@/components/account/auth-page";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false },
  alternates: { canonical: "/account/login" },
};

export default function LoginPage() {
  return <AuthPage initial="login" />;
}
