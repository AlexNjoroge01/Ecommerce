import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "@/drizzle/schema"

/*
  Read/HTTP Drizzle client for Neon serverless Postgres (Blueprint §5).
  `neon()` is lazy — it doesn't open a connection until a query runs — so we can
  always construct a fully-typed client and simply guard actual usage behind
  `isDbConfigured`. The storefront reads through lib/queries.ts, which falls back
  to the seed catalog in dev when DATABASE_URL is absent.
*/
export const isDbConfigured = Boolean(process.env.DATABASE_URL)

const connectionString = process.env.DATABASE_URL ?? "postgresql://user:pass@localhost/placeholder"

export const db = drizzle(neon(connectionString), { schema })
