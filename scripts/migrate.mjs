import fs from "node:fs";
import path from "node:path";
import { getSql, logStep } from "./db-utils.mjs";

const sql = getSql();
const migrationsDirectory = path.join(process.cwd(), "db", "migrations");

function getMigrationFiles() {
  if (!fs.existsSync(migrationsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d+_.+\.sql$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function ensureMigrationsTable() {
  await sql`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `;
}

async function getAppliedMigrationIds() {
  const rows = await sql`select id from schema_migrations order by id asc`;
  return new Set(rows.map((row) => row.id));
}

async function applyMigration(fileName) {
  const filePath = path.join(migrationsDirectory, fileName);
  const statement = fs.readFileSync(filePath, "utf8").trim();

  if (!statement) {
    logStep(`Skipping empty migration ${fileName}`);
    return;
  }

  logStep(`Applying ${fileName}...`);
  await sql`select set_config('app.admin_email', ${process.env.ADMIN_EMAIL ?? "admin@example.com"}, false)`;
  await sql.unsafe(statement);
  await sql`insert into schema_migrations (id) values (${fileName}) on conflict (id) do nothing`;
}

async function migrate() {
  logStep("Running PostgreSQL migrations...");
  await ensureMigrationsTable();

  const files = getMigrationFiles();
  const appliedMigrationIds = await getAppliedMigrationIds();

  for (const fileName of files) {
    if (appliedMigrationIds.has(fileName)) {
      continue;
    }

    await applyMigration(fileName);
  }

  logStep("Migrations completed.");
}

try {
  await migrate();
} finally {
  await sql.end({ timeout: 1 });
}
