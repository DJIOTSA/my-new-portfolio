import { AdminBlogPostBodyPage } from "@/components/organisms/admin/pages/admin-blog-post-body-page";

export default async function AdminBlogPostBodyRoute({
  params
}: {
  params: Promise<{ postId: string; language: string }>;
}) {
  const { postId, language } = await params;
  const normalizedLanguage = language === "fr" ? "fr" : "en";

  return <AdminBlogPostBodyPage postId={postId} language={normalizedLanguage} />;
}
