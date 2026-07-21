import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { categories } from "./categories"
import { brands } from "./brands"

export const conditionEnum = pgEnum("condition", ["new", "refurbished", "used"])
export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "backorder",
])

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  barcode: varchar("barcode", { length: 100 }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id),
  description: text("description"),
  highlights: varchar("highlights", { length: 2000 }),
  warranty: varchar("warranty", { length: 255 }),
  condition: conditionEnum("condition").default("new"),
  weightGrams: integer("weight_grams"),
  dimensions: varchar("dimensions", { length: 100 }),
  manufacturer: varchar("manufacturer", { length: 150 }),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }),

  regularPrice: numeric("regular_price", { precision: 12, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 12, scale: 2 }),
  installmentPrice: numeric("installment_price", { precision: 12, scale: 2 }),
  wholesalePrice: numeric("wholesale_price", { precision: 12, scale: 2 }),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).default("16.00"),

  stockStatus: stockStatusEnum("stock_status").default("in_stock"),
  totalQuantity: integer("total_quantity").default(0),

  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),

  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  url: varchar("url", { length: 500 }).notNull(),
  altText: varchar("alt_text", { length: 255 }),
  is360: boolean("is_360").default(false),
  sortOrder: integer("sort_order").default(0),
})

export const productVideos = pgTable("product_videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
})

export const specAttributes = pgTable("spec_attributes", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  key: varchar("key", { length: 100 }).notNull(),
  label: varchar("label", { length: 150 }).notNull(),
  unit: varchar("unit", { length: 30 }),
  sortOrder: integer("sort_order").default(0),
  isFilterable: boolean("is_filterable").default(true),
})

export const productSpecValues = pgTable("product_spec_values", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  attributeId: uuid("attribute_id")
    .notNull()
    .references(() => specAttributes.id),
  value: varchar("value", { length: 255 }).notNull(),
})
