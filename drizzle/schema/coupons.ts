import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 20 }),
  value: numeric("value", { precision: 12, scale: 2 }),
  minOrderValue: numeric("min_order_value", { precision: 12, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
})

export const giftCards = pgTable("gift_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  initialBalance: numeric("initial_balance", { precision: 12, scale: 2 }),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }),
  issuedToUserId: uuid("issued_to_user_id").references(() => users.id),
  expiresAt: timestamp("expires_at"),
})
