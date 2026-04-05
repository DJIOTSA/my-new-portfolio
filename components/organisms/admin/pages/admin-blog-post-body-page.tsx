"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, Languages, Save } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { TiptapEditor } from "@/components/organisms/blog/tiptap-editor";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { blogPostSchema } from "@/db/validation/blog-post";
import type { BlogPostEntity, BlogPostTranslation } from "@/lib/types";

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface AdminBlogData {
  posts: BlogPostEntity[];
}

type EditingLanguage = "en" | "fr";

function normalizeTranslation(
  translation: Partial<BlogPostTranslation> | undefined,
  language: EditingLanguage
): BlogPostTranslation {
  return {
    title: translation?.title ?? "",
    slug: translation?.slug ?? "",
    excerpt: translation?.excerpt ?? "",
    contentJson: translation?.contentJson ?? "{\"type\":\"doc\",\"content\":[]}",
    contentHtml: translation?.contentHtml ?? "",
    seoTitle: translation?.seoTitle ?? "",
    seoDescription: translation?.seoDescription ?? "",
    canonicalUrl: translation?.canonicalUrl ?? (language === "fr" ? "https://djiotsa.vercel.app/fr/blog" : "https://djiotsa.vercel.app/en/blog"),
    courseCtaTitle: translation?.courseCtaTitle ?? "",
    courseCtaDescription: translation?.courseCtaDescription ?? "",
    courseCtaLabel: translation?.courseCtaLabel ?? "",
    courseCtaUrl: translation?.courseCtaUrl ?? "https://djiotsa.vercel.app",
    socialShareTitle: translation?.socialShareTitle ?? "",
    socialShareDescription: translation?.socialShareDescription ?? ""
  };
}

function buildPayload(
  post: BlogPostEntity,
  language: EditingLanguage,
  content: { html: string; json: string }
): BlogPostFormValues {
  const translations = {
    en: normalizeTranslation(post.translations.en, "en"),
    fr: normalizeTranslation(post.translations.fr, "fr")
  };

  translations[language] = {
    ...translations[language],
    contentHtml: content.html,
    contentJson: content.json
  };

  return {
    ...post,
    tags: (post.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    resources: (post.resources ?? [])
      .map((resource) => ({
        label: (resource.label ?? "").trim(),
        url: (resource.url ?? "").trim(),
        type: resource.type?.trim() || undefined
      }))
      .filter((resource) => resource.label && resource.url),
    relatedPostIds: (post.relatedPostIds ?? []).map((related) => related.trim()).filter(Boolean),
    socialPublishing: post.socialPublishing ?? {},
    translations
  };
}

export function AdminBlogPostBodyPage({
  postId,
  language
}: {
  postId: string;
  language: EditingLanguage;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { locale, adminBasePath } = useAdminLocale();
  const { data, isLoading } = useAdminQuery<AdminBlogData>(queryKeys.blogPosts, "/api/admin/blog/posts");
  const existingPost = useMemo(
    () => data?.posts.find((entry) => entry.id === postId) ?? null,
    [data?.posts, postId]
  );
  const currentTranslation = useMemo(
    () => normalizeTranslation(existingPost?.translations?.[language], language),
    [existingPost, language]
  );
  const [contentHtml, setContentHtml] = useState(currentTranslation.contentHtml);
  const [contentJson, setContentJson] = useState(currentTranslation.contentJson);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContentHtml(currentTranslation.contentHtml);
    setContentJson(currentTranslation.contentJson);
  }, [currentTranslation.contentHtml, currentTranslation.contentJson]);

  async function handleSave() {
    if (!existingPost) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload(existingPost, language, { html: contentHtml, json: contentJson });

      await adminFetch("/api/admin/blog/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
      router.replace(`${adminBasePath}/blog/${payload.id}`);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500">Loading body editor...</p>;
  }

  if (!existingPost) {
    return <p className="text-sm text-gray-500">Post not found.</p>;
  }

  const otherLanguage: EditingLanguage = language === "en" ? "fr" : "en";
  const switchHref = `${adminBasePath}/blog/${postId}/body/${otherLanguage}`;
  const postTitle = currentTranslation.title || existingPost.translations.en?.title || existingPost.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`${adminBasePath}/blog/${postId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === "fr" ? "Retour a l'article" : "Back to post"}
            </Link>
          </Button>
          <Badge variant={existingPost.status === "published" ? "success" : "secondary"}>
            {existingPost.status}
          </Badge>
          <span className="text-sm text-gray-600">
            {locale === "fr" ? "Edition plein ecran du corps" : "Full-page body editing"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={switchHref}>
              <Languages className="mr-2 h-4 w-4" />
              {locale === "fr" ? "Basculer vers" : "Switch to"} {otherLanguage === "en" ? "English" : "Francais"}
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? (locale === "fr" ? "Enregistrement..." : "Saving...") : locale === "fr" ? "Enregistrer" : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            <span>{postTitle}</span>
            <Badge variant="outline">{language === "en" ? "English" : "French"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {locale === "fr"
              ? "Utilisez le panneau lateral pour garder les outils de style visibles pendant que vous ecrivez."
              : "Use the side rail to keep styling tools visible while you write."}
          </p>
          <TiptapEditor
            layout="sidebar"
            contentHtml={contentHtml}
            contentJson={contentJson}
            onChange={({ html, json }) => {
              setContentHtml(html);
              setContentJson(json);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminBlogPostBodyPageWrapper({
  params
}: {
  params: { postId: string; language: string };
}) {
  const { postId, language } = params;

  const normalizedLanguage: EditingLanguage = language === "fr" ? "fr" : "en";

  return <AdminBlogPostBodyPage postId={postId} language={normalizedLanguage} />;
}
