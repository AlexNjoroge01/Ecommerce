import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { consumeMagicToken } from "@/lib/magic-link"
import { findOrCreateUser, displayName } from "@/lib/user-repo"
import { createSession } from "@/lib/auth"

/*
  GET /auth/verify?token=…&name=…&next=… — the magic-link landing.
  Consumes the one-time token, creates/looks up the user, starts a session,
  then redirects. Cookie mutations from createSession() are applied to the
  redirect response by Next automatically.
*/
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const name = req.nextUrl.searchParams.get("name") ?? undefined
  const next = req.nextUrl.searchParams.get("next")

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url))
  }

  const email = await consumeMagicToken(token)
  if (!email) {
    return NextResponse.redirect(new URL("/login?error=expired", req.url))
  }

  const user = await findOrCreateUser(email, name)
  await createSession({
    userId: user.id,
    role: user.role,
    name: displayName(user),
    email: user.email,
  })

  const dest = next && next.startsWith("/") ? next : "/account"
  return NextResponse.redirect(new URL(dest, req.url))
}
