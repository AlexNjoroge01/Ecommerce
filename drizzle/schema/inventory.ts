import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core"
import { productVariants } from "./variants"

export const warehouses = pgTable("warehouses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  county: varchar("county", { length: 100 }),
  isPickupStation: boolean("is_pickup_station").default(false),
})

export const inventoryLevels = pgTable("inventory_levels", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  warehouseId: uuid("warehouse_id")
    .notNull()
    .references(() => warehouses.id),
  quantity: integer("quantity").default(0),
  reserved: integer("reserved").default(0),
  incoming: integer("incoming").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
})

export const inventoryHistory = pgTable("inventory_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id),
  warehouseId: uuid("warehouse_id").references(() => warehouses.id),
  change: integer("change").notNull(),
  reason: varchar("reason", { length: 150 }),
  createdAt: timestamp("created_at").defaultNow(),
})
