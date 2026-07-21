# Atlas Labs E-Store — Design System

## 0. Design Thesis

Atlas Labs sells electronics — devices people research obsessively before they trust them. The design has to earn that trust in under a second: **precise, cool, immaculately clean, quietly premium.** Not a warehouse catalog, not a toy store. Think the showroom of a company that engineers its own hardware, not a marketplace reselling everyone else's.

The palette leans into **cool, bright, glacial tones** — the visual opposite of clutter and dust. Buttons are fully rounded (pill-shaped), spacing is generous, and typography is confident without shouting. The one idea every screen should reinforce: *this is precision, kept clean.*

**Signature element:** the **Spec Strip** — a thin, monospaced ribbon of tabular data with tick-mark dividers (§3), used wherever the product's technical truth needs to be shown plainly. It's the visual handshake between "clean lifestyle retail" and "this is actually engineered hardware."

---

## 1. Design Tokens

### 1.1 Color

Six named values. Everything in the UI derives from these — no ad hoc hex codes in components.

| Token | Hex | Role |
|---|---|---|
| `--frost-50` | `#F7FAFC` | Primary background. A near-white with a cool blue cast — never warm cream. |
| `--glacier-100` | `#EAF4F7` | Secondary surface: section backgrounds, subtle card fills, table stripes. |
| `--ink-900` | `#0B1B2E` | Primary text, footer, admin dark base. Cool near-black navy, not pure black. |
| `--signal-cyan-500` | `#14C6DE` | Primary accent. Primary buttons, links, focus rings, active nav state. |
| `--cobalt-600` | `#3457FF` | Secondary accent. Gradient partner to cyan, secondary CTAs, price emphasis, in-stock indicators when paired with mint. |
| `--mint-400` | `#35E0A6` | Tertiary accent. Success states, "in stock," savings badges, loyalty/reward highlights. Used sparingly — it's a spark, not a base. |

Supporting neutrals (derived, not brand-defining):
- `--steel-200` `#D3E1E8` — borders, dividers, the Spec Strip's tick marks.
- `--steel-500` `#7C93A3` — secondary/muted text, placeholder text, captions.
- `--danger-500` `#EF4444` — errors, destructive actions only (kept outside the brand palette on purpose — it should never feel like it belongs).

**Usage discipline:**
- Cyan is the *default* interactive color. Cobalt is reserved for moments of emphasis — sale pricing, "Buy now," hero gradients — so it keeps its weight.
- Mint appears only for positive/available states. It never doubles as a decorative color.
- Large surfaces stay in Frost White / Glacier. Ink Navy is used for text and for deliberately "dense" zones (footer, admin shell) — never as a default page background on the storefront.
- Gradients (cyan → cobalt, occasionally sweeping through a whisper of mint) are reserved for exactly two places: the homepage hero mesh and the admin dashboard's revenue chart accent. Everywhere else, colors are flat. A gradient that appears everywhere stops meaning anything.

### 1.2 Typography

Three roles, deliberately not the same three fonts every AI-generated interface reaches for.

| Role | Typeface | Why |
|---|---|---|
| **Display** | **Clash Display** | Geometric, confident, slightly technical letterforms — headlines that feel engineered rather than editorial. Used at Semibold/Bold only, and only for H1–H3. |
| **Body / UI** | **Satoshi** | A clean, warm-neutral grotesk that stays legible at small sizes across dense product data — labels, buttons, nav, body copy. |
| **Utility / Data** | **IBM Plex Mono** | Every price, SKU, spec value, order number, and countdown timer renders in mono. This is the tell that Atlas Labs takes its data seriously — it's the same move a spec sheet or a terminal makes, applied to retail. |

**Type scale** (base 16px, ratio 1.25):

| Token | Size / Line-height | Face | Use |
|---|---|---|---|
| `display-xl` | 56px / 1.05 | Clash Display Bold | Homepage hero only |
| `display-lg` | 40px / 1.1 | Clash Display Semibold | Category/PDP H1 |
| `display-md` | 28px / 1.2 | Clash Display Semibold | Section headers |
| `body-lg` | 18px / 1.5 | Satoshi Regular | Intro/lede paragraphs |
| `body-md` | 16px / 1.6 | Satoshi Regular | Default body |
| `body-sm` | 14px / 1.5 | Satoshi Medium | UI labels, nav, buttons |
| `caption` | 12px / 1.4 | Satoshi Medium, uppercase, +4% tracking | Eyebrows, badge text |
| `data-lg` | 24px / 1.2 | Plex Mono Medium | PDP price |
| `data-md` | 14px / 1.4 | Plex Mono Regular | Spec values, SKU, order # |

Rule: mono never appears in a full sentence. It labels a value, it doesn't narrate.

### 1.3 Spacing & Grid

8pt base unit. Atlas Labs reads as "clean" largely because of restraint here — err toward more whitespace, not less.

- Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`
- Storefront content max-width: `1280px`, gutter `24px` mobile / `48px` desktop.
- Product grid: 2 columns mobile → 3 tablet → 4 desktop, `24px` gutters, no gutter narrower than `16px` at any breakpoint.
- Section vertical rhythm: `96px` between major homepage sections desktop (`64px` mobile) — sections need room to breathe or the "premium" read collapses.

### 1.4 Radius & Elevation

- **Buttons: fully rounded — `border-radius: 999px` (pill).** This is the single most repeated shape in the system and should never be inconsistent — every button, filter chip, and tag follows it.
- Cards / panels: `20px`
- Inputs / selects: `14px`
- Images inside cards: `16px` (slightly tighter than the card that contains them, so the photo reads as "inset")
- Modals / sheets: `24px` top corners

Elevation is cool-toned, never a generic gray shadow:
```css
--shadow-sm: 0 1px 2px rgba(11, 27, 46, 0.06);
--shadow-md: 0 8px 24px rgba(11, 27, 46, 0.08);
--shadow-lg: 0 16px 48px rgba(20, 198, 222, 0.12); /* cyan-tinted, for hover/active elevation */
```
The cyan-tinted `shadow-lg` on hover is a small, deliberate signature: things that "lift" on this site glow faintly cool, not just darken underneath.

### 1.5 Iconography

`lucide-react`, stroke width `1.75`, rounded line caps — the slightly softer stroke matches the pill buttons instead of fighting them. Icons are always paired with a text label in primary navigation; icon-only buttons are reserved for compact contexts (cart quantity stepper, table row actions) and always carry a Tooltip.

---

## 2. The Spec Strip (Signature Element)

A horizontal, monospaced data ribbon that appears in four places:
1. **PDP**, directly beneath the image gallery — the product's 4–6 headline specs (e.g., `RAM 12GB · STORAGE 256GB · REFRESH 120Hz · BATTERY 5000mAh`), separated by thin `steel-200` tick marks like graduations on a ruler.
2. **Product cards** in dense/comparison contexts — a one-line condensed version.
3. **Footer**, as a quiet decorative echo (site-wide stats: `SKUS 12,480 · WAREHOUSES 6 · DELIVERY <24H`) — same visual grammar, different content, reinforcing the motif without repeating it literally.
4. **Compare table** headers — the tick-mark divider becomes the actual column rule.

```
┌────────────────────────────────────────────────────────────┐
│  RAM 12GB  ┃  STORAGE 256GB  ┃  REFRESH 120Hz  ┃  5000mAh  │
└────────────────────────────────────────────────────────────┘
```

Rendered in `data-md` (Plex Mono), uppercase labels in `caption` size above each value at wider breakpoints, tick marks in `--steel-200`. This is the one place in the whole system where a "structural device" is justified — it encodes real technical information, not decoration for its own sake.

---

## 3. Component Library

### Buttons
- **Primary:** solid `--signal-cyan-500` fill, `--ink-900` text is too dark on cyan — use `#04222B` (a near-ink derived from ink-900, shifted for AA contrast) or white text on `--cobalt-600` for the highest-emphasis "Buy now" variant. Pill radius, `14px` vertical padding, `28px` horizontal. Hover: `--shadow-lg` cyan glow + 2px lift, 150ms ease-out.
- **Secondary:** `--ink-900` 1.5px outline, transparent fill, `--ink-900` text. Hover: fills to `--glacier-100`.
- **Ghost:** no border, `--steel-500` text, used for tertiary actions (Cancel, Skip).
- **Destructive:** outline in `--danger-500`, fills solid only on confirm-dialog final action — never a default state, so destructive intent is never one misclick away.
- All buttons: `Satoshi Medium`, `body-sm`, letter-spacing +1%.

### Inputs & Forms (React Hook Form + shadcn `Form`)
- `14px` radius, `1px` `--steel-200` border, focus ring is a `2px` `--signal-cyan-500` outline with `2px` offset — never a color-only focus indicator.
- Labels: `caption` style, sit above the field (never inside as placeholder-only labels — accessibility and clarity both require it).
- Validation errors: inline below field, `--danger-500`, `body-sm`, paired with a small alert icon — written in plain cause-and-effect language ("Enter a valid email" not "Invalid input").

### Cards
- **Product card:** `20px` radius, `--frost-50` fill, `1px` `--steel-200` border (no shadow at rest — shadow only appears on hover, so the grid reads calm until you engage). Image `16px` inset radius on `--glacier-100` backdrop (product photography always sits on glacier, never pure white, so it reads "photographed in-studio" rather than "cutout on a blank canvas"). Price in `data-md` mono, discount badge top-left in mint or cobalt depending on whether it's stock-status or price-status.
- **Category card:** larger radius (`24px`), full-bleed image, gradient scrim (`ink-900` at 0%→40% opacity bottom) with `display-md` label overlaid — used sparingly, homepage/category-grid only.

### Badges
- Pill-shaped, `caption` type, `4px/12px` padding.
- Stock: mint fill / ink text = "In stock". Steel outline / steel text = "Backorder". 
- Discount: cobalt fill / white text, always shows the percentage, never just "Sale".
- Verified Purchase: outline badge, cyan check icon + steel text — quiet, not competing with pricing.
- Condition (New/Refurbished/Used): steel outline, always visible on refurbished/used listings — never hidden or de-emphasized, since it's trust-critical information.

### Navigation
- Sticky header, `--frost-50` at 92% opacity with backdrop-blur (the one place "glass" appears outside the hero) — clean but not heavy.
- Mega-menu for Categories: opens as a full-width panel on `--glacier-100`, category list left, featured brand tile right, Spec-Strip-style footer row showing "Trending this week" in mono.
- Mobile: bottom-anchored icon bar (Home, Search, Cart, Account) — thumb-reachable, since checkout-on-mobile is where conversions are won or lost.

### Tables (Admin data tables)
- Header row: `--glacier-100` fill, `caption` style, sticky on scroll.
- Row hover: `--frost-50` → `--glacier-100` shift, no border animation (keeps large tables calm).
- Row actions: icon buttons revealed on hover/focus only, each with a Tooltip.

### Modals, Sheets, Toasts
- Modals/dialogs: centered, `24px` top radius, `--shadow-lg`, scrim `--ink-900` at 45%.
- Mobile filters/cart preview: bottom Sheet, not a modal — keeps the pattern reachable one-handed.
- **Sonner toasts:** pill-shaped (matches button language), `--frost-50` fill with a `4px` left accent bar in the semantic color (mint success / danger error / cyan info), `body-sm` Satoshi. Positioned top-right desktop, top-center mobile.

### Skeletons
- `--glacier-100` base with a slow (1.8s) shimmer sweep in `--frost-50` — never a hard gray block. Skeleton shapes mirror the exact geometry of the content they precede (image block keeps the card's `16px` inset radius, price line is short and mono-width).

---

## 4. Motion & Interaction

- **Timing:** micro-interactions (hover, focus, toggle) at `150ms ease-out`. Page-level reveals at `300–400ms`, `cubic-bezier(0.16, 1, 0.3, 1)` (a gentle overshoot-free ease-out — confident, not bouncy).
- **Homepage hero:** one orchestrated load sequence — headline fades/rises first, aurora mesh gradient drifts ambiently and continuously behind it (very slow, 20s+ loop, low-contrast so it never distracts from the headline), CTA settles last. This is the one place the system spends its "motion budget."
- **Hover lift:** product cards and buttons rise `2px` with the cyan-tinted shadow — the single consistent hover language across the whole storefront, so it never needs to be reinvented per component.
- **Scroll reveals:** used once per homepage section (fade + 12px rise, triggered at 20% viewport), not on every child element — restraint here is what keeps the site feeling premium instead of gimmicky.
- **Reduced motion:** all of the above collapses to opacity-only transitions when `prefers-reduced-motion` is set; the aurora mesh becomes a static gradient.

---

## 5. Page-Level Direction

### 5.1 Homepage
```
┌──────────────────────────────────────────────┐
│  [header: logo · nav · search · cart · acct]  │
├──────────────────────────────────────────────┤
│         AURORA HERO (cyan→cobalt mesh)        │
│     Display-XL headline · CTA (pill, cobalt)  │
├──────────────────────────────────────────────┤
│   Flash Sale strip — countdown in Plex Mono   │
├──────────────────────────────────────────────┤
│  Shop by Category — 4-up category cards       │
├──────────────────────────────────────────────┤
│  Trending Products — 4-col grid, Spec Strip   │
│  condensed on each card                       │
├──────────────────────────────────────────────┤
│  Shop by Brand — logo tile row on Glacier     │
├──────────────────────────────────────────────┤
│  Testimonials — quote cards, mint check icon  │
├──────────────────────────────────────────────┤
│  Newsletter — inline pill input + button      │
├──────────────────────────────────────────────┤
│  Footer — Spec-Strip-style stats ribbon        │
└──────────────────────────────────────────────┘
```
The hero is the one moment of visual maximalism (gradient + motion). Everything below it is flat, calm, and grid-disciplined — the contrast is what makes the hero land.

### 5.2 Category / Listing Page
```
┌───────────┬──────────────────────────────────┐
│  Filters  │  Sort ▾              12,480 items │
│  (sticky) │  ┌────┐┌────┐┌────┐┌────┐         │
│  Brand    │  │card││card││card││card│  ...    │
│  Price    │  └────┘└────┘└────┘└────┘         │
│  RAM      │       (4-col grid, 24px gutter)    │
│  ...      │                                    │
└───────────┴──────────────────────────────────┘
```
Filter panel: pill-shaped chips for active filters at the top of the results (removable with an ×), so the applied state is always visible without opening the panel again.

### 5.3 Product Detail Page
```
┌───────────────────┬──────────────────────────┐
│                    │  Brand · Title            │
│   Image gallery    │  ★★★★☆ (128 reviews)      │
│   (Glacier bg,     │  KES 84,999  (data-lg)     │
│   360° + video)    │  Color ○ ○ ●   Storage [ ] │
│                    │  [ Add to cart ][ Buy now ]│
│                    │  ♡ Wishlist  ⇄ Compare     │
├────────────────────┴──────────────────────────┤
│   SPEC STRIP (signature element)               │
├────────────────────────────────────────────────┤
│  Description · Highlights · Full specs (tabs)  │
├────────────────────────────────────────────────┤
│  Reviews (verified badge, pros/cons, media)     │
├────────────────────────────────────────────────┤
│  Related products                               │
└────────────────────────────────────────────────┘
```
Trust badges (secure payment, genuine product, warranty, returns) sit directly under the price — the highest-scrutiny zone on the page — as small mono-labeled icons, not a decorative row.

### 5.4 Cart & Checkout
- Cart: two-column (items left, sticky summary right on desktop; summary collapses to a bottom Sheet on mobile). Quantity stepper uses pill buttons. Coupon field sits inside the summary card, not floating separately.
- Checkout: single-column, numbered steps as `caption`-style eyebrows (this is a real sequence, so numbering is earned) — Address → Delivery → Payment → Review. M-Pesa STK step shows a `toast.promise`-driven pill spinner with live status copy ("Check your phone to complete payment…").

### 5.5 Account
Left rail nav (Dashboard, Orders, Returns, Wishlist, Addresses, etc.) on `--glacier-100`, content on `--frost-50` — a calm, low-decision utility area. Order status uses the same badge language as the storefront so customers recognize state at a glance.

### 5.6 Admin (dark variant)
Admin gets a deliberately distinct **dark shell** — `--ink-900` background, `--frost-50` text, `--signal-cyan-500` accents — signaling "operator mode" versus the light, inviting storefront. Data tables, KPI cards, and the revenue chart (the one other place a gradient is allowed: cyan→mint on the trend line) live here. Buttons keep the same pill shape and cyan/cobalt accent logic — the shape language stays constant even though the palette inverts.

---

## 6. Voice & Microcopy

- Buttons name the action a person takes: **"Add to cart," "Track order," "Save changes"** — never "Submit."
- A control's name persists through the whole flow: the button that says **"Place order"** produces a toast that says **"Order placed."**
- Empty states are invitations, not apologies: a wishlist with nothing in it says *"Nothing saved yet — tap the heart on any product to keep it here,"* not "No items found."
- Errors state cause and fix, in the interface's voice, never a first-person apology: *"Enter a phone number to receive the M-Pesa prompt"* — not "Oops! Something went wrong."
- Mono-styled data (prices, SKUs, order numbers) is always paired with a plain-language label next to it — the mono treatment is for scannability, not obscurity.

---

## 7. Accessibility & Responsive Floor

- Text contrast: body text on Frost/Glacier meets **4.5:1** minimum; large display type meets **3:1**. Cyan-on-white text is avoided for body copy for this reason — cyan is a UI/accent color, not a text color.
- Every interactive element has a visible focus ring (`2px` cyan, `2px` offset) — never suppressed.
- Touch targets minimum `44px` regardless of visual size (pill buttons already exceed this at default padding).
- Fully responsive down to a 360px viewport: nav collapses to the bottom bar (§3 Navigation), filters move to a bottom Sheet, the Spec Strip wraps to two rows before it ever truncates data.
- `prefers-reduced-motion` respected everywhere per §4.

---

## 8. Design Do's / Don'ts (self-check)

**Do:** keep cobalt and mint rare enough that they still mean something when they appear. Keep the Spec Strip's grammar (mono + tick marks) exclusive to genuinely tabular technical data. Let the hero carry the only loud gradient on the storefront.

**Don't:** let cyan become the page background (it's an accent, not a wash). Don't add numbered steps or "01/02/03" markers to content that isn't a real sequence — checkout steps qualify, feature lists don't. Don't let the admin's dark shell bleed into the storefront, and don't let the storefront's warmth bleed into the admin — the split is intentional, signaling "shopping" versus "operating."