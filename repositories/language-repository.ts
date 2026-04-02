import { ensureDatabase } from "@/db/init";
import { insertRows, selectRows } from "@/db/supabase-rest";
import type { LanguageCode, LanguageEntity } from "@/lib/types";

function mapLanguage(row: {
  id: string;
  code: LanguageCode;
  name: string;
  native_name: string;
  enabled: boolean;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}): LanguageEntity {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nativeName: row.native_name,
    enabled: row.enabled,
    isDefault: row.is_default,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function getLanguages(): Promise<LanguageEntity[]> {
  await ensureDatabase();
  const rows = await selectRows<{
    id: string;
    code: LanguageCode;
    name: string;
    native_name: string;
    enabled: boolean;
    is_default: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  }>("languages", { orderBy: { column: "sort_order", ascending: true } });
  return rows.map(mapLanguage);
}

export async function getDefaultLanguage(): Promise<LanguageEntity> {
  const languages = await getLanguages();
  const language = languages.find((entry) => entry.isDefault);
  if (!language) {
    if (languages[0]) {
      return languages[0];
    }
    throw new Error("No language records configured. Run `pnpm db:setup` first.");
  }

  return language;
}

export async function resolveRequestedLanguage(requestedLanguage: string | undefined): Promise<{
  requestedLanguage: LanguageCode;
  effectiveRequestedLanguage: LanguageCode;
  defaultLanguage: LanguageCode;
}> {
  const languages = await getLanguages();
  const defaultLanguage = languages.find((entry) => entry.isDefault)?.code ?? "en";
  const requested = requestedLanguage === "fr" ? "fr" : "en";
  const requestedLanguageEntity = languages.find((entry) => entry.code === requested && entry.enabled);

  return {
    requestedLanguage: requested,
    effectiveRequestedLanguage: requestedLanguageEntity?.code ?? defaultLanguage,
    defaultLanguage
  };
}

export async function upsertLanguages(languages: LanguageEntity[]): Promise<void> {
  await ensureDatabase();
  await insertRows("languages", languages.map((language) => ({
    id: language.id,
    code: language.code,
    name: language.name,
    native_name: language.nativeName,
    enabled: language.enabled,
    is_default: language.isDefault,
    sort_order: language.sortOrder,
    created_at: language.createdAt,
    updated_at: language.updatedAt
  })), { onConflict: "id", upsert: true, returning: "minimal" });
}
