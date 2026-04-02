import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export function buildCanonical(pathname: string): string {
  return `${SITE_URL}${pathname}`;
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  pathname: string;
  locale: string;
  alternates?: Record<string, string>;
  ogImage?: string;
}): Metadata {
  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: buildCanonical(options.pathname),
      languages: options.alternates
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: buildCanonical(options.pathname),
      locale: options.locale,
      images: options.ogImage ? [{ url: options.ogImage }] : undefined,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: options.ogImage ? [options.ogImage] : undefined
    }
  };
}
