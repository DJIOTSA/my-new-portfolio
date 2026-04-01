"use client";

import { Globe } from "lucide-react";

export type LocaleOption = "en" | "fr";

interface LocaleSwitcherProps {
  currentLocale: LocaleOption;
  onChange: (locale: LocaleOption) => void;
  className?: string;
  variant?: "default" | "compact";
}

const labels: Record<LocaleOption, string> = {
  en: "EN",
  fr: "FR"
};

export function LocaleSwitcher({
  currentLocale,
  onChange,
  className,
  variant = "default"
}: LocaleSwitcherProps) {
  const containerClassName = variant === "compact"
    ? "inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 p-1"
    : "inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1";
  const iconClassName = variant === "compact" ? "text-white/80" : "text-gray-500";

  return (
    <div className={`${containerClassName} ${className ?? ""}`.trim()}>
      <Globe className={`h-4 w-4 ${iconClassName}`} />
      {(["en", "fr"] as const).map((locale) => {
        const active = locale === currentLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              active
                ? variant === "compact"
                  ? "bg-white text-blue-700"
                  : "bg-blue-700 text-white"
                : variant === "compact"
                  ? "text-white/85 hover:bg-white/10"
                  : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {labels[locale]}
          </button>
        );
      })}
    </div>
  );
}
