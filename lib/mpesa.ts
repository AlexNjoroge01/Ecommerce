import "server-only"

/*
  M-Pesa Daraja STK Push (Blueprint §12.4). Real implementation obtains an OAuth
  token, builds the Lipa-na-M-Pesa password (shortcode + passkey + timestamp),
  and POSTs to /stkpush. Without credentials we simulate an accepted push so the
  checkout flow is demonstrable end-to-end.
*/

export interface StkPushInput {
  orderId: string
  phone: string
  amount: number
}

export interface StkPushResult {
  ok: boolean
  checkoutRequestId?: string
  message: string
  simulated?: boolean
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("0")) return `254${digits.slice(1)}`
  if (digits.startsWith("254")) return digits
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`
  return digits
}

export async function initiateStkPush(input: StkPushInput): Promise<StkPushResult> {
  const phone = normalizePhone(input.phone)
  const configured =
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY

  if (!configured) {
    return {
      ok: true,
      simulated: true,
      checkoutRequestId: `SIM-${input.orderId.slice(0, 8)}`,
      message: `Simulated STK push to ${phone} for KES ${Math.round(input.amount).toLocaleString()}`,
    }
  }

  try {
    // 1) OAuth token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64")
    const tokenRes = await fetch(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    )
    const { access_token } = (await tokenRes.json()) as { access_token: string }

    // 2) STK push
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14)
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64")

    const res = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(input.amount),
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: input.orderId.slice(0, 12),
        TransactionDesc: "Atlas Market order",
      }),
    })
    const data = (await res.json()) as { CheckoutRequestID?: string; ResponseDescription?: string }
    return {
      ok: res.ok,
      checkoutRequestId: data.CheckoutRequestID,
      message: data.ResponseDescription ?? "STK push sent",
    }
  } catch {
    return { ok: false, message: "Could not reach M-Pesa — try again" }
  }
}
