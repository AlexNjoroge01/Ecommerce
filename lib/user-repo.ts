import "server-only"
import { randomBytes } from "crypto"
import { eq } from "drizzle-orm"
import { db, isDbConfigured } from "@/lib/db"
import { users } from "@/drizzle/schema"
import { findUserByEmail as memFind, createUser as memCreate } from "@/lib/users-store"
import type { Role } from "@/lib/types"

/*
  User persistence for auth. Uses the Neon `users` table when DATABASE_URL is
  set, otherwise the in-memory demo store (lib/users-store). Passwordless: rows
  created via magic link carry a "magic-link" placeholder hash.
*/

export interface UserRecord {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: Role
}

function adminEmails(): string[] {
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (!list.includes("admin@atlaslabs.store")) list.push("admin@atlaslabs.store")
  return list
}

export function roleForEmail(email: string): Role {
  return adminEmails().includes(email.toLowerCase()) ? "admin" : "customer"
}

export function displayName(u: Pick<UserRecord, "firstName" | "lastName" | "email">): string {
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim()
  return full || u.email.split("@")[0]
}

function makeReferralCode(): string {
  return `ATL${randomBytes(4).toString("hex").toUpperCase().slice(0, 6)}`
}

/** Find the user by email, creating them (passwordless) if they don't exist. */
export async function findOrCreateUser(email: string, name?: string): Promise<UserRecord> {
  const lower = email.toLowerCase()
  const desiredRole = roleForEmail(lower)
  const [first, ...rest] = (name ?? "").trim().split(/\s+/).filter(Boolean)

  if (isDbConfigured) {
    const existing = await db.query.users.findFirst({ where: eq(users.email, lower) })
    if (existing) {
      // Keep admin designation in sync with ADMIN_EMAILS.
      if (existing.role !== desiredRole && desiredRole === "admin") {
        await db.update(users).set({ role: desiredRole }).where(eq(users.id, existing.id))
      }
      return {
        id: existing.id,
        email: existing.email,
        firstName: existing.firstName,
        lastName: existing.lastName,
        role: desiredRole === "admin" ? "admin" : (existing.role as Role),
      }
    }
    const [created] = await db
      .insert(users)
      .values({
        email: lower,
        passwordHash: "magic-link",
        firstName: first ?? null,
        lastName: rest.join(" ") || null,
        role: desiredRole,
        referralCode: makeReferralCode(),
      })
      .returning()
    return {
      id: created.id,
      email: created.email,
      firstName: created.firstName,
      lastName: created.lastName,
      role: created.role as Role,
    }
  }

  // In-memory fallback (no DATABASE_URL)
  const found = memFind(lower)
  if (found) {
    return {
      id: found.id,
      email: found.email,
      firstName: found.firstName,
      lastName: found.lastName,
      role: desiredRole === "admin" ? "admin" : found.role,
    }
  }
  const u = memCreate({
    email: lower,
    passwordHash: "magic-link",
    firstName: first ?? "",
    lastName: rest.join(" "),
    phone: "",
  })
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: desiredRole === "admin" ? "admin" : u.role,
  }
}
