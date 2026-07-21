import "server-only"
import type { Role } from "@/lib/types"

/*
  Demo user store — in-memory so auth works end-to-end without a DB. When
  DATABASE_URL is set, these reads/writes move to the `users` Drizzle table.
  Passwords are stored as bcrypt hashes. Seed logins:
    customer  — shopper@atlaslabs.store / password123
    admin     — admin@atlaslabs.store   / password123
  ("password123" bcrypt hash, salt rounds 12)
*/

export interface StoredUser {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone: string
  role: Role
  loyaltyPoints: number
}

// bcrypt hash of "password123"
const DEMO_HASH = "$2b$12$Z4eqrVB27Pjn08SxK.xP2OTE.nZ6j4BOUC9qpIjf1zx1/sAfarmXK"

const users = new Map<string, StoredUser>()

function seed(u: StoredUser) {
  users.set(u.email.toLowerCase(), u)
}

seed({
  id: "u-shopper",
  email: "shopper@atlaslabs.store",
  passwordHash: DEMO_HASH,
  firstName: "Amara",
  lastName: "Otieno",
  phone: "+254712345678",
  role: "customer",
  loyaltyPoints: 1240,
})
seed({
  id: "u-admin",
  email: "admin@atlaslabs.store",
  passwordHash: DEMO_HASH,
  firstName: "Atlas",
  lastName: "Operator",
  phone: "+254700000000",
  role: "admin",
  loyaltyPoints: 0,
})

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase())
}

export function createUser(u: Omit<StoredUser, "id" | "role" | "loyaltyPoints">): StoredUser {
  const user: StoredUser = {
    ...u,
    id: `u-${Math.abs(hashStr(u.email))}`,
    role: "customer",
    loyaltyPoints: 0,
  }
  users.set(u.email.toLowerCase(), user)
  return user
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return h
}
