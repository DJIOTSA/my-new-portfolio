"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui";
import { TiptapEditor } from "@/features/blog/components/tiptap-editor";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { queryKeys } from "@/lib/query/keys";
import { blogCategorySchema, blogPostSchema, blogTagSchema } from "@/lib/schemas";
import type { BlogAuthorEntity, BlogCategoryEntity, BlogPostEntity, BlogTagEntity } from "@/lib/types";

interface AdminBlogData {
  posts: BlogPostEntity[];
  categories: BlogCategoryEntity[];
  tags: BlogTagEntity[];
  authors: BlogAuthorEntity[];
}

type BlogPostFormValues = z.infer<typeof blogPostSchema>;
type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;
type BlogTagFormValues = z.infer<typeof blogTagSchema>;

function mapPostToFormValues(post: BlogPostEntity): BlogPostFormValues {
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
    tags: post.tags,
    resources: post.resources,
    relatedPostIds: post.relatedPostIds,
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

function createEmptyPost(authors: BlogAuthorEntity[], categories: BlogCategoryEntity[]): BlogPostFormValues {
  return {
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
        contentJson: "{\"html\":\"\"}",
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
        contentJson: "{\"html\":\"\"}",
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
}

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<AdminBlogData>(queryKeys.blogPosts, "/api/admin/blog/posts");
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const selectedPost = useMemo(
    () => data?.posts.find((post) => post.id === selectedPostId) ?? data?.posts[0],
    [data?.posts, selectedPostId]
  );
  const postForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema)
  });
  const categoriesForm = useForm<{ categories: BlogCategoryFormValues[] }>({
    resolver: zodResolver(z.object({ categories: blogCategorySchema.array() })),
    defaultValues: { categories: [] }
  });
  const tagsForm = useForm<{ tags: BlogTagFormValues[] }>({
    resolver: zodResolver(z.object({ tags: blogTagSchema.array() })),
    defaultValues: { tags: [] }
  });

  const resourcesArray = useFieldArray({ control: postForm.control, name: "resources" });
  const categoriesArray = useFieldArray({ control: categoriesForm.control, name: "categories" });
  const tagsArray = useFieldArray({ control: tagsForm.control, name: "tags" });

  useEffect(() => {
    if (data?.posts[0] && !selectedPostId) {
      setSelectedPostId(data.posts[0].id);
    }
  }, [data, selectedPostId]);

  useEffect(() => {
    if (selectedPost) {
      postForm.reset(mapPostToFormValues(selectedPost));
    }
  }, [postForm, selectedPost]);

  useEffect(() => {
    if (data?.categories) {
      categoriesForm.reset({ categories: data.categories });
    }
  }, [categoriesForm, data?.categories]);

  useEffect(() => {
    if (data?.tags) {
      tagsForm.reset({ tags: data.tags });
    }
  }, [tagsForm, data?.tags]);

  async function savePost(values: BlogPostFormValues) {
    await fetch("/api/admin/blog/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
  }

  async function saveCategories(values: { categories: BlogCategoryFormValues[] }) {
    await Promise.all(
      values.categories.map((category) =>
        fetch("/api/admin/blog/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category)
        })
      )
    );
    await queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
    await queryClient.invalidateQueries({ queryKey: queryKeys.blogCategories });
  }

  async function saveTags(values: { tags: BlogTagFormValues[] }) {
    await Promise.all(
      values.tags.map((tag) =>
        fetch("/api/admin/blog/tags", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tag)
        })
      )
    );
    await queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
    await queryClient.invalidateQueries({ queryKey: queryKeys.blogTags });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <p className="mt-2 text-gray-600">Manage posts, categories, tags, translations, and article-specific SEO from one CMS workspace.</p>
      </div>
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-6">
          <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Posts</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const nextPost = createEmptyPost(data?.authors ?? [], data?.categories ?? []);
                    setSelectedPostId(nextPost.id);
                    postForm.reset(nextPost);
                  }}
                >
                  New post
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
                    className="w-full rounded-lg border bg-white p-4 text-left hover:border-blue-400"
                  >
                    <p className="font-semibold text-gray-900">{post.translations.en?.title ?? post.id}</p>
                    <p className="mt-1 text-sm text-gray-500">{post.status}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
            <form onSubmit={postForm.handleSubmit(savePost)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={postForm.watch("status")}
                        onValueChange={(value: BlogPostFormValues["status"]) => postForm.setValue("status", value)}
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
                      <Select value={postForm.watch("authorId")} onValueChange={(value) => postForm.setValue("authorId", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.authors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.translations.en?.name ?? author.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={postForm.watch("categoryId")} onValueChange={(value) => postForm.setValue("categoryId", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.translations.en?.name ?? category.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reading Time (minutes)</Label>
                      <Input type="number" {...postForm.register("readingTime", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select
                        value={postForm.watch("difficulty")}
                        onValueChange={(value: BlogPostFormValues["difficulty"]) => postForm.setValue("difficulty", value)}
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
                    <div className="space-y-2">
                      <Label>Tag IDs</Label>
                      <Input
                        value={postForm.watch("tags").join(", ")}
                        onChange={(event) =>
                          postForm.setValue(
                            "tags",
                            event.target.value.split(",").map((value) => value.trim()).filter(Boolean)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Published At</Label>
                      <Input {...postForm.register("publishedAt")} placeholder="2026-03-19T10:00:00.000Z" />
                    </div>
                    <div className="space-y-2">
                      <Label>Scheduled At</Label>
                      <Input {...postForm.register("scheduledAt")} placeholder="2026-03-20T10:00:00.000Z" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Media ID</Label>
                      <Input {...postForm.register("coverMediaId")} />
                    </div>
                  </div>
                  <Tabs defaultValue="en">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="fr">French</TabsTrigger>
                    </TabsList>
                    {(["en", "fr"] as const).map((language) => (
                      <TabsContent key={language} value={language} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input {...postForm.register(`translations.${language}.title`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input {...postForm.register(`translations.${language}.slug`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Excerpt</Label>
                            <Textarea {...postForm.register(`translations.${language}.excerpt`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Article Body</Label>
                            <TiptapEditor
                              value={postForm.watch(`translations.${language}.contentHtml`) ?? ""}
                              onChange={(value) => {
                                postForm.setValue(`translations.${language}.contentHtml`, value);
                                postForm.setValue(`translations.${language}.contentJson`, JSON.stringify({ html: value }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>SEO Title</Label>
                            <Input {...postForm.register(`translations.${language}.seoTitle`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Canonical URL</Label>
                            <Input {...postForm.register(`translations.${language}.canonicalUrl`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>SEO Description</Label>
                            <Textarea {...postForm.register(`translations.${language}.seoDescription`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Course CTA Title</Label>
                            <Input {...postForm.register(`translations.${language}.courseCtaTitle`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Course CTA Label</Label>
                            <Input {...postForm.register(`translations.${language}.courseCtaLabel`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Course CTA Description</Label>
                            <Textarea {...postForm.register(`translations.${language}.courseCtaDescription`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Course CTA URL</Label>
                            <Input {...postForm.register(`translations.${language}.courseCtaUrl`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Social Share Title</Label>
                            <Input {...postForm.register(`translations.${language}.socialShareTitle`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Social Share Description</Label>
                            <Input {...postForm.register(`translations.${language}.socialShareDescription`)} />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Resources</Label>
                      <Button type="button" variant="outline" onClick={() => resourcesArray.append({ label: "", url: "https://", type: "" })}>
                        Add resource
                      </Button>
                    </div>
                    {resourcesArray.fields.map((field, index) => (
                      <div key={field.id} className="grid gap-3 md:grid-cols-3">
                        <Input placeholder="Label" {...postForm.register(`resources.${index}.label`)} />
                        <Input placeholder="URL" {...postForm.register(`resources.${index}.url`)} />
                        <div className="flex gap-2">
                          <Input placeholder="Type" {...postForm.register(`resources.${index}.type`)} />
                          <Button type="button" variant="outline" onClick={() => resourcesArray.remove(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label>Related Post IDs</Label>
                    <Textarea
                      value={postForm.watch("relatedPostIds").join("\n")}
                      onChange={(event) =>
                        postForm.setValue(
                          "relatedPostIds",
                          event.target.value.split("\n").map((value) => value.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                  <Button type="submit">Save post</Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="categories">
          <form onSubmit={categoriesForm.handleSubmit(saveCategories)} className="space-y-6">
            {categoriesArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Category {index + 1}</CardTitle>
                  <Button type="button" variant="outline" onClick={() => categoriesArray.remove(index)}>
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>ID</Label>
                      <Input {...categoriesForm.register(`categories.${index}.id`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent ID</Label>
                      <Input {...categoriesForm.register(`categories.${index}.parentId`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Index</Label>
                      <Input type="number" {...categoriesForm.register(`categories.${index}.orderIndex`, { valueAsNumber: true })} />
                    </div>
                  </div>
                  <Tabs defaultValue="en">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="fr">French</TabsTrigger>
                    </TabsList>
                    {(["en", "fr"] as const).map((language) => (
                      <TabsContent key={language} value={language}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input {...categoriesForm.register(`categories.${index}.translations.${language}.name`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input {...categoriesForm.register(`categories.${index}.translations.${language}.slug`)} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Description</Label>
                            <Textarea {...categoriesForm.register(`categories.${index}.translations.${language}.description`)} />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  categoriesArray.append({
                    id: `category_${Date.now()}`,
                    parentId: null,
                    orderIndex: categoriesArray.fields.length,
                    translations: {
                      en: { name: "", slug: "", description: "" },
                      fr: { name: "", slug: "", description: "" }
                    }
                  })
                }
              >
                Add category
              </Button>
              <Button type="submit">Save categories</Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="tags">
          <form onSubmit={tagsForm.handleSubmit(saveTags)} className="space-y-6">
            {tagsArray.fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Tag {index + 1}</CardTitle>
                  <Button type="button" variant="outline" onClick={() => tagsArray.remove(index)}>
                    Remove
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>ID</Label>
                    <Input {...tagsForm.register(`tags.${index}.id`)} />
                  </div>
                  <Tabs defaultValue="en">
                    <TabsList>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="fr">French</TabsTrigger>
                    </TabsList>
                    {(["en", "fr"] as const).map((language) => (
                      <TabsContent key={language} value={language}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input {...tagsForm.register(`tags.${index}.translations.${language}.name`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input {...tagsForm.register(`tags.${index}.translations.${language}.slug`)} />
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  tagsArray.append({
                    id: `tag_${Date.now()}`,
                    translations: {
                      en: { name: "", slug: "" },
                      fr: { name: "", slug: "" }
                    }
                  })
                }
              >
                Add tag
              </Button>
              <Button type="submit">Save tags</Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
