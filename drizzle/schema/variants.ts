import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  boolean,
} from "drizzle-orm/pg-core"
import { products } from "./products"

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 50 }),
  storage: varchar("storage", { length: 50 }),
  size: varchar("size", { length: 50 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  quantity: integer("quantity").default(0),
  isDefault: boolean("is_default").default(false),
})

export const variantImages = pgTable("variant_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  url: varchar("url", { length: 500 }).notNull(),
})
