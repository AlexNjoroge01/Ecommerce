import { NextResponse } from "next/server"
import { initiateStkPush } from "@/lib/mpesa"

/*
  POST /api/mpesa/stk-push — triggers a Safaricom Daraja STK push (Blueprint §12.4).
  The checkout server action calls initiateStkPush directly; this route exists for
  clients/integrations that prefer an HTTP entrypoint.
*/
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    orderId?: string
    phone?: string
    amount?: number
  } | null

  if (!body?.orderId || !body.phone || !body.amount) {
    return NextResponse.json(
      { ok: false, message: "orderId, phone and amount are required" },
      { status: 400 }
    )
  }

  const result = await initiateStkPush({
    orderId: body.orderId,
    phone: body.phone,
    amount: body.amount,
  })
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
