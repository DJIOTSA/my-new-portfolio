import type { Metadata } from "next";
import Link from "next/link";
import { BlogLocaleSwitcher } from "@/components/molecules/blog-locale-switcher";
import { buildPageMetadata } from "@/lib/seo";
import { getBlogListing } from "@/services/blog-service";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return buildPageMetadata({
    title: "Blog | Djiotsa Christian",
    description: "Technical articles on data science, software engineering, MLOps, and product systems.",
    pathname: `/${lang}/blog`,
    locale: lang,
    alternates: {
      en: "/en/blog",
      fr: "/fr/blog"
    }
  });
}

export default async function BlogListingPage({
  params,
  searchParams
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const { lang } = await params;
  const { category, tag } = await searchParams;
  const listing = await getBlogListing(lang, { categorySlug: category, tagSlug: tag });

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href={`/${lang}`} className="text-blue-700 font-medium">
              Back to portfolio
            </Link>
            <BlogLocaleSwitcher currentLocale={lang as "en" | "fr"} />
          </div>
          <h1 className="mt-6 text-4xl lg:text-5xl font-bold text-gray-900">Blog</h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl">
            Multilingual technical writing on data science, software engineering, AI integration, and product systems.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[280px_1fr] gap-12">
        <aside className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {listing.categories.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/${lang}/blog?category=${entry.slug}`}
                  className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full"
                >
                  {entry.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/${lang}/blog?tag=${entry.slug}`}
                  className="text-sm font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-full"
                >
                  #{entry.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
        <section className="space-y-8">
          {listing.posts.map((post) => (
            <article key={post.id} className="bg-gray-50 rounded-lg p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{post.category.name}</span>
                <span className="text-sm text-gray-500">{post.readingTime} min read</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                <Link href={`/${lang}/blog/${post.slug}`} className="hover:text-blue-700 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.resolvedTags.map((entry) => (
                  <span key={entry.id} className="text-xs font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                    {entry.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.author.name}</span>
                <Link href={`/${lang}/blog/${post.slug}`} className="text-blue-700 font-medium">
                  Read article
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
