import { AdminBlogPostEditor } from "@/features/blog/components/admin-blog-post-editor";

export default async function AdminEditBlogPostPage({
  params
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <AdminBlogPostEditor postId={postId} />;
}
