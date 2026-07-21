# Atlas Labs E-Store — End-to-End Build Blueprint

A complete technical blueprint for building Atlas Labs E-Store: a full-featured, SEO-first e-commerce platform for electronics retail.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.1.1+ (App Router, Server Actions, Server Components) |
| Language | TypeScript (strict mode) |
| ORM | Drizzle ORM |
| Database | Neon (serverless Postgres) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (all components, including badge, skeleton, tooltip) |
| Forms | React Hook Form + `@hookform/resolvers/zod` |
| Validation | Zod (shared client/server schemas) |
| Notifications | Sonner (toast) |
| Auth password hashing | bcrypt |
| Search | Postgres full-text search + `pg_trgm` (typo tolerance), upgrade path to Meilisearch/Algolia |
| Hosting | Vercel (or any Node 20+ host) with Neon as the managed DB |

Guiding principles for every feature below:
- **Server Actions** are the default mutation path (`"use server"`), called from client components via `useTransition` + forms.
- **Zod schemas** are defined once in `/lib/validations` and reused by both the form resolver and the server action, so validation never drifts.
- **Sonner** (`toast.success/error/promise`) reports the result of every server action.
- Every list page (products, orders, admin tables) ships a **skeleton** loading state and **Suspense** boundary.

---

## 2. Project Structure

```
atlas-labs-estore/
├── drizzle/
│   ├── schema/
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── brands.ts
│   │   ├── variants.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── reviews.ts
│   │   ├── wishlist.ts
│   │   ├── coupons.ts
│   │   ├── inventory.ts
│   │   ├── blog.ts
│   │   ├── cms.ts
│   │   ├── analytics.ts
│   │   └── index.ts
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   │   ├── page.tsx                       # Homepage
│   │   │   ├── [category]/page.tsx            # Category landing
│   │   │   ├── [category]/[brand]/page.tsx    # Brand within category
│   │   │   ├── product/[slug]/page.tsx        # PDP
│   │   │   ├── search/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── checkout/confirmation/[orderId]/page.tsx
│   │   │   ├── brands/[brand]/page.tsx
│   │   │   ├── compare/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── account/
│   │   │   │   ├── page.tsx                   # dashboard
│   │   │   │   ├── orders/page.tsx
│   │   │   │   ├── orders/[id]/page.tsx
│   │   │   │   ├── returns/page.tsx
│   │   │   │   ├── addresses/page.tsx
│   │   │   │   ├── payment-methods/page.tsx
│   │   │   │   ├── wishlist/page.tsx
│   │   │   │   ├── reviews/page.tsx
│   │   │   │   ├── support/page.tsx
│   │   │   │   └── loyalty/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── (policy)/[slug]/page.tsx        # terms/privacy/returns
│   │   ├── admin/
│   │   │   ├── layout.tsx                      # RBAC gate
│   │   │   ├── page.tsx                        # dashboard/analytics
│   │   │   ├── products/...
│   │   │   ├── categories/...
│   │   │   ├── brands/...
│   │   │   ├── orders/...
│   │   │   ├── customers/...
│   │   │   ├── coupons/...
│   │   │   ├── inventory/...
│   │   │   ├── marketing/...
│   │   │   ├── blog/...
│   │   │   ├── cms/...
│   │   │   ├── users/roles/permissions/...
│   │   │   └── reports/...
│   │   ├── api/
│   │   │   ├── mpesa/stk-push/route.ts
│   │   │   ├── mpesa/callback/route.ts
│   │   │   ├── webhooks/payments/route.ts
│   │   │   ├── og/[...slug]/route.tsx          # dynamic OG images
│   │   │   ├── revalidate/route.ts
│   │   │   └── cron/abandoned-cart/route.ts
│   │   ├── sitemap.ts
│   │   ├── sitemap-images.xml/route.ts
│   │   ├── robots.ts
│   │   └── manifest.ts
│   ├── actions/                                # Server Actions ("use server")
│   │   ├── auth.actions.ts
│   │   ├── product.actions.ts
│   │   ├── cart.actions.ts
│   │   ├── order.actions.ts
│   │   ├── review.actions.ts
│   │   ├── wishlist.actions.ts
│   │   ├── coupon.actions.ts
│   │   ├── admin.actions.ts
│   │   └── search.actions.ts
│   ├── components/
│   │   ├── ui/                                 # shadcn generated
│   │   ├── storefront/
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts                               # drizzle + neon client
│   │   ├── auth.ts                             # session, bcrypt helpers
│   │   ├── rbac.ts
│   │   ├── validations/
│   │   │   ├── auth.schema.ts
│   │   │   ├── product.schema.ts
│   │   │   ├── checkout.schema.ts
│   │   │   ├── review.schema.ts
│   │   │   └── coupon.schema.ts
│   │   ├── seo.ts                              # metadata + schema.org builders
│   │   ├── search.ts
│   │   ├── mpesa.ts
│   │   ├── email.ts
│   │   ├── sms.ts
│   │   └── whatsapp.ts
│   ├── hooks/
│   └── middleware.ts                           # auth guard, rate limiting
├── drizzle.config.ts
├── tailwind.config.ts
└── .env
```

---

## 3. Environment Variables

```bash
DATABASE_URL=postgresql://...neon.tech/atlaslabs?sslmode=require
SESSION_SECRET=
NEXTAUTH_URL= # if using auth.js, optional — custom session used below
BCRYPT_SALT_ROUNDS=12

MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

STRIPE_SECRET_KEY=       # or bank gateway equivalent
RESEND_API_KEY=          # transactional email
AFRICAS_TALKING_API_KEY= # SMS
WHATSAPP_BUSINESS_TOKEN=

NEXT_PUBLIC_SITE_URL=https://atlaslabs.store
RECAPTCHA_SECRET_KEY=
RECAPTCHA_SITE_KEY=
CDN_BASE_URL=
```

---

## 4. Database Schema (Drizzle + Neon)

### 4.1 Core identity & RBAC

```ts
// drizzle/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "support", "editor", "manager", "admin", "superadmin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(), // bcrypt
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  role: roleEnum("role").notNull().default("customer"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  emailVerifiedAt: timestamp("email_verified_at"),
  loyaltyPoints: varchar("loyalty_points_int", { length: 20 }).default("0"),
  referralCode: varchar("referral_code", { length: 20 }).unique(),
  referredBy: uuid("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(), // e.g. "products.write"
  description: varchar("description", { length: 255 }),
});

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: roleEnum("role").notNull(),
  permissionId: uuid("permission_id").notNull().references(() => permissions.id),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 150 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: varchar("entity_id", { length: 100 }),
  metadata: varchar("metadata", { length: 4000 }), // JSON string
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  label: varchar("label", { length: 50 }),
  county: varchar("county", { length: 100 }),
  subCounty: varchar("sub_county", { length: 100 }),
  estate: varchar("estate", { length: 150 }),
  deliveryInstructions: varchar("delivery_instructions", { length: 500 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 4.2 Catalog: categories, brands, products, variants

```ts
// drizzle/schema/categories.ts
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id"), // self-reference for unlimited nesting
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  bannerUrl: varchar("banner_url", { length: 500 }),
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoryFaqs = pgTable("category_faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  question: varchar("question", { length: 300 }),
  answer: text("answer"),
});

// drizzle/schema/brands.ts
export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description"),
  logoUrl: varchar("logo_url", { length: 500 }),
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
});
```

```ts
// drizzle/schema/products.ts
export const conditionEnum = pgEnum("condition", ["new", "refurbished", "used"]);
export const stockStatusEnum = pgEnum("stock_status", ["in_stock", "low_stock", "out_of_stock", "backorder"]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  barcode: varchar("barcode", { length: 100 }),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  brandId: uuid("brand_id").notNull().references(() => brands.id),
  description: text("description"),
  highlights: varchar("highlights", { length: 2000 }), // JSON array string
  warranty: varchar("warranty", { length: 255 }),
  condition: conditionEnum("condition").default("new"),
  weightGrams: integer("weight_grams"),
  dimensions: varchar("dimensions", { length: 100 }), // "L x W x H cm"
  manufacturer: varchar("manufacturer", { length: 150 }),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),

  // Pricing
  regularPrice: numeric("regular_price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  installmentPrice: numeric("installment_price", { precision: 12, scale: 2 }),
  wholesalePrice: numeric("wholesale_price", { precision: 12, scale: 2 }),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).default("16.00"),

  // Inventory (aggregate — see inventory.ts for per-warehouse detail)
  stockStatus: stockStatusEnum("stock_status").default("in_stock"),
  totalQuantity: integer("total_quantity").default(0),

  // SEO
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),

  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  is360: boolean("is_360").default(false),
  sortOrder: integer("sort_order").default(0),
});

export const productVideos = pgTable("product_videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
});

// Category-specific spec templates (EAV pattern — flexible per category)
export const specAttributes = pgTable("spec_attributes", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  key: varchar("key", { length: 100 }).notNull(),      // "ram", "refresh_rate"
  label: varchar("label", { length: 150 }).notNull(),  // "RAM"
  unit: varchar("unit", { length: 30 }),               // "GB"
  sortOrder: integer("sort_order").default(0),
  isFilterable: boolean("is_filterable").default(true),
});

export const productSpecValues = pgTable("product_spec_values", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  attributeId: uuid("attribute_id").notNull().references(() => specAttributes.id),
  value: varchar("value", { length: 255 }).notNull(),
});
```

```ts
// drizzle/schema/variants.ts
export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 50 }),
  storage: varchar("storage", { length: 50 }),
  size: varchar("size", { length: 50 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(0),
  isDefault: boolean("is_default").default(false),
});

export const variantImages = pgTable("variant_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  url: varchar("url", { length: 500 }).notNull(),
});
```

### 4.3 Inventory & warehouses

```ts
// drizzle/schema/inventory.ts
export const warehouses = pgTable("warehouses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  county: varchar("county", { length: 100 }),
  isPickupStation: boolean("is_pickup_station").default(false),
});

export const inventoryLevels = pgTable("inventory_levels", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id),
  quantity: integer("quantity").default(0),
  reserved: integer("reserved").default(0),
  incoming: integer("incoming").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
});

export const inventoryHistory = pgTable("inventory_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  change: integer("change").notNull(), // +/-
  reason: varchar("reason", { length: 150 }), // "sale", "restock", "adjustment"
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 4.4 Cart, wishlist, compare

```ts
// drizzle/schema/cart.ts
export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id), // null = guest cart
  sessionToken: varchar("session_token", { length: 255 }), // guest identifier
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").notNull().references(() => carts.id),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  savedForLater: boolean("saved_for_later").default(false),
});

// drizzle/schema/wishlist.ts
export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  shareToken: varchar("share_token", { length: 100 }).unique(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  wishlistId: uuid("wishlist_id").notNull().references(() => wishlists.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  priceAtAdd: numeric("price_at_add", { precision: 12, scale: 2 }),
  notifyOnPriceDrop: boolean("notify_on_price_drop").default(true),
  notifyOnRestock: boolean("notify_on_restock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const compareItems = pgTable("compare_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  productId: uuid("product_id").notNull().references(() => products.id),
});
```

### 4.5 Orders, payments, returns

```ts
// drizzle/schema/orders.ts
export const orderStatusEnum = pgEnum("order_status", [
  "pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["mpesa", "card", "bank", "cod"]);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id), // null for guest
  guestEmail: varchar("guest_email", { length: 255 }),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentReference: varchar("payment_reference", { length: 150 }), // M-Pesa receipt, etc.

  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxTotal: numeric("tax_total", { precision: 12, scale: 2 }).notNull(),
  shippingTotal: numeric("shipping_total", { precision: 12, scale: 2 }).notNull(),
  discountTotal: numeric("discount_total", { precision: 12, scale: 2 }).default("0"),
  grandTotal: numeric("grand_total", { precision: 12, scale: 2 }).notNull(),

  addressId: uuid("address_id").references(() => addresses.id),
  pickupWarehouseId: uuid("pickup_warehouse_id").references(() => warehouses.id),
  couponId: uuid("coupon_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  productTitleSnapshot: varchar("product_title_snapshot", { length: 255 }),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
});

export const orderTimeline = pgTable("order_timeline", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  status: orderStatusEnum("status").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  courier: varchar("courier", { length: 150 }),
  trackingNumber: varchar("tracking_number", { length: 150 }),
  trackingUrl: varchar("tracking_url", { length: 500 }),
  estimatedDelivery: timestamp("estimated_delivery"),
});

export const returns = pgTable("returns", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  orderItemId: uuid("order_item_id").notNull().references(() => orderItems.id),
  reason: varchar("reason", { length: 500 }),
  type: varchar("type", { length: 20 }), // "return" | "exchange" | "refund"
  status: varchar("status", { length: 30 }).default("requested"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 4.6 Reviews, coupons, blog, CMS, marketing, analytics

```ts
// drizzle/schema/reviews.ts
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  orderId: uuid("order_id").references(() => orders.id), // verified purchase link
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }),
  body: text("body"),
  pros: varchar("pros", { length: 1000 }),
  cons: varchar("cons", { length: 1000 }),
  helpfulVotes: integer("helpful_votes").default(0),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewMedia = pgTable("review_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id),
  url: varchar("url", { length: 500 }).notNull(),
  type: varchar("type", { length: 10 }), // image | video
});

export const productQuestions = pgTable("product_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  question: varchar("question", { length: 500 }),
  answer: varchar("answer", { length: 1000 }),
  answeredBy: uuid("answered_by").references(() => users.id),
});

// drizzle/schema/coupons.ts
export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 20 }), // percentage | fixed | bundle | bxgy | gift_card | student
  value: numeric("value", { precision: 12, scale: 2 }),
  minOrderValue: numeric("min_order_value", { precision: 12, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
});

export const giftCards = pgTable("gift_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  initialBalance: numeric("initial_balance", { precision: 12, scale: 2 }),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }),
  issuedToUserId: uuid("issued_to_user_id").references(() => users.id),
  expiresAt: timestamp("expires_at"),
});

// drizzle/schema/blog.ts
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 50 }), // buying-guide | review | how-to | comparison | news
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  authorId: uuid("author_id").references(() => users.id),
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  relatedProductIds: varchar("related_product_ids", { length: 1000 }), // JSON array
  publishedAt: timestamp("published_at"),
});

// drizzle/schema/cms.ts
export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 150 }).notNull().unique(), // "terms", "privacy", "about"
  title: varchar("title", { length: 255 }),
  content: text("content"), // rich text / MDX
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Marketing
export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  channel: varchar("channel", { length: 20 }), // email | sms | whatsapp | push
  name: varchar("name", { length: 200 }),
  subject: varchar("subject", { length: 200 }),
  body: text("body"),
  segment: varchar("segment", { length: 100 }),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
});

export const abandonedCarts = pgTable("abandoned_carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id").notNull().references(() => carts.id),
  reminderStage: integer("reminder_stage").default(0),
  lastReminderAt: timestamp("last_reminder_at"),
});

export const affiliates = pgTable("affiliates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  code: varchar("code", { length: 30 }).unique(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),
});

// Analytics (event log; roll-ups computed in queries or a nightly job)
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 50 }), // page_view | add_to_cart | search | purchase
  userId: uuid("user_id"),
  sessionToken: varchar("session_token", { length: 255 }),
  productId: uuid("product_id"),
  query: varchar("query", { length: 255 }),
  metadata: varchar("metadata", { length: 2000 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

> Full-text search: add a generated `tsvector` column + GIN index on `products` and enable `pg_trgm` for typo-tolerant `similarity()` matching. See §8.

Run everything through Drizzle Kit:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 5. Database Client & Neon Connection

```ts
// src/lib/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../../drizzle/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

For transactional flows (checkout, inventory decrement) use the Neon pooled/WebSocket driver (`@neondatabase/serverless` with `Pool`) so multi-statement transactions are supported:

```ts
// src/lib/db-transactional.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "../../drizzle/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const dbTx = drizzle(pool, { schema });
```

---

## 6. Auth & Security

### 6.1 Password hashing (bcrypt)

```ts
// src/lib/auth.ts
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string, role: string) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}
```

### 6.2 Zod auth schemas + Server Action + RHF form

```ts
// src/lib/validations/auth.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "Too short"),
  lastName: z.string().min(2, "Too short"),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8, "Minimum 8 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
```

```ts
// src/actions/auth.actions.ts
"use server";
import { db } from "@/lib/db";
import { users } from "../../drizzle/schema";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { hashPassword, createSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function registerAction(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });
  if (existing) return { success: false, error: "Email already registered" };

  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db.insert(users).values({
    email: parsed.data.email,
    passwordHash,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    phone: parsed.data.phone,
  }).returning();

  await createSession(user.id, user.role);
  return { success: true };
}
```

```tsx
// src/components/storefront/register-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { registerAction } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  function onSubmit(values: RegisterInput) {
    startTransition(async () => {
      const res = await registerAction(values);
      if (res.success) {
        toast.success("Account created — welcome to Atlas Labs!");
        router.push("/account");
      } else {
        toast.error(typeof res.error === "string" ? res.error : "Please check the form");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="firstName" render={({ field }) => (
          <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {/* lastName, email, phone, password fields follow the same pattern */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
```

### 6.3 RBAC middleware

```ts
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

const ADMIN_ROLES = ["editor", "manager", "admin", "superadmin"];

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const session = await getSession();
    if (!session || !ADMIN_ROLES.includes(session.role)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };
```

### 6.4 Additional hardening

- **2FA**: TOTP via `otplib`, secret stored encrypted on `users.twoFactorSecret`, enforced at login for `admin`/`superadmin`.
- **Rate limiting**: token-bucket in a `rate_limits` Neon table or Upstash Redis; applied in middleware to `/api`, `/login`, `/checkout`.
- **reCAPTCHA v3**: on register, login, review submission, contact form.
- **Fraud detection**: flag orders where shipping/billing mismatch, velocity of orders per card/M-Pesa number, or high-value guest checkouts — routed to an admin review queue.
- **CSP / XSS / CSRF**: strict CSP via `next.config.ts` headers; Server Actions carry built-in CSRF protection (encrypted action IDs); sanitize all rich text (blog/CMS) with `rehype-sanitize` before render.
- **SQL injection**: fully mitigated by Drizzle's parameterized queries — never use raw string interpolation into `sql\`...\``.
- **Secure uploads**: validate MIME + extension + max size server-side, store in object storage (S3/R2/Cloudinary) — never trust client-declared content-type.

---

## 7. Server Actions Pattern (used across the app)

Every mutation follows this shape:

```ts
"use server";
export async function actionName(input: InputType) {
  const parsed = someZodSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

  const session = await getSession();
  // authorization check if needed

  try {
    // db.insert / db.update / db.delete via Drizzle
    revalidatePath("/relevant-path");
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Something went wrong" };
  }
}
```

Client-side, every call site follows:
```ts
const [isPending, startTransition] = useTransition();
startTransition(async () => {
  const res = await someAction(values);
  res.success ? toast.success("Done") : toast.error(res.error);
});
```

This pattern is applied to: cart mutations, wishlist toggling, coupon application, review submission, address CRUD, admin product CRUD, order status transitions, support tickets, and every other write path in the app.

---

## 8. Search (Section 6)

**Approach:** Postgres-native for v1, with a documented upgrade path.

```sql
-- migration: full text + trigram search
ALTER TABLE products ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(manufacturer, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

CREATE INDEX products_search_idx ON products USING GIN (search_vector);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX products_title_trgm_idx ON products USING GIN (title gin_trgm_ops);
```

```ts
// src/lib/search.ts
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function searchProducts(query: string) {
  return db.execute(sql`
    SELECT id, title, slug, sale_price, regular_price,
           ts_rank(search_vector, plainto_tsquery('english', ${query})) AS rank,
           similarity(title, ${query}) AS sim
    FROM products
    WHERE search_vector @@ plainto_tsquery('english', ${query})
       OR similarity(title, ${query}) > 0.25
    ORDER BY rank DESC, sim DESC
    LIMIT 20;
  `);
}
```

- **Instant search / autocomplete**: debounced Server Action or a lightweight `route.ts` GET endpoint hit from a client component (300ms debounce), rendered in a shadcn `Command` palette.
- **Typo correction**: `pg_trgm` `similarity()` fallback shown above; surfaced as "Did you mean…".
- **Voice search**: Web Speech API (`SpeechRecognition`) in the client search bar, transcribed text fed into the same search action.
- **Search history / popular searches**: log every query to `analytics_events` (`type = 'search'`); popular searches = `GROUP BY query ORDER BY count DESC` over a rolling 7/30-day window; per-user history read from the same table filtered by `userId`.
- **Upgrade path**: if catalog exceeds ~50k SKUs or facet queries get slow, swap `searchProducts` for Meilisearch/Algolia/Typesense behind the same function signature — no call-site changes needed.

---

## 9. Filters & Sorting

Filters (brand, price, color, RAM, storage, screen size, processor, availability, discount, rating, condition) are modeled as **URL search params** (`?brand=apple&min=10000&max=80000&ram=8GB&sort=price-asc`), read with `searchParams` in the Server Component, and turned into a single Drizzle query:

```ts
// src/actions/search.actions.ts (server, called from category/search pages)
export async function getFilteredProducts(params: {
  categorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  specs?: Record<string, string[]>; // { ram: ["8GB","12GB"] }
  minRating?: number;
  condition?: string[];
  inStockOnly?: boolean;
  discountOnly?: boolean;
  sort?: "popular" | "latest" | "price-asc" | "price-desc" | "rating" | "bestselling" | "discount";
  page?: number;
  perPage?: number;
}) {
  // builds a dynamic `and(...)` / `or(...)` Drizzle where clause,
  // joins productSpecValues for spec-based facets,
  // and applies orderBy based on `sort`
}
```

- Filter option **counts** (e.g. "Samsung (24)") are computed with a single `GROUP BY` query run alongside the main result query, cached per category for 60s (`unstable_cache`).
- Filters are rendered as shadcn `Checkbox`/`Slider`/`Accordion` groups; selecting one updates the URL via `router.push` with `{ scroll: false }`, so the Server Component re-fetches without a full navigation flash. A `Skeleton` grid shows during the transition (`useTransition` + `isPending`).
- **Sorting** is just one more `sort` param mapped to an `ORDER BY` clause — no separate system.

---

## 10. Cart, Wishlist & Compare

- **Cart identity**: logged-in users get a `carts` row keyed by `userId`; guests get a `sessionToken` cookie (UUID, httpOnly=false so client JS can read it for optimistic UI, but the authoritative cart still lives server-side). On login, merge guest cart into user cart (union quantities, dedupe by variant).
- **Cart persistence**: DB-backed (not localStorage) so it survives device switches once logged in; guest cart persists via the cookie for 30 days.
- **Save for later**: `cartItems.savedForLater = true`, filtered into a separate UI section, excluded from checkout totals.
- **Cross-sell**: on the cart page, query `order_items` co-purchase patterns ("customers who bought X also bought Y") or fall back to same-category top sellers if no co-purchase data yet.
- **Coupon / gift card**: applied via `applyCouponAction`, validated against `minOrderValue`, `expiresAt`, `usageLimit`, stacked rules (e.g., one coupon + one gift card, not two coupons).
- **Estimate shipping**: county/sub-county selector on the cart page calls a rate table (flat rate per county tier, or courier API) without requiring full checkout.
- **Wishlist**: unlimited items per user; `shareToken` on `wishlists` generates a public read-only `/wishlist/shared/[token]` page; price-drop and back-in-stock alerts run as a nightly cron comparing `wishlistItems.priceAtAdd`/stock to current values and dispatching via `email.ts`/`sms.ts`.
- **Compare**: up to 4 products at a time (session-scoped via `compareItems`), rendered as a spec-diff table (see §11).

---

## 11. Product Detail Page (PDP)

Server Component fetches: product + variants + images/videos + spec values (joined against the category's `specAttributes` template) + reviews summary + related products (same category/brand) — in one batched query where possible.

Client islands on the PDP:
- **Variant selector** (color/storage swatches) — updates image gallery, price, and stock status without a page reload (client state derived from server-fetched variant list).
- **Add to cart / Buy now / Wishlist toggle / Share / WhatsApp enquiry** — each a Server Action + Sonner toast; "Buy now" adds to cart then redirects straight to `/checkout`.
- **Compare toggle** — adds/removes from `compareItems`.
- **Trust badges** (secure payment, genuine product, warranty, return policy) — static shadcn `Badge` components driven by product flags.
- **Delivery estimate** — recalculated when the user picks a county on the PDP itself (same rate table as cart).

`generateStaticParams` pre-renders top-selling product slugs at build; the rest render on-demand with ISR (`revalidate: 3600`) and `dynamicParams: true`.

---

## 12. Checkout & Payments

### 12.1 Flow
1. **Cart review** → 2. **Address / delivery method** (guest or account, county → sub-county → estate cascading `Select`s, or pickup station picker) → 3. **Payment method** → 4. **Review & place order** → 5. **Confirmation**.

### 12.2 Zod checkout schema

```ts
// src/lib/validations/checkout.schema.ts
export const checkoutSchema = z.object({
  fulfillment: z.enum(["delivery", "pickup"]),
  county: z.string().optional(),
  subCounty: z.string().optional(),
  estate: z.string().optional(),
  deliveryInstructions: z.string().max(500).optional(),
  pickupWarehouseId: z.string().uuid().optional(),
  paymentMethod: z.enum(["mpesa", "card", "bank", "cod"]),
  phoneForStk: z.string().min(10).optional(),
  couponCode: z.string().optional(),
}).refine(
  (v) => v.fulfillment === "pickup" ? !!v.pickupWarehouseId : !!v.county,
  { message: "Select a delivery location or pickup station" }
);
```

### 12.3 Order placement Server Action (transactional)

```ts
// src/actions/order.actions.ts
"use server";
import { dbTx } from "@/lib/db-transactional";
import { orders, orderItems, inventoryLevels } from "../../drizzle/schema";
import { checkoutSchema } from "@/lib/validations/checkout.schema";
import { initiateStkPush } from "@/lib/mpesa";

export async function placeOrderAction(input: unknown, cart: CartSnapshot) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };

  return dbTx.transaction(async (tx) => {
    // 1. re-verify stock & price server-side (never trust client cart totals)
    // 2. decrement inventoryLevels.quantity / increment .reserved
    // 3. insert order + orderItems + orderTimeline("pending")
    const [order] = await tx.insert(orders).values({ ...computedTotals }).returning();

    if (parsed.data.paymentMethod === "mpesa") {
      await initiateStkPush({ orderId: order.id, phone: parsed.data.phoneForStk!, amount: order.grandTotal });
    }
    return { success: true, orderId: order.id };
  });
}
```

### 12.4 Payment integrations
- **M-Pesa STK Push**: `route.ts` at `/api/mpesa/stk-push` triggers Safaricom Daraja API; `/api/mpesa/callback` receives the async confirmation, updates `orders.status = 'paid'` and `orderTimeline`, then emits a Sonner-visible state via polling or a websocket/SSE channel on the confirmation page.
- **Card / Bank**: Stripe (or a local gateway) — webhook-driven status updates, same `orderTimeline` pattern.
- **Cash on delivery**: order created as `pending`, marked `paid` on delivery by an admin/courier action.
- **Order summary**: subtotal, VAT (per §4.2 `vatRate`), shipping, coupon discount, grand total — computed server-side only, never trusted from the client.

### 12.5 Confirmation
`/checkout/confirmation/[orderId]` shows the order summary, invoice download (generated PDF via `@react-pdf/renderer` or similar), and estimated delivery — with a `toast.success("Order placed!")` fired on arrival.

---

## 13. Account Area (Section 11–12)

Each sub-page is a Server Component reading from the relevant table scoped to `session.userId`, with shadcn `Table`/`Card` + `Skeleton` fallback:

| Page | Data source |
|---|---|
| Dashboard | Aggregate: recent orders, loyalty points, wishlist count |
| Orders | `orders` + `orderItems`, status badge, link to timeline/invoice/tracking |
| Order detail | `orderTimeline`, `shipments`, "Request return" / "Cancel" actions (only while status allows it) |
| Returns | `returns` table, status badges |
| Addresses | CRUD over `addresses`, one marked default |
| Payment methods | Tokenized reference only (never raw card data — handled by the payment provider's vault) |
| Notifications | In-app notification table or provider-driven (email/SMS log) |
| Reviews | Reviews the user has written, edit/delete within a policy window |
| Recently viewed | `analytics_events` (`type='page_view'`) filtered to `product_view`, deduped, most-recent-first |
| Downloads | Invoices, warranty cards |
| Support tickets | `support_tickets` CRUD |
| Loyalty points | `users.loyaltyPoints`, ledger of earn/redeem events |
| Referral rewards | `users.referralCode`/`referredBy`, reward status |

---

## 14. Reviews & Q&A (Section 14)

- Only users with a `delivered` order containing the product can leave a **Verified Purchase** review (checked server-side against `orderItems`/`orders.status`).
- Reviews support rating, title, body, pros/cons, image/video upload (`reviewMedia`), and go through `isApproved` moderation before appearing publicly (auto-approve for 4★+ from verified buyers, queue the rest).
- **Helpful votes**: one vote per user per review, incremented via a lightweight Server Action + optimistic UI update.
- **Q&A**: any signed-in user can ask; admin/support/manager or the product's brand rep can answer.

---

## 15. Admin Panel (Section 20)

Route group `/admin` gated by the RBAC middleware (§6.3). Structure:

- **Dashboard**: KPI cards (revenue, orders today, conversion rate, low-stock alerts) using shadcn `Card` + a `recharts`-based trend chart.
- **Products**: data table (shadcn `Table` + `DataTable` pattern) with filters, bulk actions (activate/deactivate/feature), variant editor, image/video manager (drag-reorder), SEO fields tab, spec-template-driven attribute inputs per category.
- **Categories / Brands**: tree editor for nested categories (parentId drag-drop), banner/FAQ/SEO tabs.
- **Orders**: status board (Kanban-style or filterable table), bulk status update, refund/cancel actions, invoice regeneration.
- **Customers**: list + detail (orders, loyalty, support history), role assignment for staff accounts.
- **Coupons / Gift cards**: CRUD with live preview of eligibility rules.
- **Inventory**: per-warehouse stock grid, low-stock/out-of-stock filters, incoming stock log, manual adjustment with mandatory `reason` (feeds `inventoryHistory`).
- **Payments**: transaction log across M-Pesa/card/bank/COD, reconciliation view.
- **Shipping**: courier config, delivery zone/rate table editor.
- **Reports**: exportable CSV for revenue, top products/categories/brands, cart abandonment, returning customers, search analytics.
- **Blog / CMS**: MDX-capable rich text editor (e.g., `tiptap`), SEO fields, scheduling (`publishedAt` in the future = scheduled).
- **Users / Roles / Permissions**: role-permission matrix editor writing to `rolePermissions`.
- **Audit logs**: read-only table of `auditLogs`, filterable by user/action/date. Every admin mutation writes an audit row as part of the same transaction.

All admin writes reuse the exact Server Action + Zod + Sonner pattern from §7 — the admin panel is not a separate stack, just a different route group with stricter authorization checks.

---

## 16. Analytics (Section 21)

- Every meaningful client event (page view, add-to-cart, search, purchase) is fire-and-forget logged to `analytics_events` via a tiny Server Action, non-blocking (`void logEvent(...)`, no await in the UI thread).
- Admin **Reports** and **Dashboard** run aggregate SQL over `analytics_events` + `orders`:
  - Revenue, orders, AOV → `orders` grouped by day/week/month.
  - Conversion rate → `purchase` events ÷ `page_view` events over the same session.
  - Cart abandonment → carts with items but no linked order after N hours (feeds §17 recovery).
  - Top products/categories/brands → `orderItems` joined to catalog, grouped, ranked.
  - Returning customers → `orders` grouped by `userId` having `count > 1`.
  - Search analytics → `analytics_events` where `type='search'`, grouped by `query`, with zero-result queries flagged separately (catalog gap signal).
- For scale beyond simple SQL rollups, this event table is designed to be dual-written to a proper analytics sink (PostHog/Segment/warehouse) later without changing the schema.

---

## 17. Marketing (Section 22)

- **Abandoned cart recovery**: `/api/cron/abandoned-cart` (Vercel Cron, hourly) finds carts idle > 1hr with no order, inserts/updates `abandonedCarts`, and sends a staged reminder sequence (1hr, 24hr, 72hr) via email/SMS/WhatsApp, each escalating (reminder → reminder + small coupon).
- **Email/SMS/WhatsApp campaigns**: `campaigns` table + a send worker (cron or queue) resolving `segment` (e.g., "customers who bought phones in last 90 days") into a recipient list via SQL, then dispatching through `email.ts` (Resend), `sms.ts` (Africa's Talking or similar), `whatsapp.ts` (WhatsApp Business API).
- **Push notifications**: Web Push (service worker + VAPID keys) for back-in-stock/price-drop/order-status events.
- **Referral & affiliate programs**: `referralCode`/`referredBy` on `users`, and `affiliates` for commission-based partners; reward issuance (loyalty points or gift card) triggered when a referred user's first order reaches `delivered`.
- **Loyalty program**: points earned per KES spent (configurable rate), redeemable at checkout as a discount — ledger-based so balance is always derivable/auditable, not just a mutable counter.

---

## 18. Blog & CMS (Section 23, 25)

- Blog posts (`blogPosts`) support buying guides, reviews, how-tos, comparisons, and news — each with `relatedProductIds` rendered as inline product cards for internal linking + conversion.
- CMS pages (`cmsPages`) drive Homepage sections (hero banner config), FAQs, policies, terms, privacy, contact, and about — all admin-editable without a deploy.
- Both use the same rich-text editor and are rendered through a shared MDX/sanitized-HTML renderer component to avoid duplicated logic.

---

## 19. SEO Implementation (Section 24 — Critical)

### 19.1 Metadata

Every route exports `generateMetadata`:

```ts
// src/app/(storefront)/product/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.metaTitle ?? `${product.title} | Atlas Labs E-Store`,
    description: product.metaDescription ?? product.description?.slice(0, 160),
    alternates: { canonical: product.canonicalUrl ?? `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.metaDescription,
      images: [{ url: `/api/og/product/${product.slug}` }],
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}
```

### 19.2 Structured data (JSON-LD)

A single `seo.ts` helper builds each schema type; injected via a `<script type="application/ld+json">` component per page:

```ts
// src/lib/seo.ts
export function buildProductSchema(product: ProductWithRelations) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.salePrice ?? product.regularPrice,
      availability: product.stockStatus === "in_stock"
        ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
    aggregateRating: product.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount,
    } : undefined,
  };
}
// buildBreadcrumbSchema, buildFaqSchema, buildOrganizationSchema,
// buildLocalBusinessSchema, buildSearchActionSchema, buildMerchantListingSchema
// follow the same pattern, each returning a plain JSON-LD object.
```

Schema types implemented: **Product, Review, Breadcrumb, FAQ, Organization, LocalBusiness, SearchAction (sitewide search box), and Merchant Listing** (Google Merchant Center feed compatibility).

### 19.3 Sitemaps & robots

```ts
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.query.products.findMany({ columns: { slug: true, updatedAt: true } });
  const categories = await db.query.categories.findMany();
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({ url: `${SITE_URL}/${c.slug}`, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({ url: `${SITE_URL}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const })),
  ];
}
```

- A **separate image sitemap** (`/sitemap-images.xml`) lists all `productImages` for image search indexing.
- `robots.ts` allows all storefront routes, disallows `/admin`, `/account`, `/checkout`, and **noindexes filtered/search result URLs** (`?brand=`, `?min=`, etc.) via `<meta name="robots" content="noindex">` when query params beyond `page` are present — preventing infinite facet-combination indexing.
- **Redirect management**: a `redirects` table (`fromPath`, `toPath`, `statusCode`) checked in `middleware.ts` before falling through to normal routing, so old/renamed slugs 301 cleanly without a redeploy.

### 19.4 Performance-linked SEO (Core Web Vitals)

- `next/image` everywhere with explicit `width`/`height` (no CLS), `sizes` for responsive art direction, and `loading="lazy"` below the fold / `priority` on the hero.
- Server Components by default; client components only where interactivity is required (forms, variant selectors, filters) — minimizes JS shipped, improving INP/TBT.
- Dynamic OG images generated at request time via `next/og` (`/api/og/...route.tsx`) for product/blog/category shares.
- **Multilingual readiness**: content tables carry a `locale` column pattern (or a companion `*_translations` table) ready to extend; `hreflang` tags added to `generateMetadata` once a second locale ships.

---

## 20. Notifications (Sonner)

Single `<Toaster />` mounted once in the root layout:

```tsx
// src/app/layout.tsx
import { Toaster } from "@/components/ui/sonner";
// ...
<body>
  {children}
  <Toaster richColors position="top-right" />
</body>
```

Usage conventions across the app:
- `toast.success(...)` — successful mutation (added to cart, order placed, review submitted).
- `toast.error(...)` — validation failure, payment failure, out-of-stock race condition.
- `toast.promise(...)` — long-running actions (STK push waiting for confirmation, bulk admin import).
- `toast.info(...)` — informational (price dropped on a wishlist item, back-in-stock).

---

## 21. UI System (shadcn/ui)

Install the full set once at project start:

```bash
npx shadcn@latest init
npx shadcn@latest add button input form label select checkbox radio-group slider \
  accordion tabs dialog sheet drawer dropdown-menu command popover tooltip \
  badge skeleton card table pagination breadcrumb avatar separator \
  toast sonner alert alert-dialog progress carousel calendar \
  navigation-menu menubar hover-card scroll-area switch textarea \
  data-table combobox
```

Key mapping to features:
- **Skeleton** — every data-fetching list (product grid, order history, admin tables, reviews) ships a matching skeleton shown via `<Suspense fallback={<ProductGridSkeleton />}>`.
- **Badge** — stock status, discount %, condition, "Verified Purchase", order status, role tags in admin.
- **Tooltip** — spec abbreviations, compare-table icons, admin action buttons.
- **Command** — instant search palette, admin quick-nav.
- **Sheet/Drawer** — mobile filters, mobile cart preview.
- **DataTable pattern** (built on `table` + `@tanstack/react-table`) — every admin list view.
- **Dialog/Alert-Dialog** — destructive confirmations (delete product, cancel order).

Refer to `frontend-design` conventions for spacing, type scale, and avoiding generic "default shadcn" look — Atlas Labs gets its own accent color, radius, and font pairing defined once in `tailwind.config.ts` and `globals.css`.

---

## 22. Performance & Caching Strategy (Section 27)

| Technique | Where applied |
|---|---|
| Static generation + ISR | Category pages, brand pages, blog posts, top product PDPs (`revalidate: 3600`) |
| `unstable_cache` | Filter facet counts, homepage featured/trending blocks, nav category tree |
| Streaming SSR + Suspense | PDP reviews section, related products, admin dashboard charts |
| Route-level caching headers | `/api/og/*`, sitemap, static CMS pages via `Cache-Control` |
| CDN | All static assets + images fronted by Vercel Edge Network / a CDN in front of object storage |
| Image optimization | `next/image` with a remote loader pointed at the CDN, AVIF/WebP negotiation |
| Database indexing | GIN indexes for search (§8), btree indexes on `sku`, `slug`, foreign keys, `orders.status`, `orders.createdAt` |
| Search indexing | `search_vector` generated column (§8) so no separate reindex job needed for Postgres-tier search |
| Compression | Brotli/gzip via hosting platform defaults |
| Prefetching | `next/link` default prefetch on hover/viewport for category & product links |
| Edge rendering | Lightweight, geography-independent routes (redirect resolution, A/B flags) run on the Edge runtime |

---

## 23. Testing & Quality Gates

- **Zod schemas** double as the contract tested in unit tests (`vitest`) — invalid payloads must fail, valid ones must pass.
- **Server Actions** unit-tested against a test Neon branch (Neon's branching feature gives an isolated DB per CI run).
- **E2E** (Playwright): guest checkout, M-Pesa STK happy path (mocked callback), search + filter + sort combination, admin product CRUD, RBAC boundary (support role cannot access `/admin/users`).
- **Lighthouse CI** gate on Core Web Vitals for homepage, category, and PDP templates before merge.

---

## 24. Phased Delivery Roadmap

1. **Foundation** — Next.js scaffold, Tailwind + shadcn init, Drizzle + Neon connection, env config, base layout, Sonner mounted.
2. **Auth & RBAC** — users/roles/permissions schema, bcrypt, sessions, middleware, register/login forms, audit log plumbing.
3. **Catalog core** — categories (nested), brands, products, spec-attribute templates, variants, image/video models; admin CRUD for all of it.
4. **Storefront browse** — homepage sections, category/brand landing pages, PDP, search (Postgres FTS + trigram), filters, sorting.
5. **Cart, wishlist, compare** — guest + user cart merge, save-for-later, cross-sell, wishlist alerts, compare table.
6. **Checkout & payments** — address book, M-Pesa STK, card/bank, COD, transactional order placement, inventory reservation.
7. **Post-purchase** — order timeline, shipments/tracking, invoices, returns/exchanges, reviews + Q&A, support tickets.
8. **Admin operations** — orders board, inventory management, coupons/gift cards, reports, shipping config.
9. **Marketing & retention** — abandoned cart recovery, email/SMS/WhatsApp campaigns, loyalty, referrals, affiliates.
10. **Content & SEO** — blog, CMS pages, full metadata/schema.org rollout, sitemaps/robots/redirects, OG image generation.
11. **Analytics & hardening** — analytics event pipeline + admin reports, 2FA, rate limiting, reCAPTCHA, fraud checks, CSP.
12. **Performance pass** — ISR tuning, `unstable_cache` on hot paths, image/CDN audit, Lighthouse CI gate, load testing checkout under concurrency (stock-race conditions).

---

## 25. Key Non-Functional Decisions Worth Flagging

- **Stock correctness under concurrency**: inventory decrement happens inside the same DB transaction as order creation (§12.3), using row-level locking (`SELECT ... FOR UPDATE` via Drizzle's `sql` tag) to prevent overselling during flash sales.
- **Guest → account merge**: cart, wishlist, and compare all key off a `sessionToken` cookie so nothing is lost if a guest registers mid-session.
- **Money as `numeric`, never `float`**: all price columns use Postgres `numeric` to avoid floating-point rounding errors in VAT/discount math.
- **Snapshot pricing on orders**: `orderItems.unitPrice` and `productTitleSnapshot` are copied at purchase time — later price/title edits never retroactively alter historical orders/invoices.