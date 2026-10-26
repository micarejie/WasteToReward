import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">New article</h1>
      <PostForm />
    </div>
  );
}
