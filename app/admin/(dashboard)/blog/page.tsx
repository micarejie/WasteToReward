import { PostsManager } from "@/components/admin/ContentManager";
import { listPosts } from "@/lib/data/repository";

export default async function AdminBlogPage() {
  const posts = await listPosts("admin");
  return (
    <div>
      <h1 className="text-3xl font-semibold text-heading">Blog</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Only published articles are visible to visitors.</p>
      <PostsManager posts={posts} />
    </div>
  );
}
