# Design notes

The two reference sites were used as **inspiration only**. No logos, images, copy, product data or brand names from either site are used.

- **Theme / visual style:** bbsports.co.uk. One strong primary blue, very dark neutrals for the nav and footer, and white content areas.
- **Layout / structure:** superiormatesltd.co.uk (WooCommerce / WoodMart). Top bar, sticky header with icon counts, left filter sidebar, underline tabs on the product page, link-column footer.

## Direction

A **normal, simple online store** built from a strict three-colour palette. An earlier "playful" pass (hard offset shadows, tilted stickers, floating shapes, marquee) was rejected by the client as too playful. Keep things conventional and easy to shop.

## Colour

| Role                                  | Token        | Hex       |
| ------------------------------------- | ------------ | --------- |
| Primary: buttons, prices, links, hero | `blue`       | `#0066FF` |
| Blue hover / pressed                  | `blue-hover` | `#0052CC` |
| Light blue backgrounds (≈10% blue)    | `blue-tint`  | `#E6F0FF` |
| Focus rings, chip hover (≈20% blue)   | `blue-soft`  | `#CCE0FF` |
| Text, top bar, footer, secondary btn  | `black`      | `#000000` |
| Page background, text on blue/black   | `white`      | `#FFFFFF` |
| Borders and dividers                  | `line`       | `#E5E5E5` |
| Secondary text                        | `muted`      | `#6B6B6B` |

- Tailwind's default colours are removed in `app/globals.css` (`--color-*: initial`), so only these tokens exist.
- No other hues: no red, green or amber. Errors are black text with a blue alert icon; form alerts are blue-outlined boxes.
- Contrast: white on `#0066FF` and `#0066FF` on white are about 4.8:1 (AA). `muted` on white is about 5.3:1.
- On blue sections add the `surface-blue` class so focus rings turn white.

## Typography

- **DM Sans** for everything (headings bold, body regular, 15px base).
- Section headings are sentence-case and left-aligned, with one word highlighted in blue, e.g. "Shop by **Category**".

## Header / navigation

- Black slim top bar: "Fast US shipping • Genuine brands" on the left, phone and email on the right (desktop).
- Sticky white main row with a 1px bottom border and a soft shadow once scrolled. Logo, then Home, Shop and a Categories mega-menu built from `products.json` categories. Search, account, wishlist (count) and cart (count) on the right.
- Mobile: burger on the left opens a drawer with search, links, categories and contact details.

## Hero

Full-width blue banner. Tagline headline in white, one line of copy, a black "Shop Now" button and a white outline "About us" button. On the right, three featured products in white cards with brand and price. No slider, no decorative shapes.

## Product card

White card, 1px border, small radius. Image on a light-blue tint, small "New" / "Featured" / "Low stock" label top-left, wishlist heart top-right. Brand, name (2-line clamp), blue price and a full-width blue "Add to Cart" button. Soft shadow on hover.

## Collection page

Light-blue page header with breadcrumbs, title and description. Left filter sidebar (category, brand, availability, price) that becomes a drawer on mobile. Toolbar: result count, sort, grid/list toggle. Numbered pagination. All state is in URL search params.

## Product page

Breadcrumbs, then gallery (hover zoom, thumbnails) on the left and brand, name, stock, SKU/UPC, price, quantity (1–10), Add to Cart, Buy Now, Add to wishlist and highlights on the right. Underline tabs: Description, Specifications, Shipping & Returns. Related products from the same category below.

## Footer

Black. Logo and short description; Quick links (Shop, Wishlist, My Account, About us); Policies; Contact us with the legal name, full address, phone and email. Copyright line. No newsletter, social icons or payment icons.

## Motion

Short fades on scroll (`Reveal`, 350ms) and a small pop on the header count badges. Everything respects `prefers-reduced-motion`.
