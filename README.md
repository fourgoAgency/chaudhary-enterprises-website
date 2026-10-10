# Chaudhary Enterprises LLC — online store

Retail store for [chaudharyenterprisesllc.com](https://chaudharyenterprisesllc.com), built with Next.js (App Router), TypeScript, Tailwind CSS, react-hook-form + zod and Motion.

There is **no payment gateway and no database**. Products come from a JSON file, pages are statically generated, and customer data (cart, wishlist, accounts, order history) lives in the customer's own browser. When a customer places an order, the site emails it to the business.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the SMTP settings (see "How orders arrive")
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command                | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm run build`        | Production build (also type-checks) |
| `npm start`            | Serve the production build          |
| `npm run lint`         | ESLint                              |
| `npm run typecheck`    | TypeScript only                     |
| `npm run format`       | Prettier (write)                    |
| `npm run format:check` | Prettier (check only)               |

## Adding or editing products

Everything is in `data/products.json`:

- `categories[]`: `name`, `slug`, `description`. Navigation, home tiles and shop filters are built from this list, in this order. A category only appears once it has at least one product.
- `products[]`: `id`, `sku`, `slug`, `upc`, `name`, `brand`, `category`, `categorySlug`, `description`, `highlights[]`, `specifications{}`, `price` (US dollars, e.g. `19.99`), `currency` (`"USD"`), `stockStatus` (`in_stock`, `low_stock` or `out_of_stock`), `images[]`, `featured` (`true` shows it on the home page).

Images go in `public/products/`, and each path in `images[]` starts with `/products/…` (for example `/products/my-product-1.jpg`). Square images look best. If a listed image file is missing, a placeholder is shown.

The build fails with a clear message if a product has an unknown `categorySlug`, an invalid `stockStatus`, no price, or a duplicate `id`/`slug`/`sku`. Run `npm run build` after editing to check.

All catalog reads go through `lib/catalog.ts`, so the JSON file can later be replaced by another data source without touching the pages.

Policy text lives in `content/policies/*.md`. Business details (name, address, phone, email) are in `lib/site.ts`; home-page copy is in `data/company.ts`.

## How orders arrive

1. The customer fills in checkout (contact details, US shipping address, optional note) and clicks **Place Order**. No payment is taken.
2. The server re-checks every product and price against the catalog, gives the order a number like `CE-20261010-4821`, and **emails it** to `admin@chaudharyenterprisesllc.com` (reply-to is set to the customer). The customer also gets a confirmation email.
3. The customer sees a confirmation page with the order number, a summary and a **Copy order details** button. The order is saved in their browser's order history.
4. Your team contacts the customer to confirm availability, shipping and payment.

Emails are sent over SMTP using your email provider's settings. Set these environment variables (see `.env.example`):

| Variable                     | Example                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `SMTP_HOST`                  | `smtp.gmail.com`, `smtp.office365.com`, `smtp.zoho.com`, …           |
| `SMTP_PORT` / `SMTP_SECURE`  | `465` + `true` (SSL), or `587` + `false` (STARTTLS)                  |
| `SMTP_USER` / `SMTP_PASS`    | The mailbox login (often an app password)                            |
| `MAIL_FROM` (optional)       | Sender shown on emails                                               |
| `ORDERS_TO_EMAIL` (optional) | Inbox for new orders (defaults to admin@chaudharyenterprisesllc.com) |
| `NEXT_PUBLIC_SITE_URL`       | `https://chaudharyenterprisesllc.com` (canonical URLs, sitemap)      |

In development without SMTP settings, order emails are printed to the terminal instead. In production without them, placing an order shows an error, so set them before going live.

## Limitations: data stays in the customer's browser

Accounts, wishlists, carts and order history are stored in the browser's `localStorage`:

- They exist **only on that device and browser**. Logging in on another phone or computer won't show them, and clearing site data removes them.
- An account is a convenience profile (prefilled checkout, saved wishlist, order history), not secure server-side authentication. Passwords are never stored in plain text (only a salted SHA-256 hash), but anyone with access to the device's browser profile can read the stored data.
- There is no "forgot password" email. Customers are pointed to the store's email address instead.
- The business's record of an order is the order email, not the website.

## Deploying to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, **Add New → Project** and import the repository. The defaults (framework: Next.js, `npm run build`) are correct.
3. Under **Settings → Environment Variables**, add the SMTP variables and `NEXT_PUBLIC_SITE_URL` listed above.
4. Deploy, then add `chaudharyenterprisesllc.com` under **Settings → Domains** and follow the DNS instructions.
5. Place a test order and check that the email arrives.

## Project layout

```
app/                 Routes (home, shop, product, cart, checkout, account, wishlist, policies, sitemap, robots)
components/          UI components, grouped by feature
content/policies/    Policy page text (Markdown)
data/                products.json, its loader, and home-page copy
docs/design-notes.md Visual design notes
lib/                 Catalog, browser stores (cart, wishlist, accounts, orders), order email, validation
public/products/     Product images
```
