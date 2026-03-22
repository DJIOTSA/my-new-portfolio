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
  username: string;
  role: "super-admin" | "editor";
  expiresAt: string;
}

export interface AdminUserEntity {
  id: string;
  username: string;
  passwordHash: string;
  role: "super-admin" | "editor";
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
}
