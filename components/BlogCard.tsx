import Link from "next/link";
import { formatDate, readingTime, safeAssetUrl } from "@/lib/utils";
import type { BlogPost } from "@/types/portfolio";

export function BlogCard({ post }: { post: BlogPost }) {
  const image = safeAssetUrl(post.cover_image_url);
  const minutes = readingTime(post.content);
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card motion-safe:transition motion-safe:hover:-translate-y-0.5">
      <div className="aspect-[16/9] bg-primary-soft">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-5">
        <p className="text-xs text-muted">
          {formatDate(post.published_at ?? post.created_at)} · {minutes} min read · {post.category}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-heading">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs text-heading">
              {tag}
            </li>
          ))}
        </ul>
        <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium text-heading hover:underline">
          Read article
        </Link>
      </div>
    </article>
  );
}
