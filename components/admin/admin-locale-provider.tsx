"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

export type AdminLocale = "en" | "fr";

interface AdminLocaleContextValue {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  adminBasePath: string;
}

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAdminLocale() {
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const locale: AdminLocale = params?.lang === "fr" ? "fr" : "en";

  return useMemo<AdminLocaleContextValue>(() => ({
    locale,
    adminBasePath: `/${locale}/admin`,
    setLocale(nextLocale) {
      if (nextLocale === locale) {
        return;
      }

      const nextPath = pathname.startsWith(`/${locale}/`)
        ? `/${nextLocale}${pathname.slice(locale.length + 1)}`
        : pathname === `/${locale}`
          ? `/${nextLocale}`
          : `/${nextLocale}/admin`;

      router.replace(nextPath);
    }
  }), [locale, pathname, router]);
}
