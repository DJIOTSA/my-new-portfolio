"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ChevronsUpDown, Maximize2, Plus, Save } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { TiptapEditor } from "@/components/organisms/blog/tiptap-editor";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { blogPostSchema } from "@/db/validation/blog-post";
import type { BlogAuthorEntity, BlogCategoryEntity, BlogPostEntity, BlogTagEntity } from "@/lib/types";

interface AdminBlogData {
  posts: BlogPostEntity[];
  categories: BlogCategoryEntity[];
  tags: BlogTagEntity[];
  authors: BlogAuthorEntity[];
}

type BlogPostFormValues = z.infer<typeof blogPostSchema>;
type StringFieldItem = { value: string };
const stringFieldItemSchema = z.object({ value: z.string() });
const editorBlogPostSchema = blogPostSchema.extend({
  tagsFieldArray: z.array(stringFieldItemSchema),
  relatedPostsFieldArray: z.array(stringFieldItemSchema)
});

interface BlogPostEditorProps {
  postId?: string;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry : String(entry ?? "")))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeResourcesArray(value: unknown): BlogPostFormValues["resources"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const resource = entry as { label?: unknown; url?: unknown; type?: unknown };
    return [{
      label: typeof resource.label === "string" ? resource.label : "",
      url: typeof resource.url === "string" ? resource.url : "",
      type: typeof resource.type === "string" ? resource.type : undefined
    }];
  });
}

function toFieldArray(values: string[]): StringFieldItem[] {
  return values.map((value) => ({ value }));
}

function fromFieldArray(values: StringFieldItem[]): string[] {
  return values.map((entry) => entry.value.trim()).filter(Boolean);
}

function mapPostToFormValues(post: BlogPostEntity): BlogPostFormValues & {
  tagsFieldArray: StringFieldItem[];
  relatedPostsFieldArray: StringFieldItem[];
} {
  const en = post.translations.en;
  const fr = post.translations.fr;

  return {
    id: post.id,
    authorId: post.authorId,
    categoryId: post.categoryId,
    status: post.status,
    featured: post.featured,
    publishedAt: post.publishedAt,
    scheduledAt: post.scheduledAt,
    coverMediaId: post.coverMediaId,
    ogImageMediaId: post.ogImageMediaId,
    readingTime: post.readingTime,
    difficulty: post.difficulty,
    tags: normalizeStringArray(post.tags),
    tagsFieldArray: toFieldArray(normalizeStringArray(post.tags)),
    resources: normalizeResourcesArray(post.resources),
    relatedPostIds: normalizeStringArray(post.relatedPostIds),
    relatedPostsFieldArray: toFieldArray(normalizeStringArray(post.relatedPostIds)),
    socialPublishing: post.socialPublishing,
    translations: {
      en: {
        title: en?.title ?? "",
        slug: en?.slug ?? "",
        excerpt: en?.excerpt ?? "",
        contentJson: en?.contentJson ?? "",
        contentHtml: en?.contentHtml ?? "",
        seoTitle: en?.seoTitle ?? "",
        seoDescription: en?.seoDescription ?? "",
        canonicalUrl: en?.canonicalUrl ?? "https://djiotsa.vercel.app/en/blog",
        courseCtaTitle: en?.courseCtaTitle ?? "",
        courseCtaDescription: en?.courseCtaDescription ?? "",
        courseCtaLabel: en?.courseCtaLabel ?? "",
        courseCtaUrl: en?.courseCtaUrl ?? "https://djiotsa.vercel.app",
        socialShareTitle: en?.socialShareTitle ?? "",
        socialShareDescription: en?.socialShareDescription ?? ""
      },
      fr: {
        title: fr?.title ?? "",
        slug: fr?.slug ?? "",
        excerpt: fr?.excerpt ?? "",
        contentJson: fr?.contentJson ?? "",
        contentHtml: fr?.contentHtml ?? "",
        seoTitle: fr?.seoTitle ?? "",
        seoDescription: fr?.seoDescription ?? "",
        canonicalUrl: fr?.canonicalUrl ?? "https://djiotsa.vercel.app/fr/blog",
        courseCtaTitle: fr?.courseCtaTitle ?? "",
        courseCtaDescription: fr?.courseCtaDescription ?? "",
        courseCtaLabel: fr?.courseCtaLabel ?? "",
        courseCtaUrl: fr?.courseCtaUrl ?? "https://djiotsa.vercel.app",
        socialShareTitle: fr?.socialShareTitle ?? "",
        socialShareDescription: fr?.socialShareDescription ?? ""
      }
    }
  };
}

function createEmptyPost(authors: BlogAuthorEntity[], categories: BlogCategoryEntity[]) {
  const base: BlogPostFormValues = {
    id: `blog_post_${Date.now()}`,
    authorId: authors[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    status: "draft",
    featured: false,
    publishedAt: null,
    scheduledAt: null,
    coverMediaId: null,
    ogImageMediaId: null,
    readingTime: 5,
    difficulty: "beginner",
    tags: [],
    resources: [],
    relatedPostIds: [],
    socialPublishing: {},
    translations: {
      en: {
        title: "",
        slug: "",
        excerpt: "",
        contentJson: "{\"type\":\"doc\",\"content\":[]}",
        contentHtml: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "https://djiotsa.vercel.app/en/blog",
        courseCtaTitle: "",
        courseCtaDescription: "",
        courseCtaLabel: "",
        courseCtaUrl: "https://djiotsa.vercel.app",
        socialShareTitle: "",
        socialShareDescription: ""
      },
      fr: {
        title: "",
        slug: "",
        excerpt: "",
        contentJson: "{\"type\":\"doc\",\"content\":[]}",
        contentHtml: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "https://djiotsa.vercel.app/fr/blog",
        courseCtaTitle: "",
        courseCtaDescription: "",
        courseCtaLabel: "",
        courseCtaUrl: "https://djiotsa.vercel.app",
        socialShareTitle: "",
        socialShareDescription: ""
      }
    }
  };

  return {
    ...base,
    tagsFieldArray: [] as StringFieldItem[],
    relatedPostsFieldArray: [] as StringFieldItem[]
  };
}

function normalizeNullableString(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeNullableNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numeric) ? numeric : null;
}

export function AdminBlogPostEditor({ postId }: BlogPostEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { locale, adminBasePath } = useAdminLocale();
  const { data } = useAdminQuery<AdminBlogData>(queryKeys.blogPosts, "/api/admin/blog/posts");
  const existingPost = useMemo(
    () => data?.posts.find((entry) => entry.id === postId) ?? null,
    [data?.posts, postId]
  );
  const form = useForm<
    BlogPostFormValues & { tagsFieldArray: StringFieldItem[]; relatedPostsFieldArray: StringFieldItem[] }
  >({
    resolver: zodResolver(editorBlogPostSchema),
    defaultValues: createEmptyPost([], [])
  });
  const relatedSelections = form.watch("relatedPostsFieldArray");
  const [relatedSearchByRow, setRelatedSearchByRow] = useState<Record<string, string>>({});
  const [openRelatedSelector, setOpenRelatedSelector] = useState<string | null>(null);
  const relatedPostOptions = useMemo(
    () =>
      (data?.posts ?? [])
        .filter((post) => !postId || post.id !== postId)
        .map((post) => {
          const title = post.translations.en?.title ?? post.translations.fr?.title ?? post.id;
          const excerpt = post.translations.en?.excerpt ?? post.translations.fr?.excerpt ?? "";
          return {
            id: post.id,
            label: `${title} (${post.id})`,
            searchText: `${title} ${excerpt} ${post.id}`.toLowerCase()
          };
        }),
    [data?.posts, postId]
  );
  const remainingRelatedOptions = useMemo(() => {
    const selectedIds = new Set((relatedSelections ?? []).map((entry) => entry?.value).filter(Boolean));
    return relatedPostOptions.filter((option) => !selectedIds.has(option.id));
  }, [relatedPostOptions, relatedSelections]);
  const isSubmitting = form.formState.isSubmitting;

  const tagsFieldArray = useFieldArray({ control: form.control, name: "tagsFieldArray" });
  const relatedPostsFieldArray = useFieldArray({ control: form.control, name: "relatedPostsFieldArray" });
  const resourcesFieldArray = useFieldArray({ control: form.control, name: "resources" });

  useEffect(() => {
    if (!data) {
      return;
    }

    form.reset(existingPost ? mapPostToFormValues(existingPost) : createEmptyPost(data.authors, data.categories));
  }, [data, existingPost, form]);

  async function handleSubmit(
    values: BlogPostFormValues & { tagsFieldArray: StringFieldItem[]; relatedPostsFieldArray: StringFieldItem[] }
  ) {
    const payload: BlogPostFormValues = {
      ...values,
      publishedAt: normalizeNullableString(values.publishedAt),
      scheduledAt: normalizeNullableString(values.scheduledAt),
      coverMediaId: normalizeNullableNumber(values.coverMediaId),
      ogImageMediaId: normalizeNullableNumber(values.ogImageMediaId),
      tags: fromFieldArray(values.tagsFieldArray),
      relatedPostIds: fromFieldArray(values.relatedPostsFieldArray),
      resources: normalizeResourcesArray(values.resources)
        .map((resource) => ({
          ...resource,
          label: resource.label.trim(),
          url: resource.url.trim(),
          type: resource.type?.trim() || undefined
        }))
        .filter((resource) => resource.label && resource.url)
    };

    await adminFetch("/api/admin/blog/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    await queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
    router.replace(`${adminBasePath}/blog/${payload.id}`);
    router.refresh();
  }

  if (!data) {
    return <p className="text-sm text-gray-500">Loading post editor...</p>;
  }

  if (postId && !existingPost) {
    return <p className="text-sm text-gray-500">Post not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href={`${adminBasePath}/blog`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "fr" ? "Retour a la liste" : "Back to list"}
              </Link>
            </Button>
            <Badge variant={form.watch("status") === "published" ? "success" : "secondary"}>
              {form.watch("status")}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {postId ? (locale === "fr" ? "Modifier l'article" : "Edit Post") : (locale === "fr" ? "Creer un article" : "Create Post")}
          </h1>
          <p className="text-gray-600">
            {locale === "fr"
              ? "Editez les metadonnees, les traductions et le contenu complet sur une interface separee."
              : "Edit metadata, translations, and full article content on a dedicated screen."}
          </p>
        </div>
        <Button type="button" onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? (locale === "fr" ? "Enregistrement..." : "Saving...") : locale === "fr" ? "Enregistrer" : "Save post"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{locale === "fr" ? "Publication" : "Publishing"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value: BlogPostFormValues["status"]) => form.setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Select value={form.watch("authorId")} onValueChange={(value) => form.setValue("authorId", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.translations.en?.name ?? author.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.watch("categoryId")} onValueChange={(value) => form.setValue("categoryId", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.translations.en?.name ?? category.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Reading time</Label>
            <Input type="number" {...form.register("readingTime", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={form.watch("difficulty")}
              onValueChange={(value: BlogPostFormValues["difficulty"]) => form.setValue("difficulty", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 px-3">
              <span className="text-sm font-medium text-gray-700">Featured</span>
              <Switch
                checked={form.watch("featured")}
                onCheckedChange={(value) => form.setValue("featured", value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Published at</Label>
            <Input {...form.register("publishedAt")} placeholder="2026-03-19T10:00:00.000Z" />
          </div>
          <div className="space-y-2">
            <Label>Scheduled at</Label>
            <Input {...form.register("scheduledAt")} placeholder="2026-03-20T10:00:00.000Z" />
          </div>
          <div className="space-y-2 xl:col-span-2">
            <Label>Cover media ID</Label>
            <Input
              type="number"
              min={1}
              step={1}
              {...form.register("coverMediaId", {
                setValueAs: (value) => normalizeNullableNumber(value)
              })}
            />
          </div>
          <div className="space-y-2 xl:col-span-2">
            <Label>OG image media ID</Label>
            <Input
              type="number"
              min={1}
              step={1}
              {...form.register("ogImageMediaId", {
                setValueAs: (value) => normalizeNullableNumber(value)
              })}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="en" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {locale === "fr" ? "Espace de redaction" : "Writing Workspace"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {locale === "fr"
                ? "Le contenu principal se modifie ici, comme dans un traitement de texte."
                : "This is the main content area. Edit the article here like a word processor."}
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="fr">French</TabsTrigger>
          </TabsList>
        </div>

        {(["en", "fr"] as const).map((language) => (
          <TabsContent key={language} value={language}>
            <div className="space-y-4">
              {postId ? (
                <div className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`${adminBasePath}/blog/${postId}/body/${language}`}>
                      <Maximize2 className="mr-2 h-4 w-4" />
                      {language === "fr" ? "Plein ecran" : "Full canvas"}
                    </Link>
                  </Button>
                </div>
              ) : null}

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Article Content" : "Contenu de l'article"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...form.register(`translations.${language}.title`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input {...form.register(`translations.${language}.slug`)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Excerpt</Label>
                      <Textarea rows={4} {...form.register(`translations.${language}.excerpt`)} />
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                        <p className="text-sm font-medium text-blue-900">
                          {locale === "fr" ? "Zone d'edition principale" : "Primary editing area"}
                        </p>
                        <p className="mt-1 text-sm text-blue-800">
                          {locale === "fr"
                            ? "Le grand editeur ci-dessous est l'endroit ou vous redigez le corps complet de l'article."
                            : "The large editor below is where you write the full article body."}
                        </p>
                      </div>
                      <TiptapEditor
                        contentHtml={form.watch(`translations.${language}.contentHtml`) ?? ""}
                        contentJson={form.watch(`translations.${language}.contentJson`) ?? ""}
                        onChange={({ html, json }) => {
                          form.setValue(`translations.${language}.contentHtml`, html);
                          form.setValue(`translations.${language}.contentJson`, json);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>SEO title</Label>
                          <Input {...form.register(`translations.${language}.seoTitle`)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Canonical URL</Label>
                          <Input {...form.register(`translations.${language}.canonicalUrl`)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>SEO description</Label>
                        <Textarea rows={4} {...form.register(`translations.${language}.seoDescription`)} />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Social share title</Label>
                          <Input {...form.register(`translations.${language}.socialShareTitle`)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Social share description</Label>
                          <Input {...form.register(`translations.${language}.socialShareDescription`)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Course CTA</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Course CTA title</Label>
                        <Input {...form.register(`translations.${language}.courseCtaTitle`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Course CTA label</Label>
                        <Input {...form.register(`translations.${language}.courseCtaLabel`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Course CTA description</Label>
                        <Textarea rows={4} {...form.register(`translations.${language}.courseCtaDescription`)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Course CTA URL</Label>
                        <Input {...form.register(`translations.${language}.courseCtaUrl`)} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Tags</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => tagsFieldArray.append({ value: "" })}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {tagsFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input {...form.register(`tagsFieldArray.${index}.value`)} placeholder="tag_id" />
                <Button type="button" variant="outline" onClick={() => tagsFieldArray.remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            {!tagsFieldArray.fields.length ? <p className="text-sm text-gray-500">No tags yet.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Related posts</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => relatedPostsFieldArray.append({ value: "" })}
              disabled={!remainingRelatedOptions.length}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedPostsFieldArray.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {(() => {
                  const currentValue = relatedSelections?.[index]?.value ?? "";
                  const searchValue = relatedSearchByRow[field.id] ?? "";
                  const takenIds = new Set(
                    (relatedSelections ?? [])
                      .map((entry, entryIndex) => (entryIndex === index ? "" : entry?.value ?? ""))
                      .filter(Boolean)
                  );
                  const availableOptions = relatedPostOptions.filter((option) => !takenIds.has(option.id));
                  const query = searchValue.trim().toLowerCase();
                  const filteredOptions = query
                    ? availableOptions.filter((option) => option.searchText.includes(query))
                    : availableOptions;
                  const currentOption = currentValue
                    ? relatedPostOptions.find((option) => option.id === currentValue)
                    : null;
                  const emptyMessage = !relatedPostOptions.length
                    ? "No other posts are available to relate yet."
                    : availableOptions.length === 0
                      ? "All other posts are already selected."
                      : "No posts match the current search.";
                  const isOpen = openRelatedSelector === field.id;

                  return (
                    <div className="w-full sm:max-w-[420px]">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between truncate"
                        onClick={() => setOpenRelatedSelector(isOpen ? null : field.id)}
                        disabled={!relatedPostOptions.length}
                      >
                        <span className="truncate">
                          {currentOption?.label ?? "Select related post"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                      </Button>
                      {isOpen ? (
                        <div className="relative">
                          <div className="absolute z-20 mt-2 w-full sm:max-w-[420px]">
                            <Command>
                              <CommandInput
                                placeholder="Search by title, excerpt, or id"
                                value={searchValue}
                                onValueChange={(value) =>
                                  setRelatedSearchByRow((prev) => ({ ...prev, [field.id]: value }))
                                }
                              />
                              <CommandList>
                                {filteredOptions.map((option) => (
                                  <CommandItem
                                    key={option.id}
                                    value={option.id}
                                    onSelect={(value) => {
                                      form.setValue(`relatedPostsFieldArray.${index}.value`, value);
                                      setOpenRelatedSelector(null);
                                    }}
                                    disabled={takenIds.has(option.id)}
                                  >
                                    {option.label}
                                  </CommandItem>
                                ))}
                                {!filteredOptions.length ? <CommandEmpty>{emptyMessage}</CommandEmpty> : null}
                              </CommandList>
                            </Command>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
                <Button type="button" variant="outline" onClick={() => relatedPostsFieldArray.remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            {!relatedPostsFieldArray.fields.length ? (
              <p className="text-sm text-gray-500">No related posts configured.</p>
            ) : null}
            {!remainingRelatedOptions.length ? (
              <p className="text-sm text-gray-500">No more posts are available to select.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Resources</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => resourcesFieldArray.append({ label: "", url: "https://", type: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourcesFieldArray.fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl border p-4">
                <Input placeholder="Label" {...form.register(`resources.${index}.label`)} />
                <Input placeholder="URL" {...form.register(`resources.${index}.url`)} />
                <div className="flex gap-2">
                  <Input placeholder="Type" {...form.register(`resources.${index}.type`)} />
                  <Button type="button" variant="outline" onClick={() => resourcesFieldArray.remove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {!resourcesFieldArray.fields.length ? (
              <p className="text-sm text-gray-500">No external resources yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
