import "server-only"
import { Resend } from "resend"
import { SITE } from "@/lib/site"

/*
  Transactional email via Resend (Blueprint §17). Without RESEND_API_KEY we
  no-op and let the caller surface the link in dev. The default `from` uses
  Resend's shared onboarding domain, which only delivers to the Resend account
  owner — set EMAIL_FROM to an address on your own verified domain for real sends.
*/

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM = process.env.EMAIL_FROM ?? "Atlas Market <onboarding@resend.dev>"

export const isEmailConfigured = Boolean(resend)

export async function sendMagicLinkEmail(to: string, url: string) {
  if (!resend) return { sent: false as const, reason: "RESEND_API_KEY not set" }
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ${SITE.name} sign-in link`,
    html: magicLinkHtml(url),
  })
  if (error) return { sent: false as const, reason: error.message }
  return { sent: true as const }
}

function magicLinkHtml(url: string) {
  return `
  <div style="background:#F7FAFC;padding:40px 0;font-family:Inter,Arial,sans-serif">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #D3E1E8;border-radius:20px;overflow:hidden">
      <div style="background:linear-gradient(120deg,#14C6DE,#3457FF);height:6px"></div>
      <div style="padding:36px 40px">
        <div style="font-size:20px;font-weight:700;color:#0B1B2E;margin-bottom:24px">
          Atlas<span style="color:#14C6DE">Market</span>
        </div>
        <h1 style="font-size:22px;color:#0B1B2E;margin:0 0 12px">Sign in to Atlas Market</h1>
        <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 28px">
          Tap the button below to sign in. This link expires in 15 minutes and can
          be used once.
        </p>
        <a href="${url}" style="display:inline-block;background:#3457FF;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px">
          Sign in to Atlas Market
        </a>
        <p style="font-size:13px;line-height:1.6;color:#7C93A3;margin:28px 0 0">
          If the button doesn't work, paste this link into your browser:<br/>
          <span style="color:#3457FF;word-break:break-all">${url}</span>
        </p>
        <p style="font-size:13px;line-height:1.6;color:#7C93A3;margin:24px 0 0">
          Didn't request this? You can safely ignore this email.
        </p>
      </div>
    </div>
  </div>`
}
