"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, FilePenLine, Plus, Search } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useAdminLocale } from "@/components/admin/admin-locale-provider";
import { useAdminQuery } from "@/hooks/use-admin-query";
import { queryKeys } from "@/lib/query/keys";
import type { BlogAuthorEntity, BlogCategoryEntity, BlogPostEntity } from "@/lib/types";

interface AdminBlogData {
  posts: BlogPostEntity[];
  categories: BlogCategoryEntity[];
  authors: BlogAuthorEntity[];
}

type SortKey = "updatedAt" | "publishedAt" | "title";

function getStatusVariant(status: BlogPostEntity["status"]): "default" | "secondary" | "success" {
  if (status === "published") {
    return "success";
  }

  if (status === "scheduled") {
    return "default";
  }

  return "secondary";
}

export function AdminBlogPostTable() {
  const { locale, adminBasePath } = useAdminLocale();
  const { data } = useAdminQuery<AdminBlogData>(queryKeys.blogPosts, "/api/admin/blog/posts");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogPostEntity["status"] | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");

  const rows = useMemo(() => {
    const categoriesById = new Map((data?.categories ?? []).map((category) => [category.id, category]));
    const authorsById = new Map((data?.authors ?? []).map((author) => [author.id, author]));
    const query = searchValue.trim().toLowerCase();

    return (data?.posts ?? [])
      .filter((post) => (statusFilter === "all" ? true : post.status === statusFilter))
      .filter((post) => {
        const title = post.translations.en?.title ?? post.translations.fr?.title ?? post.id;
        const excerpt = post.translations.en?.excerpt ?? post.translations.fr?.excerpt ?? "";
        return query ? `${title} ${excerpt}`.toLowerCase().includes(query) : true;
      })
      .map((post) => ({
        post,
        title: post.translations.en?.title ?? post.translations.fr?.title ?? post.id,
        categoryName:
          categoriesById.get(post.categoryId)?.translations.en?.name ??
          categoriesById.get(post.categoryId)?.translations.fr?.name ??
          post.categoryId,
        authorName:
          authorsById.get(post.authorId)?.translations.en?.name ??
          authorsById.get(post.authorId)?.translations.fr?.name ??
          post.authorId
      }))
      .sort((left, right) => {
        if (sortKey === "title") {
          return left.title.localeCompare(right.title);
        }

        const leftValue = left.post[sortKey] ?? left.post.createdAt;
        const rightValue = right.post[sortKey] ?? right.post.createdAt;
        return String(rightValue).localeCompare(String(leftValue));
      });
  }, [data?.authors, data?.categories, data?.posts, searchValue, sortKey, statusFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === "fr" ? "Articles du blog" : "Blog Posts"}
          </h1>
          <p className="mt-2 text-gray-600">
            {locale === "fr"
              ? "Parcourez, filtrez et ouvrez chaque article depuis une vue de gestion dediee."
              : "Browse, filter, and open each article from a dedicated management view."}
          </p>
        </div>
        <Button asChild>
          <Link href={`${adminBasePath}/blog/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {locale === "fr" ? "Nouvel article" : "New post"}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>{locale === "fr" ? "Tableau des articles" : "Posts Data Table"}</CardTitle>
            <p className="text-sm text-gray-500">
              {rows.length} {locale === "fr" ? "resultats" : "results"}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-9"
                placeholder={locale === "fr" ? "Rechercher un article" : "Search posts"}
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: BlogPostEntity["status"] | "all") => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === "fr" ? "Tous les statuts" : "All statuses"}</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={(value: SortKey) => setSortKey(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">{locale === "fr" ? "Tri: mise a jour" : "Sort: updated"}</SelectItem>
                <SelectItem value="publishedAt">{locale === "fr" ? "Tri: publication" : "Sort: published"}</SelectItem>
                <SelectItem value="title">{locale === "fr" ? "Tri: titre" : "Sort: title"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Updated
                    </span>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ post, title, categoryName, authorName }) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500">
                          {post.translations.en?.slug ?? post.translations.fr?.slug ?? post.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{categoryName}</TableCell>
                    <TableCell>{authorName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${adminBasePath}/blog/${post.id}`}>
                          <FilePenLine className="mr-2 h-4 w-4" />
                          {locale === "fr" ? "Modifier" : "Edit"}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
                      {locale === "fr" ? "Aucun article ne correspond aux filtres." : "No posts match the current filters."}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
