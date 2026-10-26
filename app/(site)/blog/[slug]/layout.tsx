import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/repository";

export default async function BlogArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return children;
}
