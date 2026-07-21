import "server-only"
import { randomBytes, createHash } from "crypto"
import { and, eq, isNull } from "drizzle-orm"
import { db, isDbConfigured } from "@/lib/db"
import { magicLinks } from "@/drizzle/schema"

/*
  One-time magic-link tokens. The raw token travels in the email URL; only its
  SHA-256 hash is stored, with a 15-minute TTL and single-use `consumedAt`.
  DB-backed via Neon; falls back to an in-memory map without DATABASE_URL.
*/

const TTL_MS = 15 * 60 * 1000

function hash(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

interface MemToken {
  email: string
  expiresAt: number
  consumed: boolean
}
const mem = new Map<string, MemToken>() // key = tokenHash

/** Create a token for `email`, returning the raw token to embed in the URL. */
export async function createMagicToken(email: string): Promise<string> {
  const token = randomBytes(32).toString("hex")
  const tokenHash = hash(token)
  const expiresAt = new Date(Date.now() + TTL_MS)

  if (isDbConfigured) {
    await db.insert(magicLinks).values({ email: email.toLowerCase(), tokenHash, expiresAt })
  } else {
    mem.set(tokenHash, { email: email.toLowerCase(), expiresAt: expiresAt.getTime(), consumed: false })
  }
  return token
}

/** Consume a token: returns the email if valid, unexpired, and unused. */
export async function consumeMagicToken(token: string): Promise<string | null> {
  const tokenHash = hash(token)

  if (isDbConfigured) {
    const row = await db.query.magicLinks.findFirst({
      where: and(eq(magicLinks.tokenHash, tokenHash), isNull(magicLinks.consumedAt)),
    })
    if (!row) return null
    if (row.expiresAt.getTime() < Date.now()) return null
    await db.update(magicLinks).set({ consumedAt: new Date() }).where(eq(magicLinks.id, row.id))
    return row.email
  }

  const row = mem.get(tokenHash)
  if (!row || row.consumed || row.expiresAt < Date.now()) return null
  row.consumed = true
  return row.email
}
