import type { MailMessage } from "@/lib/mailer";
import type { CheckoutDetails } from "@/lib/order-schema";
import { formatPrice } from "@/lib/pricing";
import { formattedAddress, site } from "@/lib/site";

export type PlacedOrderLine = {
  slug: string;
  sku: string;
  upc?: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

/** An order as confirmed by the server. Stored in the customer's browser for order history. */
export type PlacedOrder = {
  number: string;
  placedAt: string;
  lines: PlacedOrderLine[];
  totals: { subtotal: number; items: number };
  name: string;
  email: string;
  phone: string;
  shipTo: string;
  notes: string;
};

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function formatAddress(a: CheckoutDetails["address"]) {
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`].filter(Boolean).join(", ");
}

function linesTable(order: PlacedOrder) {
  const cell = 'style="padding:8px 10px;border-bottom:1px solid #e5e5e5;text-align:left"';
  const num = 'style="padding:8px 10px;border-bottom:1px solid #e5e5e5;text-align:right;white-space:nowrap"';
  const rows = order.lines
    .map(
      (l) => `<tr>
  <td ${cell}><strong>${escape(l.name)}</strong><br><span style="color:#6b6b6b;font-size:12px">SKU ${escape(l.sku)}${l.upc ? ` · UPC ${escape(l.upc)}` : ""}</span></td>
  <td ${num}>${l.quantity}</td>
  <td ${num}>${formatPrice(l.price)}</td>
  <td ${num}>${formatPrice(l.lineTotal)}</td>
</tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:14px">
<thead><tr style="background:#e6f0ff"><th ${cell}>Product</th><th ${num}>Qty</th><th ${num}>Price</th><th ${num}>Total</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr><td colspan="3" ${num}><strong>Subtotal (${order.totals.items} items)</strong></td><td ${num}><strong>${formatPrice(order.totals.subtotal)}</strong></td></tr></tfoot>
</table>`;
}

function linesText(order: PlacedOrder) {
  return [
    ...order.lines.map(
      (l) =>
        `- ${l.name} (SKU ${l.sku}${l.upc ? `, UPC ${l.upc}` : ""}): ${l.quantity} × ${formatPrice(l.price)} = ${formatPrice(l.lineTotal)}`,
    ),
    `Subtotal (${order.totals.items} items): ${formatPrice(order.totals.subtotal)}`,
  ].join("\n");
}

function wrap(body: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#000000;max-width:680px;margin:0 auto;line-height:1.5">${body}
<p style="margin-top:32px;color:#6b6b6b;font-size:12px">${escape(site.name)} · ${escape(formattedAddress)} · ${escape(site.contact.phone)} · ${escape(site.contact.email)}</p></div>`;
}

export function buildOrderEmails(
  order: PlacedOrder,
  d: CheckoutDetails,
  ordersTo: string,
): { admin: MailMessage; customer: MailMessage } {
  const details: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Ship to", order.shipTo],
    ["Order notes", d.notes || "None"],
  ];
  const placed = new Date(order.placedAt).toLocaleString("en-US", {
    timeZone: "America/Denver",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const adminHtml = wrap(`
<h2 style="color:#0066ff">New order ${escape(order.number)}</h2>
<p>I want to order the following products. Placed ${escape(placed)} (Mountain Time).</p>
${linesTable(order)}
<h3 style="color:#000000;margin-top:28px">Customer</h3>
<table style="border-collapse:collapse;font-size:14px">${details
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#6b6b6b;vertical-align:top">${escape(k)}</td><td style="padding:4px 0;white-space:pre-line">${escape(v)}</td></tr>`,
    )
    .join("")}</table>
<p style="margin-top:20px">Reply to this email to contact the customer.</p>`);

  const adminText = `New order ${order.number}
I want to order the following products. Placed ${placed} (Mountain Time).

${linesText(order)}

${details.map(([k, v]) => `${k}: ${v}`).join("\n")}`;

  const customerHtml = wrap(`
<h2 style="color:#0066ff">We've received your order</h2>
<p>Hi ${escape(d.name)},</p>
<p>Thank you for your order <strong>${escape(order.number)}</strong>. Our team will contact you to confirm availability, shipping and payment. No payment has been taken yet.</p>
${linesTable(order)}
<p style="margin-top:20px"><strong>Ship to:</strong> ${escape(order.shipTo)}</p>
<p>Questions? Reply to this email or call ${escape(site.contact.phone)}.</p>`);

  const customerText = `Hi ${d.name},

Thank you for your order ${order.number}. Our team will contact you to confirm availability, shipping and payment. No payment has been taken yet.

${linesText(order)}

Ship to: ${order.shipTo}

Questions? Reply to this email or call ${site.contact.phone}.

${site.name}`;

  return {
    admin: {
      to: ordersTo,
      subject: `New order ${order.number} from ${d.name}`,
      html: adminHtml,
      text: adminText,
      replyTo: d.email,
    },
    customer: {
      to: d.email,
      subject: `Your order ${order.number} with ${site.shortName}`,
      html: customerHtml,
      text: customerText,
    },
  };
}

/** Plain-text order summary for the "Copy order details" button. */
export function orderDetailsText(order: PlacedOrder) {
  const placed = new Date(order.placedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  return `Order ${order.number} (${placed})
${site.name}

${linesText(order)}
Shipping and tax to be confirmed.

Name: ${order.name}
Email: ${order.email}
Phone: ${order.phone}
Ship to: ${order.shipTo}
Order notes: ${order.notes || "None"}`;
}
