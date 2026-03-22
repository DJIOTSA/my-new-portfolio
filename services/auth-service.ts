import { cookies } from "next/headers";
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { ADMIN_COOKIE_NAME } from "@/lib/constants";
import type { AdminSession } from "@/lib/types";
import { getAdminUserByUsername, getAdminUsers } from "@/repositories/auth-repository";

function signSession(username: string, expiresAt: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "change-me";
  return createHash("sha256").update(`${username}:${expiresAt}:${secret}`).digest("hex");
}

export async function createAdminSession(username: string): Promise<void> {
  const adminUser = await getAdminUserByUsername(username);
  if (!adminUser) {
    throw new Error("Admin user not found.");
  }

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
  const payload = JSON.stringify({
    username,
    role: adminUser.role,
    expiresAt,
    signature: signSession(username, expiresAt)
  });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, Buffer.from(payload).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!cookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cookie.value, "base64").toString("utf8")) as {
      username: string;
      role: "super-admin" | "editor";
      expiresAt: string;
      signature: string;
    };

    if (parsed.signature !== signSession(parsed.username, parsed.expiresAt)) {
      return null;
    }

    if (new Date(parsed.expiresAt).getTime() < Date.now()) {
      return null;
    }

    return {
      username: parsed.username,
      role: parsed.role,
      expiresAt: parsed.expiresAt
    };
  } catch {
    return null;
  }
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

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  const adminUser = await getAdminUserByUsername(username);
  if (!adminUser || adminUser.status !== "active") {
    return false;
  }

  return verifyPassword(password, adminUser.passwordHash);
}

export async function getAdminUsersForDashboard() {
  return getAdminUsers();
}
