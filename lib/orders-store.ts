import "server-only"
import type { Order, OrderStatus } from "@/lib/types"
import { photo } from "@/lib/images"

/*
  In-memory order store — keeps placed orders for the confirmation + account
  pages without a DB. Moves to the `orders`/`order_items`/`order_timeline`
  tables (drizzle/schema/orders.ts) when DATABASE_URL is set.
*/

const orders = new Map<string, Order>()

// A couple of seed orders for the demo shopper's account history.
const seedOrders: Order[] = [
  {
    id: "o-seed-1",
    orderNumber: "ATL-9K2M-77QP",
    status: "delivered",
    paymentMethod: "mpesa",
    createdAt: "2026-06-02T12:30:00Z",
    items: [
      { title: "Wireless Noise-Cancelling Earbuds", variantLabel: "Black", quantity: 1, unitPrice: 9999, image: photo("earbuds,headphones,wireless", 200, 200, 101) },
      { title: "Organic Arabica Coffee Beans 1kg", variantLabel: "Espresso", quantity: 2, unitPrice: 1999, image: photo("coffee,beans,roast", 200, 200, 161) },
    ],
    subtotal: 13997,
    taxTotal: 1931,
    shippingTotal: 500,
    discountTotal: 0,
    grandTotal: 14497,
    fulfillment: "delivery",
    destination: "Nairobi · Westlands",
    timeline: [
      { status: "pending", note: "Order placed", at: "2026-06-02T12:30:00Z" },
      { status: "paid", note: "M-Pesa payment confirmed", at: "2026-06-02T12:31:00Z" },
      { status: "shipped", note: "Dispatched from Nairobi CBD", at: "2026-06-03T09:00:00Z" },
      { status: "delivered", note: "Delivered — signed by A. Otieno", at: "2026-06-03T15:20:00Z" },
    ],
  },
  {
    id: "o-seed-2",
    orderNumber: "ATL-4T8W-12RX",
    status: "shipped",
    paymentMethod: "card",
    createdAt: "2026-07-15T08:10:00Z",
    items: [
      { title: "Nordic Linen 3-Seater Sofa", variantLabel: "Oat", quantity: 1, unitPrice: 79999, image: photo("sofa,couch,livingroom", 200, 200, 41) },
    ],
    subtotal: 79999,
    taxTotal: 11034,
    shippingTotal: 0,
    discountTotal: 0,
    grandTotal: 79999,
    fulfillment: "delivery",
    destination: "Nairobi · Kilimani",
    timeline: [
      { status: "pending", note: "Order placed", at: "2026-07-15T08:10:00Z" },
      { status: "paid", note: "Card payment confirmed", at: "2026-07-15T08:11:00Z" },
      { status: "shipped", note: "Dispatched — tracking G4S-88213", at: "2026-07-16T10:00:00Z" },
    ],
  },
]
seedOrders.forEach((o) => orders.set(o.id, o))

export function saveOrder(order: Order) {
  orders.set(order.id, order)
}

export function getOrderById(id: string): Order | undefined {
  return orders.get(id)
}

export function listOrders(): Order[] {
  return [...orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Transition an order's status and append a timeline entry (e.g. M-Pesa callback). */
export function advanceOrder(id: string, status: OrderStatus, note: string): Order | undefined {
  const order = orders.get(id)
  if (!order) return undefined
  order.status = status
  order.timeline.push({ status, note, at: new Date().toISOString() })
  orders.set(id, order)
  return order
}
