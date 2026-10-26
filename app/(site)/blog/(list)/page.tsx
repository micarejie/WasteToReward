import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { BlogFilters } from "@/components/ProjectFilters";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { Pagination, queryHref } from "@/components/Pagination";
import { getContentMode, listPosts } from "@/lib/data/repository";
import { PAGE_SIZE } from "@/lib/site";
import { container } from "@/lib/styles";
import { loadPage, matchesQuery, paginate, uniqueSorted } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "A learning journal about studying information technology and building web applications.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const loaded = await loadPage(async () => {
    const mode = await getContentMode();
    const posts = await listPosts("public");
    return { mode, posts };
  });
  if (!loaded.ok) return <ErrorState title="Articles could not be loaded." />;
  const { mode, posts } = loaded.data;
  if (mode === "unconfigured") {
      return (
        <div className={`${container} py-16`}>
          <EmptyState title="The journal will load from Supabase." body="Published articles appear here after the database is connected." />
        </div>
      );
    }
    const filtered = posts.filter((post) => {
      if (params.category && post.category !== params.category) return false;
      return matchesQuery(params.q, [post.title, post.excerpt, post.category, ...post.tags]);
    });
    const page = Number(params.page || "1");
    const result = paginate(filtered, Number.isFinite(page) ? page : 1, PAGE_SIZE);
    const categories = uniqueSorted(posts.map((post) => post.category));

    return (
      <div className={`${container} py-14`}>
        <p className="text-sm font-medium text-primary">Learning journal</p>
        <h1 className="mt-2 text-4xl font-semibold text-heading">Blog</h1>
        <p className="mt-3 max-w-2xl text-muted">Notes from studying, building, and figuring out what to try next. Drafts stay in the dashboard until they are published.</p>
        <div className="mt-8">
          <BlogFilters categories={categories} values={params} />
        </div>
        {result.total === 0 ? (
          <div className="mt-8">
            <EmptyState title="No articles match" body="Try another search, or clear the filters." actionHref="/blog" actionLabel="Clear filters" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          hrefFor={(pageNumber) => queryHref("/blog", { q: params.q, category: params.category }, pageNumber)}
        />
      </div>
    );
}
