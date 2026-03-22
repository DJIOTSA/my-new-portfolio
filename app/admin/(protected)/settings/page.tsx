"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { queryKeys } from "@/lib/query/keys";
import { siteSettingsSchema } from "@/lib/schemas";
import type { AdminUserEntity } from "@/lib/types";

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings } = useAdminQuery<SiteSettingsFormValues>(queryKeys.siteSettings, "/api/admin/settings");
  const { data: users } = useAdminQuery<AdminUserEntity[]>(queryKeys.adminUsers, "/api/admin/users");
  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema)
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  async function handleSubmit(values: SiteSettingsFormValues) {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    await queryClient.invalidateQueries({ queryKey: queryKeys.siteSettings });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage site-wide identity, SEO defaults, contact routes, and database-backed admin users.</p>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input {...form.register("contactEmail")} />
              </div>
              <div className="space-y-2">
                <Label>Course Platform URL</Label>
                <Input {...form.register("coursePlatformUrl")} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input {...form.register("linkedinUrl")} />
              </div>
              <div className="space-y-2">
                <Label>X URL</Label>
                <Input {...form.register("xUrl")} />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input {...form.register("githubUrl")} />
              </div>
              <div className="space-y-2">
                <Label>Logo Media ID</Label>
                <Input {...form.register("logoMediaId")} />
              </div>
              <div className="space-y-2">
                <Label>Default OG Image ID</Label>
                <Input {...form.register("defaultOgImageId")} />
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
                      <Label>Site Title</Label>
                      <Input {...form.register(`translations.${language}.siteTitle`)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Default SEO Title</Label>
                      <Input {...form.register(`translations.${language}.defaultSeoTitle`)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Site Description</Label>
                      <Textarea {...form.register(`translations.${language}.siteDescription`)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Default SEO Description</Label>
                      <Textarea {...form.register(`translations.${language}.defaultSeoDescription`)} />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <Button type="submit">Save settings</Button>
          </CardContent>
        </Card>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
