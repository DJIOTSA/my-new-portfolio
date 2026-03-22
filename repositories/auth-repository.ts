import { ensureDatabase } from "@/lib/db/init";
import { getDb } from "@/lib/db/postgres";
import type { AdminUserEntity, AuthOneTimeTokenEntity, RefreshTokenEntity } from "@/lib/types";

function mapAdminUser(row: {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: "super-admin" | "editor";
  status: "active" | "disabled";
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}): AdminUserEntity {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    status: row.status,
    emailVerifiedAt: row.email_verified_at,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapRefreshToken(row: {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  replaced_by_token_id: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}): RefreshTokenEntity {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    replacedByTokenId: row.replaced_by_token_id,
    userAgent: row.user_agent,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapOneTimeToken(row: {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
  updated_at: string;
}): AuthOneTimeTokenEntity {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    consumedAt: row.consumed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getAdminUserByUsername(username: string): Promise<AdminUserEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    email_verified_at: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users where username = ${username} limit 1`;

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    email_verified_at: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users where lower(email) = lower(${email}) limit 1`;

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUserByIdentifier(identifier: string): Promise<AdminUserEntity | null> {
  return identifier.includes("@")
    ? getAdminUserByEmail(identifier)
    : getAdminUserByUsername(identifier);
}

export async function getAdminUserById(id: string): Promise<AdminUserEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    email_verified_at: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users where id = ${id} limit 1`;

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUsers(): Promise<AdminUserEntity[]> {
  await ensureDatabase();
  const sql = getDb();
  const rows = await sql<{
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: "super-admin" | "editor";
    status: "active" | "disabled";
    email_verified_at: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_users order by created_at asc`;

  return rows.map(mapAdminUser);
}

export async function updateAdminUserPassword(userId: string, passwordHash: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`
    update admin_users
    set password_hash = ${passwordHash},
        updated_at = ${new Date().toISOString()}
    where id = ${userId}
  `;
}

export async function markAdminUserEmailVerified(userId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_users
    set email_verified_at = coalesce(email_verified_at, ${now}),
        updated_at = ${now}
    where id = ${userId}
  `;
}

export async function updateAdminUserLastLogin(userId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_users
    set last_login_at = ${now},
        updated_at = ${now}
    where id = ${userId}
  `;
}

export async function createRefreshToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    insert into admin_refresh_tokens (
      id, user_id, token_hash, expires_at, revoked_at, replaced_by_token_id, user_agent, ip_address, created_at, updated_at
    ) values (
      ${input.id}, ${input.userId}, ${input.tokenHash}, ${input.expiresAt}, null, null, ${input.userAgent ?? null}, ${input.ipAddress ?? null}, ${now}, ${now}
    )
  `;
}

export async function getRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: string;
    revoked_at: string | null;
    replaced_by_token_id: string | null;
    user_agent: string | null;
    ip_address: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_refresh_tokens where token_hash = ${tokenHash} limit 1`;

  return row ? mapRefreshToken(row) : null;
}

export async function revokeRefreshToken(tokenId: string, replacedByTokenId?: string | null): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_refresh_tokens
    set revoked_at = ${now},
        replaced_by_token_id = ${replacedByTokenId ?? null},
        updated_at = ${now}
    where id = ${tokenId}
  `;
}

export async function revokeAllRefreshTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_refresh_tokens
    set revoked_at = coalesce(revoked_at, ${now}),
        updated_at = ${now}
    where user_id = ${userId}
  `;
}

export async function createEmailVerificationToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    insert into admin_email_verification_tokens (
      id, user_id, token_hash, expires_at, consumed_at, created_at, updated_at
    ) values (
      ${input.id}, ${input.userId}, ${input.tokenHash}, ${input.expiresAt}, null, ${now}, ${now}
    )
  `;
}

export async function getEmailVerificationTokenByHash(tokenHash: string): Promise<AuthOneTimeTokenEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: string;
    consumed_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_email_verification_tokens where token_hash = ${tokenHash} limit 1`;

  return row ? mapOneTimeToken(row) : null;
}

export async function consumeEmailVerificationToken(tokenId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_email_verification_tokens
    set consumed_at = ${now},
        updated_at = ${now}
    where id = ${tokenId}
  `;
}

export async function invalidateEmailVerificationTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`delete from admin_email_verification_tokens where user_id = ${userId}`;
}

export async function createPasswordResetToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    insert into admin_password_reset_tokens (
      id, user_id, token_hash, expires_at, consumed_at, created_at, updated_at
    ) values (
      ${input.id}, ${input.userId}, ${input.tokenHash}, ${input.expiresAt}, null, ${now}, ${now}
    )
  `;
}

export async function getPasswordResetTokenByHash(tokenHash: string): Promise<AuthOneTimeTokenEntity | null> {
  await ensureDatabase();
  const sql = getDb();
  const [row] = await sql<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: string;
    consumed_at: string | null;
    created_at: string;
    updated_at: string;
  }[]>`select * from admin_password_reset_tokens where token_hash = ${tokenHash} limit 1`;

  return row ? mapOneTimeToken(row) : null;
}

export async function consumePasswordResetToken(tokenId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  const now = new Date().toISOString();
  await sql`
    update admin_password_reset_tokens
    set consumed_at = ${now},
        updated_at = ${now}
    where id = ${tokenId}
  `;
}

export async function invalidatePasswordResetTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  const sql = getDb();
  await sql`delete from admin_password_reset_tokens where user_id = ${userId}`;
}
