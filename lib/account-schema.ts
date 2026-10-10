import { z } from "zod";
import { addressSchema } from "@/lib/order-schema";

// Validation for the browser-only account forms.

const email = z.email("Enter a valid email address").max(200);
const newPassword = z.string().min(8, "Use at least 8 characters").max(200, "That's too long");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your full name").max(80, "That's too long"),
    email,
    password: newPassword,
    confirm: z.string(),
    acceptTerms: z.literal(true, { error: "Please accept the Terms & Conditions" }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name").max(80, "That's too long"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[\d\s().-]{7,25})?$/, "Enter a valid phone number"),
});

export const addressFormSchema = addressSchema;

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: newPassword,
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;

/** Only same-site paths are allowed as a post-login redirect. */
export function safeRedirect(next: string | null | undefined, fallback = "/account") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
