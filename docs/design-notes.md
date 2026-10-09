# Design notes

These notes come from studying the two reference sites in October 2026. We use them for **inspiration only**. No logos, images, copy, product data or brand names from either site are used. Each section first says what the reference does, then what we will do for Chaudhary Enterprises LLC.

- **Theme / visual style:** bbsports.co.uk. This is a custom PHP trade catalogue for a wholesale distributor.
- **Layout / structure:** superiormatesltd.co.uk. This is WordPress + WooCommerce on the WoodMart theme.

---

## 1. Colour usage

**Reference (BB Sports)**

- One strong primary colour (`#00f`) carries everything: headings, buttons and the footer top border.
- Very dark neutrals (`#111` / `#000` / `#004`) are used for the nav bar and footer.
- Content areas are white.
- A red angled "sale" flag is the only extra accent.
- The lesson: **one primary + dark anchors + a single accent** reads as a confident trade supplier.

**Ours** — the same structure, but in a premium register:

| Role                                                 | Token         | Hex       |
| ---------------------------------------------------- | ------------- | --------- |
| Primary (headings, primary buttons, nav text)        | `navy`        | `#14213D` |
| Dark sections (top bar, footer, hero overlay)        | `navy-deep`   | `#0E1626` |
| Accent (thin rules, small labels, focus ring, hover) | `gold`        | `#B8924A` |
| Section background, alternating                      | `ivory`       | `#F4EEE2` |
| Page background                                      | `ivory-light` | `#FAF8F3` |
| Body text                                            | `ink`         | `#1A1A1A` |
| Secondary text                                       | `muted`       | `#5B6170` |
| Gold text on light backgrounds                       | `gold-dark`   | `#7A5A24` |

How we use the colours:

- **Gold is for lines and labels only.** Never use it for body text on ivory: `#B8924A` on `#FAF8F3` is about 2.8:1, which fails AA for text.
- **Gold text on navy is fine.** It is about 5.6:1, so gold is OK for small uppercase labels on dark sections.
- **On light backgrounds, use `gold-dark` (`#7A5A24`, the logo's darkest gradient stop)** when a gold label is needed. It is about 5.5:1 on `#F4EEE2` and 6:1 on `#FAF8F3`.
- **Muted text** `#5B6170` is about 5.4:1 on `#F4EEE2`, so it passes AA.
- **The logo's gold gradient** appears only in the logo, the seal motif and one hairline divider style.
- **No red sale flags.** Badges such as "Bulk deal" or "Low stock" are navy/ivory pills with a gold hairline border.

## 2. Typography feel

**Reference:**

- BB Sports uses Arial/Verdana with uppercase bold headings. It feels loud and sporty.
- WoodMart uses a geometric sans for titles, Lato for body, and **uppercase 13px bold nav links**.

**Ours:**

- **Cormorant Garamond (500/600) for headings.**
  - Section titles are uppercase, with tracking of about `0.12em`.
  - Product titles and the hero headline use sentence case at large sizes.
- **Montserrat for body, nav, buttons and labels.**
  - Body text is 15–16px, weight 400, line-height 1.7.
  - Nav and buttons are 12–13px, uppercase, tracking `0.14em`, weight 500–600. This mirrors the WoodMart nav treatment.
  - Eyebrow labels above section titles are 11px, uppercase, tracking `0.3em`, in gold.

## 3. Header / navigation structure

**Reference (WoodMart pattern on Superior Mates):**

- A thin promo **top bar** carries a contact message and social icons.
- The **main row** has the logo on the left, the uppercase nav, and search/wishlist/cart icons with counts on the right.
- The header is **sticky** with a shadow.
- On mobile: burger on the left, logo in the centre, cart on the right.
- BB Sports adds a utility row (login / contact / phone) and a nav bar that also sticks.

**Ours:**

- **Top bar** (`navy-deep`, 36px):
  - Left: a wholesale message ("Wholesale supply for Amazon sellers · Tiered bulk pricing").
  - Right: email/phone on desktop.
- **Main row** (ivory-light, about 80px desktop / 64px mobile):
  - Full logo on the left.
  - Centred nav: Home, Shop, About, Contact.
  - Right: search, then cart with a count badge.
  - A gold hairline sits under the header.
- **Sticky:** the main row sticks and gains a soft shadow once scrolled. The top bar scrolls away.
- **Mobile:** burger on the left, the **CE monogram** in the centre, cart on the right. The burger opens a left drawer with nav links, search and contact details.

## 4. Hero style

**Reference:**

- Superior Mates uses a full-width fading slider with a zoom-in animation and a solid colour behind each slide.
- BB Sports uses one bold banner with a headline, sub-headline, and two offer lines (volume discount, free delivery threshold).

**Ours:**

- **One static hero, no slider.** Sliders hurt LCP and accessibility.
- Full-bleed `navy-deep` with a subtle image or texture.
- Content:
  - A gold eyebrow ("Wholesale · B2B")
  - A large Cormorant headline
  - One line of supporting copy
  - Two CTAs: **Shop Wholesale** (solid gold on navy) and **Request a Quote** (outline ivory)
- Under the hero we borrow BB Sports' "offer lines" idea as a **three-item trust row**: tiered pricing, fast dispatch, FBA-ready.

## 5. Product card layout

**Reference:**

- WoodMart cards are square-cornered with a square image. Hover reveals quick actions.
- Order: category label → title → price → Add to cart.
- BB Sports adds a "New in" / "Back in stock" flag and centres title and price.

**Ours** (square corners, which matches WoodMart's `0px` radius and our premium feel):

1. Image in a 1:1 ratio on an ivory background, with a 1px border that turns gold on hover. A slight zoom on hover, with reduced-motion respected.
2. Optional badge, top-left (e.g. "Bestseller", "Low stock").
3. Category / brand eyebrow (11px uppercase, muted).
4. Title (Cormorant, 2-line clamp).
5. **"From £X / unit"**, which is the lowest tier price.
6. **"MOQ: N · Case of M"** in small muted text.
7. A full-width "View product" / "Add to cart" button.

There is no quick view or wishlist. That keeps the scope tight and the cards calm.

## 6. Collection grid + filter placement

**Reference:**

- Superior Mates puts a **left sidebar** (3/12 columns) on the left: price slider and stock status.
- On tablet and mobile the sidebar becomes a **"Show sidebar" filter drawer**.
- The grid is 3 columns.
- The toolbar holds per-page and grid/list toggles, sort, and numbered pagination.
- The page header has the centred title and breadcrumbs.
- BB Sports also offers **grid/list toggle**, sort by price/new, and per-page.

**Ours:**

- **Page header:** breadcrumbs, centred uppercase title, gold hairline.
- **Desktop:** left sidebar (about 260px) with collapsible filter groups:
  - Category
  - Brand
  - Price range (min/max inputs)
  - In stock only
  - MOQ range
- **Mobile:** a "Filters" button opens a left drawer holding the same component.
- **Toolbar:** result count on the left; sort (Featured / Price ↑ / Price ↓ / Newest) and grid/list toggle on the right.
- **Grid:** 3 columns on desktop, 2 on tablet, 1–2 on mobile. List view uses a horizontal card that also shows the tier table summary.
- **Pagination:** numbered, at the bottom.
- **URL state:** every filter, sort, view and page lives in URL search params.

## 7. Product page layout

**Reference (WoodMart):**

- Gallery on the left with a **vertical thumbnail strip** and click-to-zoom.
- Info column on the right: breadcrumbs → title → price → short description → qty + Add to cart → meta.
- Below: **underline-style tabs** that become accordions on mobile.
- Related products carousel at the bottom.

**Ours:**

- **Breadcrumbs** at the top.
- **Two-column layout** (55 / 45):
  - **Gallery:** main image with hover/click zoom. Thumbnails sit to the left on desktop and below on mobile.
  - **Info column, in order:**
    1. Brand eyebrow
    2. Title
    3. SKU / ASIN line
    4. Stock status
    5. **Tier price table** (current tier highlighted)
    6. MOQ + case pack
    7. MOQ-aware quantity stepper with live unit price and line total
    8. **Add to Cart** (primary)
    9. **Request Bulk Quote** (secondary, opens a form)
    10. Small trust list
- **Tabs** (underline style, gold active rule): Description, Specifications, Shipping.
- **Related products:** a 4-up grid (no carousel).

## 8. Footer structure

**Reference:**

- BB Sports: black footer with a coloured top border, a contact block (phone, hours, VAT/EORI, address, email) and legal links.
- Superior Mates: brand blurb with address, phone and email; Categories and Pages link columns; copyright line.

**Ours** (`navy-deep`, with a gold hairline on top):

- **Row 1** (four columns on desktop, stacked on mobile):
  1. Logo (dark variant), a short description, social icons.
  2. Quick links: Shop, About, Contact, categories.
  3. Customer service: Shipping & Returns, Privacy, Terms, FAQ (`/contact#faq`).
  4. Contact details (email, phone, address, hours), then the newsletter signup.
- **Row 2:** payment icons (Visa, Mastercard, Amex, Apple Pay, Google Pay; Stripe-supported), then "© {year} Chaudhary Enterprises LLC. All rights reserved."
