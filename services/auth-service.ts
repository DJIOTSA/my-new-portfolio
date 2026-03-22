import { cookies, headers } from "next/headers";
import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ADMIN_ACCESS_COOKIE_NAME, ADMIN_REFRESH_COOKIE_NAME, SITE_URL } from "@/lib/constants";
import type { AdminSession } from "@/lib/types";
import {
  consumeEmailVerificationToken,
  consumePasswordResetToken,
  createEmailVerificationToken,
  createPasswordResetToken,
  createRefreshToken,
  getAdminUserById,
  getAdminUserByIdentifier,
  getAdminUsers,
  getEmailVerificationTokenByHash,
  getPasswordResetTokenByHash,
  getRefreshTokenByHash,
  invalidateEmailVerificationTokensForUser,
  invalidatePasswordResetTokensForUser,
  markAdminUserEmailVerified,
  revokeAllRefreshTokensForUser,
  revokeRefreshToken,
  updateAdminUserLastLogin,
  updateAdminUserPassword
} from "@/repositories/auth-repository";

interface AccessTokenPayload {
  sub: string;
  username: string;
  email: string;
  role: "super-admin" | "editor";
  typ: "access";
  exp: number;
}

interface RequestMetadata {
  userAgent: string | null;
  ipAddress: string | null;
}

interface AuthCookies {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getNumericEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }

  return parsed;
}

function getAccessTokenTtlSeconds(): number {
  return getNumericEnv("ADMIN_ACCESS_TOKEN_TTL_SECONDS", 900);
}

function getRefreshTokenTtlSeconds(): number {
  return getNumericEnv("ADMIN_REFRESH_TOKEN_TTL_SECONDS", 60 * 60 * 24 * 7);
}

function getVerificationTokenTtlSeconds(): number {
  return getNumericEnv("ADMIN_EMAIL_VERIFICATION_TOKEN_TTL_SECONDS", 60 * 60 * 24);
}

function getPasswordResetTokenTtlSeconds(): number {
  return getNumericEnv("ADMIN_PASSWORD_RESET_TOKEN_TTL_SECONDS", 60 * 30);
}

function getDefaultAdminLanguage(): "en" | "fr" {
  return process.env.ADMIN_DEFAULT_LANG === "fr" ? "fr" : "en";
}

function getAuthSecret(): string {
  return getRequiredEnv("ADMIN_AUTH_SECRET");
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (normalized.length % 4 || 4)) % 4;
  return Buffer.from(`${normalized}${"=".repeat(padding)}`, "base64").toString("utf8");
}

function signAccessToken(payload: AccessTokenPayload): string {
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", getAuthSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyAccessToken(token: string): AccessTokenPayload | null {
  const [encodedHeader, encodedPayload, signature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getAuthSecret())
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AccessTokenPayload;
    if (payload.typ !== "access" || payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createOpaqueToken(): string {
  return randomBytes(48).toString("hex");
}

function buildAccessToken(session: Omit<AdminSession, "expiresAt">): { token: string; expiresAt: string } {
  const expiresAt = new Date(Date.now() + getAccessTokenTtlSeconds() * 1000).toISOString();
  return {
    token: signAccessToken({
      sub: session.userId,
      username: session.username,
      email: session.email,
      role: session.role,
      typ: "access",
      exp: Math.floor(new Date(expiresAt).getTime() / 1000)
    }),
    expiresAt
  };
}

async function getRequestMetadata(): Promise<RequestMetadata> {
  const headerStore = await headers();
  return {
    userAgent: headerStore.get("user-agent"),
    ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null
  };
}

async function issueRefreshToken(session: Omit<AdminSession, "expiresAt">, metadata: RequestMetadata): Promise<{ token: string; expiresAt: string; id: string }> {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + getRefreshTokenTtlSeconds() * 1000).toISOString();
  const id = randomUUID();
  await createRefreshToken({
    id,
    userId: session.userId,
    tokenHash: hashOpaqueToken(token),
    expiresAt,
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress
  });
  return { token, expiresAt, id };
}

function getCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds
  };
}

async function setAuthCookies(tokens: AuthCookies): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_ACCESS_COOKIE_NAME, tokens.accessToken, getCookieOptions(getAccessTokenTtlSeconds()));
  cookieStore.set(ADMIN_REFRESH_COOKIE_NAME, tokens.refreshToken, getCookieOptions(getRefreshTokenTtlSeconds()));
}

export async function clearAdminSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_ACCESS_COOKIE_NAME);
  cookieStore.delete(ADMIN_REFRESH_COOKIE_NAME);
}

function toAdminSession(payload: AccessTokenPayload): AdminSession {
  return {
    userId: payload.sub,
    username: payload.username,
    email: payload.email,
    role: payload.role,
    expiresAt: new Date(payload.exp * 1000).toISOString()
  };
}

async function issueSessionCookies(session: Omit<AdminSession, "expiresAt">, metadata: RequestMetadata): Promise<AdminSession> {
  const access = buildAccessToken(session);
  const refresh = await issueRefreshToken(session, metadata);
  await setAuthCookies({
    accessToken: access.token,
    refreshToken: refresh.token,
    accessExpiresAt: access.expiresAt,
    refreshExpiresAt: refresh.expiresAt
  });

  return {
    ...session,
    expiresAt: access.expiresAt
  };
}

async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: getRequiredEnv("GMAIL_USER"),
      pass: getRequiredEnv("GMAIL_APP_PASSWORD")
    }
  });

  await transporter.sendMail({
    from: process.env.AUTH_EMAIL_FROM ?? getRequiredEnv("GMAIL_USER"),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html
  });
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, storedHash] = passwordHash.split(":");
  if (!salt || !storedHash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");
  return storedHashBuffer.length === derivedHash.length && timingSafeEqual(storedHashBuffer, derivedHash);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(ADMIN_ACCESS_COOKIE_NAME)?.value;
  if (!accessCookie) {
    return null;
  }

  const payload = verifyAccessToken(accessCookie);
  return payload ? toAdminSession(payload) : null;
}

export async function getAdminSessionResponse(): Promise<NextResponse> {
  const existingSession = await getAdminSession();
  if (existingSession) {
    return NextResponse.json({ session: existingSession });
  }

  const refreshedSession = await refreshAdminSession();
  if (!refreshedSession) {
    await clearAdminSessionCookies();
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ session: refreshedSession });
}

export async function refreshAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(ADMIN_REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  const storedToken = await getRefreshTokenByHash(hashOpaqueToken(refreshToken));
  if (!storedToken || storedToken.revokedAt || new Date(storedToken.expiresAt).getTime() <= Date.now()) {
    return null;
  }

  const adminUser = await getAdminUserById(storedToken.userId);
  if (!adminUser || adminUser.status !== "active" || !adminUser.emailVerifiedAt) {
    return null;
  }

  const metadata = await getRequestMetadata();
  const access = buildAccessToken({
    userId: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role
  });
  const nextRefresh = await issueRefreshToken(
    {
      userId: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    },
    metadata
  );

  await revokeRefreshToken(storedToken.id, nextRefresh.id);
  await setAuthCookies({
    accessToken: access.token,
    refreshToken: nextRefresh.token,
    accessExpiresAt: access.expiresAt,
    refreshExpiresAt: nextRefresh.expiresAt
  });

  return {
    userId: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
    expiresAt: access.expiresAt
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getAdminUnauthorizedResponse(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (session) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function loginAdmin(identifier: string, password: string): Promise<AdminSession> {
  const adminUser = await getAdminUserByIdentifier(identifier.trim());
  if (!adminUser || adminUser.status !== "active" || !verifyPassword(password, adminUser.passwordHash)) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!adminUser.emailVerifiedAt) {
    await sendAdminVerificationEmail(adminUser.email);
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  const metadata = await getRequestMetadata();
  const session = await issueSessionCookies(
    {
      userId: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    },
    metadata
  );

  await updateAdminUserLastLogin(adminUser.id);
  return session;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(ADMIN_REFRESH_COOKIE_NAME)?.value;
  if (refreshToken) {
    const storedToken = await getRefreshTokenByHash(hashOpaqueToken(refreshToken));
    if (storedToken && !storedToken.revokedAt) {
      await revokeRefreshToken(storedToken.id);
    }
  }

  await clearAdminSessionCookies();
}

export async function sendAdminVerificationEmail(identifier: string): Promise<void> {
  const adminUser = await getAdminUserByIdentifier(identifier.trim());
  if (!adminUser || adminUser.status !== "active") {
    return;
  }

  if (adminUser.emailVerifiedAt) {
    return;
  }

  await invalidateEmailVerificationTokensForUser(adminUser.id);
  const rawToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + getVerificationTokenTtlSeconds() * 1000).toISOString();
  await createEmailVerificationToken({
    id: randomUUID(),
    userId: adminUser.id,
    tokenHash: hashOpaqueToken(rawToken),
    expiresAt
  });

  const verificationUrl = `${SITE_URL}/${getDefaultAdminLanguage()}/admin/verify-email?token=${encodeURIComponent(rawToken)}`;
  await sendEmail({
    to: adminUser.email,
    subject: "Verify your admin email",
    text: `Verify your admin account by opening this link: ${verificationUrl}`,
    html: `<p>Verify your admin account by clicking the link below.</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`
  });
}

export async function verifyAdminEmail(token: string): Promise<void> {
  const storedToken = await getEmailVerificationTokenByHash(hashOpaqueToken(token));
  if (!storedToken || storedToken.consumedAt || new Date(storedToken.expiresAt).getTime() <= Date.now()) {
    throw new Error("INVALID_TOKEN");
  }

  await markAdminUserEmailVerified(storedToken.userId);
  await consumeEmailVerificationToken(storedToken.id);
  await invalidateEmailVerificationTokensForUser(storedToken.userId);
}

export async function sendAdminPasswordResetEmail(identifier: string): Promise<void> {
  const adminUser = await getAdminUserByIdentifier(identifier.trim());
  if (!adminUser || adminUser.status !== "active") {
    return;
  }

  await invalidatePasswordResetTokensForUser(adminUser.id);
  const rawToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + getPasswordResetTokenTtlSeconds() * 1000).toISOString();
  await createPasswordResetToken({
    id: randomUUID(),
    userId: adminUser.id,
    tokenHash: hashOpaqueToken(rawToken),
    expiresAt
  });

  const resetUrl = `${SITE_URL}/${getDefaultAdminLanguage()}/admin/reset-password?token=${encodeURIComponent(rawToken)}`;
  await sendEmail({
    to: adminUser.email,
    subject: "Reset your admin password",
    text: `Reset your admin password by opening this link: ${resetUrl}`,
    html: `<p>Reset your admin password by clicking the link below.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
}

export async function resetAdminPassword(token: string, newPassword: string): Promise<void> {
  const storedToken = await getPasswordResetTokenByHash(hashOpaqueToken(token));
  if (!storedToken || storedToken.consumedAt || new Date(storedToken.expiresAt).getTime() <= Date.now()) {
    throw new Error("INVALID_TOKEN");
  }

  await updateAdminUserPassword(storedToken.userId, hashPassword(newPassword));
  await consumePasswordResetToken(storedToken.id);
  await invalidatePasswordResetTokensForUser(storedToken.userId);
  await revokeAllRefreshTokensForUser(storedToken.userId);
  await clearAdminSessionCookies();
}

export async function getAdminUsersForDashboard() {
  return getAdminUsers();
}
