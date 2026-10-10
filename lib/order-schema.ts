import { z } from "zod";
import { STATE_CODES } from "@/lib/us-states";

// Checkout form validation, shared by the browser form and the server action.

const required = (message: string, max = 120) => z.string().trim().min(1, message).max(max, "That's too long");

export const addressSchema = z.object({
  line1: required("Enter the street address"),
  line2: z.string().trim().max(120, "That's too long"),
  city: required("Enter the city", 80),
  state: z.enum(STATE_CODES, { error: "Choose a state" }),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code"),
});

export const checkoutSchema = z.object({
  name: required("Enter your full name", 80),
  email: z.email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s().-]{7,25}$/, "Enter a valid phone number"),
  address: addressSchema,
  notes: z.string().trim().max(1000, "That's too long"),
  acceptTerms: z.literal(true, { error: "Please accept the Terms & Conditions" }),
  /** Honeypot: hidden from people, filled in by bots. */
  website: z.string().max(0).optional(),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutDetails = z.output<typeof checkoutSchema>;

export const orderItemsSchema = z
  .array(z.object({ slug: z.string().max(200), quantity: z.number().int().positive() }))
  .min(1, "Your cart is empty")
  .max(100);
