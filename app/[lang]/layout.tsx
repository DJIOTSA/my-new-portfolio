import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import type { LanguageCode } from "@/lib/types";
import { getAdminSiteSettings } from "@/services/blog-service";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const languageCode: LanguageCode = lang === "fr" ? "fr" : "en";
  const fallbackTranslation = {
    siteTitle: "Djiotsa Christian",
    siteDescription: "Portfolio",
    defaultSeoTitle: "Djiotsa Christian",
    defaultSeoDescription: "Portfolio"
  };
  let translation = fallbackTranslation;

  try {
    const siteSettings = await getAdminSiteSettings();
    translation = siteSettings.translations?.[languageCode] ?? siteSettings.translations?.en ?? fallbackTranslation;
  } catch (error) {
    console.error("layout metadata failed to load site settings", error);
  }

  return buildPageMetadata({
    title: translation.defaultSeoTitle,
    description: translation.defaultSeoDescription,
    pathname: `/${lang}`,
    locale: languageCode,
    alternates: {
      en: "/en",
      fr: "/fr"
    }
  });
}

export default async function LanguageLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "fr") {
    notFound();
  }

  return children;
}
