import { AdminBlogPostEditor } from "@/components/organisms/blog/admin-blog-post-editor";

export default async function AdminEditBlogPostPage({
  params
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <AdminBlogPostEditor postId={postId} />;
}
