"use server";

import { randomInt } from "node:crypto";
import { getProductsBySlugs } from "@/lib/catalog";
import { isMailConfigured, mailConfig, sendMail } from "@/lib/mailer";
import { buildOrderEmails, formatAddress, type PlacedOrder } from "@/lib/order-email";
import { checkoutSchema, orderItemsSchema } from "@/lib/order-schema";
import { isValidQuantity, priceCart } from "@/lib/pricing";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export type PlaceOrderResult =
  { ok: true; order: PlacedOrder } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR = `Sorry, we couldn't send your order. Please try again, or email us at ${site.contact.email}.`;

function orderNumber(now: Date) {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, "");
  return `CE-${ymd}-${String(randomInt(0, 10_000)).padStart(4, "0")}`;
}

/**
 * Emails a new order to the store and a confirmation to the customer. Prices come from the
 * catalog; the browser only sends product slugs and quantities.
 */
export async function placeOrder(rawDetails: unknown, rawItems: unknown): Promise<PlaceOrderResult> {
  if (!rateLimit(`order:${await clientIp()}`, 5, 10 * 60_000)) {
    return { ok: false, error: "Too many orders from your connection. Please wait a few minutes and try again." };
  }

  const parsed = checkoutSchema.safeParse(rawDetails);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join("."), i.message]));
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const details = parsed.data;

  const items = orderItemsSchema.safeParse(rawItems);
  if (!items.success) return { ok: false, error: items.error.issues[0]?.message ?? "Your cart is invalid." };

  const now = new Date();
  const base = { number: orderNumber(now), placedAt: now.toISOString() };

  // Bots fill the hidden field. Pretend success so they learn nothing.
  if (details.website) {
    return {
      ok: true,
      order: { ...base, lines: [], totals: { subtotal: 0, items: 0 }, name: "", email: "", shipTo: "" },
    };
  }

  const products = await getProductsBySlugs(items.data.map((i) => i.slug));
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const problems: string[] = [];
  const lines: PlacedOrder["lines"] = [];

  for (const item of items.data) {
    const product = bySlug.get(item.slug);
    if (!product) {
      problems.push("A product in your cart is no longer available.");
      continue;
    }
    if (product.stock === "out_of_stock") problems.push(`${product.name} is out of stock.`);
    if (!isValidQuantity(item.quantity)) problems.push(`${product.name}: please choose a valid quantity.`);
    lines.push({
      slug: product.slug,
      sku: product.sku,
      upc: product.upc,
      name: product.name,
      image: product.images[0].src,
      quantity: item.quantity,
      price: product.price,
      lineTotal: product.price * item.quantity,
    });
  }
  if (problems.length) return { ok: false, error: `${problems.join(" ")} Please update your cart.` };

  const order: PlacedOrder = {
    ...base,
    lines,
    totals: priceCart(lines),
    name: details.name,
    email: details.email,
    shipTo: formatAddress(details.address),
  };
  const emails = buildOrderEmails(order, details, mailConfig.ordersTo);

  if (!isMailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("Order not sent: SMTP is not configured (see .env.example).");
      return { ok: false, error: GENERIC_ERROR };
    }
    // Development without SMTP: print the email so the flow can be tested.
    console.info(`[dev] SMTP not configured. Order email for ${emails.admin.to}:\n${emails.admin.text}`);
    return { ok: true, order };
  }

  try {
    await sendMail(emails.admin);
  } catch (error) {
    console.error("Failed to send order email", error);
    return { ok: false, error: GENERIC_ERROR };
  }
  // The order reached the store; a failed customer copy shouldn't fail the order.
  await sendMail(emails.customer).catch((error) => console.error("Failed to send customer confirmation", error));

  return { ok: true, order };
}
