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
  const siteSettings = await getAdminSiteSettings();
  const translation = siteSettings.translations?.[languageCode] ?? siteSettings.translations?.en ?? {
    siteTitle: "Djiotsa Christian",
    siteDescription: "Portfolio",
    defaultSeoTitle: "Djiotsa Christian",
    defaultSeoDescription: "Portfolio"
  };

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
