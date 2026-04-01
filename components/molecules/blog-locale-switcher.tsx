"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LocaleSwitcher } from "@/components/molecules/locale-switcher";

interface BlogLocaleSwitcherProps {
  currentLocale: "en" | "fr";
  className?: string;
  variant?: "default" | "compact";
}

export function BlogLocaleSwitcher({
  currentLocale,
  className,
  variant = "default"
}: BlogLocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLanguage = (nextLocale: "en" | "fr") => {
    if (nextLocale === currentLocale) {
      return;
    }

    const nextPath = pathname.startsWith(`/${currentLocale}/`)
      ? `/${nextLocale}${pathname.slice(currentLocale.length + 1)}`
      : pathname === `/${currentLocale}`
        ? `/${nextLocale}`
        : `/${nextLocale}/blog`;
    const queryString = searchParams.toString();
    const hash = typeof window === "undefined" ? "" : window.location.hash;

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
