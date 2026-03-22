import { getDb } from "@/lib/db/postgres";
import type { AdminUserEntity } from "@/lib/types";

export async function getAdminUserByUsername(username: string): Promise<AdminUserEntity | null> {
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    username: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users where username = ${username} limit 1`;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAdminUsers(): Promise<AdminUserEntity[]> {
  const sql = getDb();
  const rows = await sql<{
    id: string;
    username: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users order by created_at asc`;

  return rows.map((row) => ({
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}
