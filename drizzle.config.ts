import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

// Load .env (and .env.local override) so DATABASE_URL is available to the CLI.
config({ path: ".env" })
config({ path: ".env.local", override: true })

export default defineConfig({
  schema: "./drizzle/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
