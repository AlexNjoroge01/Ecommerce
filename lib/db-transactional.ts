import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"
import * as schema from "@/drizzle/schema"

/*
  Pooled/WebSocket client for multi-statement transactions — checkout and
  inventory decrement run here so stock stays correct under concurrency
  (Blueprint §12.3, §25). Guarded so importing it without DATABASE_URL is safe.
*/
export const dbTx = process.env.DATABASE_URL
  ? drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema })
  : (null as unknown as ReturnType<typeof drizzle>)
