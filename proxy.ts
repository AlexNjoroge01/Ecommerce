import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

/*
  Next 16 renamed `middleware` → `proxy` (runs before routes). Auth gate for
  /admin and /account (Blueprint §6.3). We verify the session cookie inline
  here (Edge-compatible: jose only, no bcrypt/node imports).
*/

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "atlas-labs-dev-secret-change-in-production-32b"
)
const ADMIN_ROLES = ["editor", "manager", "admin", "superadmin"]

async function readSession(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: string; role: string }
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("session")?.value
  const session = await readSession(token)

  if (pathname.startsWith("/admin")) {
    if (!session || !ADMIN_ROLES.includes(session.role)) {
      const url = new URL("/login", req.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith("/account")) {
    if (!session) {
      const url = new URL("/login", req.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
}
