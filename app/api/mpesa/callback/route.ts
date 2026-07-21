import { NextResponse } from "next/server"
import { advanceOrder } from "@/lib/orders-store"

/*
  POST /api/mpesa/callback — Safaricom posts the async STK result here
  (Blueprint §12.4). On success we flip the order to `paid` and append a
  timeline entry; a real deployment maps CheckoutRequestID → order and verifies
  the amount before trusting the callback.
*/
interface DarajaCallback {
  Body?: {
    stkCallback?: {
      ResultCode?: number
      ResultDesc?: string
      CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] }
      MerchantRequestID?: string
      CheckoutRequestID?: string
    }
  }
  // Our simulated flow may post { orderId, success } directly.
  orderId?: string
  success?: boolean
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as DarajaCallback
  const stk = body.Body?.stkCallback

  const orderId = body.orderId
  const succeeded = stk ? stk.ResultCode === 0 : body.success !== false

  if (orderId) {
    advanceOrder(
      orderId,
      succeeded ? "paid" : "cancelled",
      succeeded ? "M-Pesa payment confirmed" : "M-Pesa payment failed or cancelled"
    )
  }

  // Safaricom expects this exact acknowledgement shape.
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })
}
