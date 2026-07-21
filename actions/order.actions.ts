"use server"

import { randomUUID } from "crypto"
import { cookies } from "next/headers"
import { checkoutSchema, PICKUP_STATIONS, type CheckoutInput } from "@/lib/validations/checkout.schema"
import { getCartSummary, CART_COOKIE, COUPON_COOKIE } from "@/lib/cart"
import { saveOrder } from "@/lib/orders-store"
import { initiateStkPush } from "@/lib/mpesa"
import { formatOrderNumber } from "@/lib/format"
import type { Order } from "@/lib/types"
import type { ActionResult } from "@/actions/auth.actions"

export async function placeOrderAction(
  input: CheckoutInput
): Promise<ActionResult<{ orderId: string; mpesaMessage?: string }>> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Please check the form"
    return { success: false, error: first }
  }

  // Totals are recomputed server-side — never trusted from the client (§12.4).
  const summary = await getCartSummary()
  if (summary.lines.length === 0) {
    return { success: false, error: "Your cart is empty" }
  }

  const data = parsed.data
  const id = randomUUID()
  const orderNumber = formatOrderNumber(id)
  const now = new Date().toISOString()

  const destination =
    data.fulfillment === "pickup"
      ? PICKUP_STATIONS.find((s) => s.id === data.pickupWarehouseId)?.name ?? "Pickup station"
      : [data.county, data.subCounty, data.estate].filter(Boolean).join(" · ")

  const order: Order = {
    id,
    orderNumber,
    status: data.paymentMethod === "cod" ? "processing" : "pending",
    paymentMethod: data.paymentMethod,
    createdAt: now,
    items: summary.lines.map((l) => ({
      title: l.product.title,
      variantLabel: [l.variant.color, l.variant.storage].filter(Boolean).join(" · "),
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      image: l.product.images[0]?.url ?? "steel",
    })),
    subtotal: summary.subtotal,
    taxTotal: summary.taxTotal,
    shippingTotal: summary.shippingTotal,
    discountTotal: summary.discountTotal,
    grandTotal: summary.grandTotal,
    fulfillment: data.fulfillment,
    destination,
    timeline: [{ status: "pending", note: "Order placed", at: now }],
  }

  let mpesaMessage: string | undefined
  if (data.paymentMethod === "mpesa") {
    const res = await initiateStkPush({
      orderId: id,
      phone: data.phoneForStk!,
      amount: summary.grandTotal,
    })
    if (!res.ok) return { success: false, error: res.message }
    mpesaMessage = res.message
    order.timeline.push({
      status: "pending",
      note: res.simulated ? "STK push sent (simulated)" : "STK push sent — awaiting confirmation",
      at: new Date().toISOString(),
    })
  }

  saveOrder(order)

  // Clear the cart + coupon now that the order exists.
  const store = await cookies()
  store.delete(CART_COOKIE)
  store.delete(COUPON_COOKIE)

  return { success: true, data: { orderId: id, mpesaMessage } }
}
