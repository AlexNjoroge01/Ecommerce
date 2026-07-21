import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core"
import { users } from "./users"
import { addresses } from "./users"
import { warehouses } from "./inventory"
import { productVariants } from "./variants"

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
])
export const paymentMethodEnum = pgEnum("payment_method", [
  "mpesa",
  "card",
  "bank",
  "cod",
])

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  guestEmail: varchar("guest_email", { length: 255 }),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentReference: varchar("payment_reference", { length: 150 }),

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
})

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  productTitleSnapshot: varchar("product_title_snapshot", { length: 255 }),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
})

export const orderTimeline = pgTable("order_timeline", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  status: orderStatusEnum("status").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  courier: varchar("courier", { length: 150 }),
  trackingNumber: varchar("tracking_number", { length: 150 }),
  trackingUrl: varchar("tracking_url", { length: 500 }),
  estimatedDelivery: timestamp("estimated_delivery"),
})

export const returns = pgTable("returns", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id),
  reason: varchar("reason", { length: 500 }),
  type: varchar("type", { length: 20 }),
  status: varchar("status", { length: 30 }).default("requested"),
  createdAt: timestamp("created_at").defaultNow(),
})
