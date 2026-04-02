export type LanguageCode = "en" | "fr";

export interface LanguageEntity {
  id: string;
  code: LanguageCode;
  name: string;
  nativeName: string;
  enabled: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedResponseMeta {
  requestedLanguage: LanguageCode;
  effectiveLanguage: LanguageCode;
  isFallback: boolean;
}

export interface AdminSession {
  userId: string;
  username: string;
  email: string;
  role: "super-admin" | "editor";
  expiresAt: string;
}

export interface AdminUserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "super-admin" | "editor";
  status: "active" | "disabled";
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt: string | null;
  replacedByTokenId: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthOneTimeTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  consumedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
