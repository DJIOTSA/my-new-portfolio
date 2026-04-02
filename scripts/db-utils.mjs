import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";
import { setDefaultResultOrder } from "node:dns";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  for (const rawLine of fileContents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadEnvironment() {
  const rootDirectory = process.cwd();
  loadEnvFile(path.join(rootDirectory, ".env"));
  loadEnvFile(path.join(rootDirectory, ".env.local"));
}

loadEnvironment();
setDefaultResultOrder("ipv4first");

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Add it to .env or .env.local.");
  }
  return databaseUrl;
}

export function getSql() {
  const databaseUrl = getDatabaseUrl();
  const hostname = new URL(databaseUrl).hostname;

  return postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    prepare: false,
    connect_timeout: 5,
    ssl: hostname.includes("supabase.co") ? "require" : undefined
  });
}

export function logStep(message) {
  process.stdout.write(`${message}\n`);
}
