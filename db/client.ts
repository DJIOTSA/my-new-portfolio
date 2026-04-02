import { setDefaultResultOrder } from "node:dns";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: postgres.Sql | undefined;
}

setDefaultResultOrder("ipv4first");

export function getDb(): postgres.Sql {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.__postgresClient) {
    const hostname = new URL(databaseUrl).hostname;
    globalThis.__postgresClient = postgres(databaseUrl, {
      max: 5,
      idle_timeout: 20,
      prepare: false,
      connect_timeout: 5,
      ssl: hostname.includes("supabase.co") ? "require" : undefined,
      onnotice: () => {}
    });
  }

  return globalThis.__postgresClient;
}
