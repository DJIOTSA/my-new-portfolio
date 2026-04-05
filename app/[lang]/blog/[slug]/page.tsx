import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogLocaleSwitcher } from "@/components/molecules/blog-locale-switcher";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { BlogBackButton } from "@/components/molecules/blog-back-button";
import { getBlogPostBySlug } from "@/services/blog-service";

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getBlogPostBySlug(lang, slug);
  if (!post) {
    return {};
  }

  const slugByLocale = post.slugByLocale ?? {};
  const currentSlug = slugByLocale[lang as "en" | "fr"] ?? post.slug;

  return buildPageMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    pathname: `/${lang}/blog/${currentSlug}`,
    locale: lang,
    ogImage: undefined,
    alternates: {
      en: `/en/blog/${slugByLocale.en ?? currentSlug}`,
      fr: `/fr/blog/${slugByLocale.fr ?? currentSlug}`
    }
  });
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = await getBlogPostBySlug(lang, slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BlogBackButton
              href={`/${lang}/blog`}
              className="rounded-full border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
            />
            <BlogLocaleSwitcher currentLocale={lang as "en" | "fr"} slugByLocale={post.slugByLocale} />
          </div>
          <span className="mt-8 inline-flex text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {post.category.name}
          </span>
          <h1 className="mt-6 text-4xl lg:text-5xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-4 text-xl text-gray-600">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{post.author.name}</span>
            <span>{post.readingTime} min read</span>
            <span>{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</span>
          </div>
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="blog-content max-w-none" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        <div className="mt-10 flex justify-start">
          <BlogBackButton href={`/${lang}/blog`} />
        </div>
        <div className="mt-12 rounded-2xl bg-gray-50 p-8">
          <h2 className="text-2xl font-bold text-gray-900">{post.courseCtaTitle}</h2>
          <p className="mt-3 text-gray-600">{post.courseCtaDescription}</p>
          <a
            href={post.courseCtaUrl}
            className="mt-6 inline-flex bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
          >
            {post.courseCtaLabel}
          </a>
        </div>
        {post.relatedPosts.length ? (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {post.relatedPosts.map((entry) => (
                <Link key={entry.id} href={`/${lang}/blog/${entry.slug}`} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{entry.title}</h3>
                  <p className="text-gray-600">{entry.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-12 flex justify-center border-t border-gray-100 pt-8">
          <BlogBackButton
            href={`/${lang}/blog`}
            label="Back to blog listing"
            className="min-w-52"
          />
        </div>
      </article>
    </main>
  );
}
