import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 50 }),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  authorId: uuid("author_id").references(() => users.id),
  metaTitle: varchar("meta_title", { length: 160 }),
  metaDescription: varchar("meta_description", { length: 320 }),
  relatedProductIds: varchar("related_product_ids", { length: 1000 }),
  publishedAt: timestamp("published_at"),
})
