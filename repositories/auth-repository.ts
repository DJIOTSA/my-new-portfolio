import { ensureDatabase } from "@/db/init";
import { deleteRows, insertRows, selectRows, updateRows } from "@/db/supabase-rest";
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
  const [row] = await selectRows<{
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
  }>("admin_users", { filters: [{ column: "username", operator: "eq", value: username }], limit: 1 });

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserEntity | null> {
  await ensureDatabase();
  const [row] = await selectRows<{
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
  }>("admin_users", { filters: [{ column: "email", operator: "ilike", value: email }], limit: 1 });

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUserByIdentifier(identifier: string): Promise<AdminUserEntity | null> {
  return identifier.includes("@")
    ? getAdminUserByEmail(identifier)
    : getAdminUserByUsername(identifier);
}

export async function getAdminUserById(id: string): Promise<AdminUserEntity | null> {
  await ensureDatabase();
  const [row] = await selectRows<{
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
  }>("admin_users", { filters: [{ column: "id", operator: "eq", value: id }], limit: 1 });

  return row ? mapAdminUser(row) : null;
}

export async function getAdminUsers(): Promise<AdminUserEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
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
  }>("admin_users", { orderBy: { column: "created_at", ascending: true } });

  return rows.map(mapAdminUser);
}

export async function updateAdminUserPassword(userId: string, passwordHash: string): Promise<void> {
  await ensureDatabase();
  await updateRows("admin_users", {
    password_hash: passwordHash,
    updated_at: new Date().toISOString()
  }, [{ column: "id", operator: "eq", value: userId }], { returning: "minimal" });
}

export async function markAdminUserEmailVerified(userId: string): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_users", {
    email_verified_at: now,
    updated_at: now
  }, [{ column: "id", operator: "eq", value: userId }], { returning: "minimal" });
}

export async function updateAdminUserLastLogin(userId: string): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_users", { last_login_at: now, updated_at: now }, [{ column: "id", operator: "eq", value: userId }], { returning: "minimal" });
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
  const now = new Date().toISOString();
  await insertRows("admin_refresh_tokens", {
    id: input.id,
    user_id: input.userId,
    token_hash: input.tokenHash,
    expires_at: input.expiresAt,
    revoked_at: null,
    replaced_by_token_id: null,
    user_agent: input.userAgent ?? null,
    ip_address: input.ipAddress ?? null,
    created_at: now,
    updated_at: now
  }, { returning: "minimal" });
}

export async function getRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
  await ensureDatabase();
  const [row] = await selectRows<{
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
  }>("admin_refresh_tokens", { filters: [{ column: "token_hash", operator: "eq", value: tokenHash }], limit: 1 });

  return row ? mapRefreshToken(row) : null;
}

export async function revokeRefreshToken(tokenId: string, replacedByTokenId?: string | null): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_refresh_tokens", {
    revoked_at: now,
    replaced_by_token_id: replacedByTokenId ?? null,
    updated_at: now
  }, [{ column: "id", operator: "eq", value: tokenId }], { returning: "minimal" });
}

export async function revokeAllRefreshTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_refresh_tokens", {
    revoked_at: now,
    updated_at: now
  }, [{ column: "user_id", operator: "eq", value: userId }], { returning: "minimal" });
}

export async function createEmailVerificationToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await insertRows("admin_email_verification_tokens", {
    id: input.id,
    user_id: input.userId,
    token_hash: input.tokenHash,
    expires_at: input.expiresAt,
    consumed_at: null,
    created_at: now,
    updated_at: now
  }, { returning: "minimal" });
}

export async function getEmailVerificationTokenByHash(tokenHash: string): Promise<AuthOneTimeTokenEntity | null> {
  await ensureDatabase();
  const [row] = await selectRows<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: string;
    consumed_at: string | null;
    created_at: string;
    updated_at: string;
  }>("admin_email_verification_tokens", { filters: [{ column: "token_hash", operator: "eq", value: tokenHash }], limit: 1 });

  return row ? mapOneTimeToken(row) : null;
}

export async function consumeEmailVerificationToken(tokenId: string): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_email_verification_tokens", {
    consumed_at: now,
    updated_at: now
  }, [{ column: "id", operator: "eq", value: tokenId }], { returning: "minimal" });
}

export async function invalidateEmailVerificationTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  await deleteRows("admin_email_verification_tokens", [{ column: "user_id", operator: "eq", value: userId }]);
}

export async function createPasswordResetToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await insertRows("admin_password_reset_tokens", {
    id: input.id,
    user_id: input.userId,
    token_hash: input.tokenHash,
    expires_at: input.expiresAt,
    consumed_at: null,
    created_at: now,
    updated_at: now
  }, { returning: "minimal" });
}

export async function getPasswordResetTokenByHash(tokenHash: string): Promise<AuthOneTimeTokenEntity | null> {
  await ensureDatabase();
  const [row] = await selectRows<{
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: string;
    consumed_at: string | null;
    created_at: string;
    updated_at: string;
  }>("admin_password_reset_tokens", { filters: [{ column: "token_hash", operator: "eq", value: tokenHash }], limit: 1 });

  return row ? mapOneTimeToken(row) : null;
}

export async function consumePasswordResetToken(tokenId: string): Promise<void> {
  await ensureDatabase();
  const now = new Date().toISOString();
  await updateRows("admin_password_reset_tokens", {
    consumed_at: now,
    updated_at: now
  }, [{ column: "id", operator: "eq", value: tokenId }], { returning: "minimal" });
}

export async function invalidatePasswordResetTokensForUser(userId: string): Promise<void> {
  await ensureDatabase();
  await deleteRows("admin_password_reset_tokens", [{ column: "user_id", operator: "eq", value: userId }]);
}
