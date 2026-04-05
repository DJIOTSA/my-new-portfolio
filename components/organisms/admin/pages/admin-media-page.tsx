"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { mediaFileSchema } from "@/db/validation/media-file";
import type { MediaFileEntity } from "@/lib/types";

type MediaFileFormValues = z.infer<typeof mediaFileSchema>;

const emptyMediaFile: MediaFileFormValues = {
  id: 1,
  storageKey: "",
  fileName: "",
  mimeType: "",
  size: 0,
  width: null,
  height: null,
  altTranslations: {
    en: { alt: "" },
    fr: { alt: "" }
  }
};

export default function AdminMediaPage() {
  const { locale } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<MediaFileEntity[]>(queryKeys.mediaFiles, "/api/admin/media");
  const form = useForm<MediaFileFormValues>({
    resolver: zodResolver(mediaFileSchema),
    defaultValues: emptyMediaFile
  });
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (data?.[0]) {
      form.reset(data[0]);
    }
  }, [data, form]);

  async function handleSubmit(values: MediaFileFormValues) {
    await adminFetch("/api/admin/media", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.mediaFiles });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{locale === "fr" ? "Medias" : "Media"}</h1>
        <p className="mt-2 text-gray-600">{locale === "fr" ? "Gerez les metadonnees de `media_files`. Associez les cles de stockage depuis Supabase Storage ou un autre fournisseur." : "Manage metadata in `media_files`. Attach storage keys from Supabase Storage or another provider."}</p>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>MIME</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Dimensions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((file) => (
                  <TableRow key={file.id} onClick={() => form.reset(file)} className="cursor-pointer">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{file.fileName}</p>
                        <p className="text-xs text-gray-500">{file.storageKey}</p>
                      </div>
                    </TableCell>
                    <TableCell>{file.mimeType}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell>
                      {file.width && file.height ? `${file.width} x ${file.height}` : "Unknown"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Media Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input type="number" min={1} step={1} {...form.register("id", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Storage Key</Label>
                <Input {...form.register("storageKey")} placeholder="portfolio/hero/avatar.png" />
              </div>
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input {...form.register("fileName")} placeholder="avatar.png" />
              </div>
              <div className="space-y-2">
                <Label>MIME Type</Label>
                <Input {...form.register("mimeType")} placeholder="image/png" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Input type="number" {...form.register("size", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input type="number" {...form.register("width", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input type="number" {...form.register("height", { valueAsNumber: true })} />
                </div>
              </div>
              <Tabs defaultValue="en">
                <TabsList>
                  <TabsTrigger value="en">English Alt</TabsTrigger>
                  <TabsTrigger value="fr">French Alt</TabsTrigger>
                </TabsList>
                {(["en", "fr"] as const).map((language) => (
                  <TabsContent key={language} value={language}>
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input {...form.register(`altTranslations.${language}.alt`)} />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save media metadata"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
