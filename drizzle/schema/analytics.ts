import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { carts } from "./cart"

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  channel: varchar("channel", { length: 20 }),
  name: varchar("name", { length: 200 }),
  subject: varchar("subject", { length: 200 }),
  body: text("body"),
  segment: varchar("segment", { length: 100 }),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
})

export const abandonedCarts = pgTable("abandoned_carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => carts.id),
  reminderStage: integer("reminder_stage").default(0),
  lastReminderAt: timestamp("last_reminder_at"),
})

export const affiliates = pgTable("affiliates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  code: varchar("code", { length: 30 }).unique(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),
})

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 50 }),
  userId: uuid("user_id"),
  sessionToken: varchar("session_token", { length: 255 }),
  productId: uuid("product_id"),
  query: varchar("query", { length: 255 }),
  metadata: varchar("metadata", { length: 2000 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
})
