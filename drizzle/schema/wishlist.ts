import {
  pgTable,
  uuid,
  varchar,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { products } from "./products"

export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  shareToken: varchar("share_token", { length: 100 }).unique(),
})

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  wishlistId: uuid("wishlist_id")
    .notNull()
    .references(() => wishlists.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  priceAtAdd: numeric("price_at_add", { precision: 12, scale: 2 }),
  notifyOnPriceDrop: boolean("notify_on_price_drop").default(true),
  notifyOnRestock: boolean("notify_on_restock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})

export const compareItems = pgTable("compare_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
})
