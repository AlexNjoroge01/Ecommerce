"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { z } from "zod"
import { destroySession } from "@/lib/auth"
import { createMagicToken } from "@/lib/magic-link"
import { sendMagicLinkEmail, isEmailConfigured } from "@/lib/email"

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

const requestSchema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().optional(),
  next: z.string().optional(),
})
export type MagicLinkInput = z.infer<typeof requestSchema>

async function baseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

/**
 * Send a passwordless sign-in link. Always returns success for a valid email
 * (no account enumeration). In dev, returns the link so it can be opened without
 * a configured mailbox.
 */
export async function requestMagicLinkAction(
  input: MagicLinkInput
): Promise<ActionResult<{ devLink?: string; emailed: boolean }>> {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email" }
  }
  const { email, name, next } = parsed.data

  const token = await createMagicToken(email)
  const url = new URL("/auth/verify", await baseUrl())
  url.searchParams.set("token", token)
  if (name) url.searchParams.set("name", name)
  if (next) url.searchParams.set("next", next)
  const link = url.toString()

  const result = await sendMagicLinkEmail(email, link)
  const isDev = process.env.NODE_ENV !== "production"

  if (!result.sent && !isDev) {
    return { success: false, error: "Couldn't send the email just now — try again shortly" }
  }
  if (!result.sent && isDev) {
    // Surface the link for local testing when email isn't configured/allowed.
    console.log(`\n🔗 Magic link for ${email}:\n${link}\n`)
  }

  return {
    success: true,
    data: { emailed: result.sent && isEmailConfigured, devLink: isDev ? link : undefined },
  }
}

export async function logoutAction() {
  await destroySession()
  redirect("/")
}
