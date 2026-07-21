import "server-only"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

/*
  Auth per Blueprint §6. Uses bcryptjs (pure-JS drop-in for bcrypt — no native
  build step) and a jose-signed httpOnly session cookie.
*/

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12)
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "atlas-labs-dev-secret-change-in-production-32b"
)

export interface SessionPayload {
  userId: string
  role: string
  name: string
  email: string
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)

  const store = await cookies()
  store.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function destroySession() {
  ;(await cookies()).delete("session")
}
