import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  migrations: {
    prefix: "timestamp"
  },
  strict: true,
  verbose: true
});
