"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useAdminLocale } from "@/components/organisms/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { adminFetch, adminJsonFetch } from "@/lib/auth/client";
import { queryKeys } from "@/lib/query/keys";
import { mediaFileSchema } from "@/db/validation/media-file";
import type { MediaFileEntity } from "@/lib/types";

type MediaFileFormValues = z.infer<typeof mediaFileSchema>;
type UploadUrlResponse = { uploadUrl: string; storageKey: string; publicUrl: string };

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

async function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) {
    return null;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    image.src = objectUrl;
  });
}

export default function AdminMediaPage() {
  const { locale } = useAdminLocale();
  const queryClient = useQueryClient();
  const { data } = useAdminQuery<MediaFileEntity[]>(queryKeys.mediaFiles, "/api/admin/media");
  const form = useForm<MediaFileFormValues>({
    resolver: zodResolver(mediaFileSchema),
    defaultValues: emptyMediaFile
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDirectory, setUploadDirectory] = useState("media");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadError(null);
    setUploadedUrl(null);
    setCopyStatus("idle");
  }

  async function handleUpload() {
    if (!selectedFile) {
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadedUrl(null);
    setCopyStatus("idle");

    try {
      const dimensions = await getImageDimensions(selectedFile);
      const uploadRequest = await adminJsonFetch<UploadUrlResponse>("/api/admin/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type || "application/octet-stream",
          directory: uploadDirectory || undefined
        })
      });

      const uploadResponse = await fetch(uploadRequest.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type || "application/octet-stream" },
        body: selectedFile
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }

      form.setValue("storageKey", uploadRequest.storageKey);
      form.setValue("fileName", selectedFile.name);
      form.setValue("mimeType", selectedFile.type || "application/octet-stream");
      form.setValue("size", selectedFile.size);
      form.setValue("width", dimensions?.width ?? null);
      form.setValue("height", dimensions?.height ?? null);
      setUploadedUrl(uploadRequest.publicUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleCopyUrl() {
    if (!uploadedUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1500);
    } catch {
      setCopyStatus("idle");
    }
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
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload to Supabase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>File</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-gray-500">
                  Upload to Supabase Storage via a signed URL. Once uploaded, the form below is prefilled with metadata.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Directory (optional)</Label>
                <Input value={uploadDirectory} onChange={(event) => setUploadDirectory(event.target.value)} placeholder="media/blog" />
              </div>
              <Button type="button" onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? "Uploading..." : "Upload & fill form"}
              </Button>
              {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
              {uploadedUrl ? (
                <div className="space-y-2">
                  <Label>Public URL</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={uploadedUrl} className="flex-1" />
                    <Button type="button" variant="outline" onClick={handleCopyUrl}>
                      {copyStatus === "copied" ? "Copied" : "Copy URL"}
                    </Button>
                  </div>
                </div>
              ) : null}
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
    </div>
  );
}
