import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { products } from "./products"
import { users } from "./users"
import { orders } from "./orders"

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  orderId: uuid("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 200 }),
  body: text("body"),
  pros: varchar("pros", { length: 1000 }),
  cons: varchar("cons", { length: 1000 }),
  helpfulVotes: integer("helpful_votes").default(0),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const reviewMedia = pgTable("review_media", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id),
  url: varchar("url", { length: 500 }).notNull(),
  type: varchar("type", { length: 10 }),
})

export const productQuestions = pgTable("product_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  question: varchar("question", { length: 500 }),
  answer: varchar("answer", { length: 1000 }),
  answeredBy: uuid("answered_by").references(() => users.id),
})
