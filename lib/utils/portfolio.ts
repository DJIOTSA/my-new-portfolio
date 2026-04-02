import type { LanguageCode } from "@/lib/types";

function getFirstAvailableTranslation<T extends object>(
  translations: Partial<Record<LanguageCode, T>> | undefined
): { language: LanguageCode; value: T } | null {
  if (!translations) {
    return null;
  }

  for (const language of ["en", "fr"] as const) {
    const value = translations[language];
    if (value) {
      return { language, value };
    }
  }

  return null;
}

export function resolveLocalizedValue<T extends object>(
  translations: Partial<Record<LanguageCode, T>> | undefined,
  requestedLanguage: LanguageCode,
  defaultLanguage: LanguageCode
): { value: T; effectiveLanguage: LanguageCode; isFallback: boolean } {
  if (!translations) {
    throw new Error("Entity is missing the translations object.");
  }

  const localizedValue = translations[requestedLanguage];
  if (localizedValue) {
    return {
      value: localizedValue,
      effectiveLanguage: requestedLanguage,
      isFallback: false
    };
  }

  const fallbackValue = translations[defaultLanguage];
  if (!fallbackValue) {
    const firstAvailableTranslation = getFirstAvailableTranslation(translations);
    if (!firstAvailableTranslation) {
      throw new Error(`Entity is missing translations for all supported languages.`);
    }

    return {
      value: firstAvailableTranslation.value,
      effectiveLanguage: firstAvailableTranslation.language,
      isFallback: true
    };
  }

  return {
    value: fallbackValue,
    effectiveLanguage: defaultLanguage,
    isFallback: true
  };
}
