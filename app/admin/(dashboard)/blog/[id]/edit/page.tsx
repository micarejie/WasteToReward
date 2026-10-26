import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById } from "@/lib/data/repository";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const post = await getPostById(id);
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">Edit article</h1>
      <PostForm post={post} justSaved={query.saved === "1"} />
    </div>
  );
}
