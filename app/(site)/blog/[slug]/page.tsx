import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { ErrorState } from "@/components/ErrorState";
import { MarkdownView } from "@/components/MarkdownView";
import { ShareLinks } from "@/components/ShareLinks";
import { getPostBySlug, listPosts } from "@/lib/data/repository";
import { absoluteUrl } from "@/lib/site";
import { container } from "@/lib/styles";
import { formatDate, loadPage, readingTime, relatedPosts, safeAssetUrl } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<Params> }) {
  const loaded = await loadPage(async () => {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return null;
    const posts = await listPosts("public");
    return { post, related: relatedPosts(posts, post) };
  });
  if (!loaded.ok) return <ErrorState title="This article could not be loaded." />;
  if (!loaded.data) notFound();
  const { post, related } = loaded.data;
  const image = safeAssetUrl(post.cover_image_url);
  const minutes = readingTime(post.content);

  return (
      <article className={`${container} py-14`}>
        <p className="text-sm text-muted">
          <Link href="/blog" className="hover:text-heading">
            Blog
          </Link>{" "}
          / {post.category}
        </p>
        <h1 className="section-title mt-3 max-w-3xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {formatDate(post.published_at ?? post.created_at)} · {minutes} min read
        </p>
        <div className="mt-4">
          <ShareLinks url={absoluteUrl(`/blog/${post.slug}`)} title={post.title} />
        </div>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="mt-8 aspect-[16/8] w-full rounded-3xl border border-border object-cover" />
        ) : null}
        <div className="mt-8 max-w-3xl">
          <MarkdownView source={post.content} />
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-primary-soft px-3 py-1 text-sm text-heading">
              {tag}
            </li>
          ))}
        </ul>
        {related.length ? (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-heading">Related posts</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
  );
}
