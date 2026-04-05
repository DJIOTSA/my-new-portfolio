"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LocaleSwitcher, type LocaleOption } from "@/components/molecules/locale-switcher";

interface BlogLocaleSwitcherProps {
  currentLocale: LocaleOption;
  slugByLocale?: Partial<Record<LocaleOption, string>>;
  className?: string;
  variant?: "default" | "compact";
}

export function BlogLocaleSwitcher({
  currentLocale,
  slugByLocale,
  className,
  variant = "default"
}: BlogLocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLanguage = (nextLocale: LocaleOption) => {
    if (nextLocale === currentLocale) {
      return;
    }

    const queryString = searchParams.toString();
    const hash = typeof window === "undefined" ? "" : window.location.hash;
    const isBlogDetailPath = pathname.startsWith(`/${currentLocale}/blog/`);
    const localizedSlug = slugByLocale?.[nextLocale];

    const nextPath = localizedSlug && isBlogDetailPath
      ? `/${nextLocale}/blog/${localizedSlug}`
      : pathname.startsWith(`/${currentLocale}/`)
        ? `/${nextLocale}${pathname.slice(currentLocale.length + 1)}`
        : pathname === `/${currentLocale}`
          ? `/${nextLocale}`
          : `/${nextLocale}/blog`;

    router.replace(`${nextPath}${queryString ? `?${queryString}` : ""}${hash}`);
  };

  return (
    <LocaleSwitcher
      currentLocale={currentLocale}
      onChange={switchLanguage}
      className={className}
      variant={variant}
    />
  );
}
