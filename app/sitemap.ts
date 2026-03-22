import type { MetadataRoute } from "next";
import { getBlogListing } from "@/services/blog-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const baseEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/en`, lastModified: new Date() },
    { url: `${siteUrl}/fr`, lastModified: new Date() },
    { url: `${siteUrl}/en/blog`, lastModified: new Date() },
    { url: `${siteUrl}/fr/blog`, lastModified: new Date() }
  ];

  try {
    const listing = await getBlogListing("en");

    return [
      ...baseEntries,
      ...listing.posts.flatMap((post) => [
        { url: `${siteUrl}/en/blog/${post.slug}`, lastModified: new Date(post.updatedAt) },
        { url: `${siteUrl}/fr/blog/${post.slug}`, lastModified: new Date(post.updatedAt) }
      ])
    ];
  } catch {
    return baseEntries;
  }
}
