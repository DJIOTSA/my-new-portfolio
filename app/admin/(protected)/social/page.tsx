"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Textarea } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { socialPublicationSchema } from "@/lib/schemas";
import type { BlogPostEntity, SocialPublicationEntity } from "@/lib/types";

type SocialPublicationFormValues = z.infer<typeof socialPublicationSchema>;

interface AdminBlogPostsData {
  posts: BlogPostEntity[];
}

function mapPublicationToFormValues(publication: SocialPublicationEntity): SocialPublicationFormValues {
  return socialPublicationSchema.parse(publication);
}

export default function AdminSocialPage() {
  const { locale } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<SocialPublicationEntity[]>(queryKeys.socialPublications, "/api/admin/social");
  const { data: blogData } = useAdminQuery<AdminBlogPostsData>(queryKeys.blogPosts, "/api/admin/blog/posts");
  const [postId, setPostId] = useState("");
  const [languageCode, setLanguageCode] = useState<"en" | "fr">("en");
  const [selectedPublicationId, setSelectedPublicationId] = useState<string>("");
  const form = useForm<SocialPublicationFormValues>({
    resolver: zodResolver(socialPublicationSchema)
  });

  const selectedPublication = useMemo(
    () => data?.find((entry) => entry.id === selectedPublicationId) ?? data?.[0],
    [data, selectedPublicationId]
  );

  useEffect(() => {
    if (blogData?.posts[0] && !postId) {
      setPostId(blogData.posts[0].id);
    }
  }, [blogData, postId]);

  useEffect(() => {
    if (selectedPublication) {
      setSelectedPublicationId(selectedPublication.id);
      form.reset(mapPublicationToFormValues(selectedPublication));
    }
  }, [form, selectedPublication]);

  async function generate(platform: "linkedin" | "x") {
    await adminFetch("/api/social/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, platform, languageCode })
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.socialPublications });
  }

  async function handleSubmit(values: SocialPublicationFormValues) {
    await adminFetch("/api/admin/social", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.socialPublications });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{locale === "fr" ? "Publication sociale" : "Social Publishing"}</h1>
        <p className="mt-2 text-gray-600">{locale === "fr" ? "Generez, revisez, modifiez et suivez les contenus LinkedIn et X pour les articles multilingues publies." : "Generate, review, edit, and track LinkedIn and X copy for published multilingual articles."}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate Social Copy</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_160px_auto_auto]">
          <div className="space-y-2">
            <Label>Blog Post</Label>
            <Select value={postId} onValueChange={setPostId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blogData?.posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.translations.en?.title ?? post.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={languageCode} onValueChange={(value: "en" | "fr") => setLanguageCode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={() => generate("linkedin")} className="self-end">
            Generate LinkedIn
          </Button>
          <Button type="button" variant="outline" onClick={() => generate("x")} className="self-end">
            Generate X
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publication Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Post</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((entry) => (
                  <TableRow
                    key={entry.id}
                    onClick={() => setSelectedPublicationId(entry.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>{entry.platform}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                    <TableCell>{entry.languageCode}</TableCell>
                    <TableCell>{entry.blogPostId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedPublication ? (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Review Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input value={form.watch("platform")} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input value={form.watch("languageCode")} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value: SocialPublicationFormValues["status"]) => form.setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Generated Text</Label>
                  <Textarea value={form.watch("generatedText")} readOnly rows={5} />
                </div>
                <div className="space-y-2">
                  <Label>Final Text</Label>
                  <Textarea {...form.register("finalText")} rows={6} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <Input {...form.register("externalUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Error Message</Label>
                    <Input {...form.register("errorMessage")} />
                  </div>
                </div>
                <Button type="submit">Save publication</Button>
              </CardContent>
            </Card>
          </form>
        ) : null}
      </div>
    </div>
  );
}
