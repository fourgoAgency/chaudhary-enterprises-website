import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/lib/site";

// SMTP email (orders and quote requests). Server-only: never import this from a Client Component.
//
// Settings come from environment variables so the SMTP password is never committed to git.
// Put them in .env.local for development and in your host's environment settings in production.
// See .env.example for the list.

export const mailConfig = {
  host: process.env.SMTP_HOST || "",
  /** 465 = SSL/TLS (secure: true), 587 = STARTTLS (secure: false). */
  port: Number(process.env.SMTP_PORT || 465),
  secure: (process.env.SMTP_SECURE || "true") === "true",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  /** Sender shown on emails. Must be an address your SMTP account is allowed to send from. */
  from: process.env.MAIL_FROM || `"${site.shortName}" <${site.contact.email}>`,
  /** Inbox that receives new orders and quote requests. */
  ordersTo: process.env.ORDERS_TO_EMAIL || site.contact.email,
};

export function isMailConfigured() {
  return Boolean(mailConfig.host && mailConfig.user && mailConfig.pass);
}

let transporter: Transporter | undefined;

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: { user: mailConfig.user, pass: mailConfig.pass },
  });
  return transporter;
}

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export async function sendMail(message: MailMessage) {
  if (!isMailConfigured()) {
    throw new Error("SMTP is not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  }
  await getTransporter().sendMail({ from: mailConfig.from, ...message });
}
