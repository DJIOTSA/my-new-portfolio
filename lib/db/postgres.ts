import { setDefaultResultOrder } from "node:dns";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __postgresClient: postgres.Sql | undefined;
}

const databaseUrl = process.env.DATABASE_URL;
setDefaultResultOrder("ipv4first");

export function getDb(): postgres.Sql {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.__postgresClient) {
    globalThis.__postgresClient = postgres(databaseUrl, {
      max: 5,
      idle_timeout: 20,
      prepare: false,
      connect_timeout: 5,
      onnotice: () => {}
    });
  }

  return globalThis.__postgresClient;
}
