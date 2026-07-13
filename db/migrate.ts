import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

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

async function ensureMigrationsTable(sql: postgres.Sql) {
  await sql`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `;
}

async function getAppliedMigrationIds(sql: postgres.Sql): Promise<Set<string>> {
  const rows = await sql<{ id: string }[]>`select id from schema_migrations order by id asc`;
  return new Set(rows.map((row) => row.id));
}

async function applyMigration(sql: postgres.Sql, fileName: string): Promise<void> {
  const filePath = path.join(migrationsDirectory, fileName);
  const statement = fs.readFileSync(filePath, "utf8").trim();

  if (!statement) {
    return;
  }

  await sql`select set_config('app.admin_email', ${process.env.ADMIN_EMAIL ?? "admin@example.com"}, false)`;
  await sql.unsafe(statement);
  await sql`insert into schema_migrations (id) values (${fileName}) on conflict (id) do nothing`;
}

export async function applyMigrations(sql: postgres.Sql): Promise<void> {
  await ensureMigrationsTable(sql);

  const files = getMigrationFiles();
  const appliedMigrationIds = await getAppliedMigrationIds(sql);

  for (const fileName of files) {
    if (appliedMigrationIds.has(fileName)) {
      continue;
    }

    await applyMigration(sql, fileName);
  }
}
