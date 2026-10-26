import Link from "next/link";
import { cn } from "@/lib/utils";
import { secondaryButton } from "@/lib/styles";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(secondaryButton, page === 1 && "pointer-events-none opacity-50")}
      >
        Previous
      </Link>
      {pages.map((number) => (
        <Link
          key={number}
          href={hrefFor(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm",
            number === page ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-heading",
          )}
        >
          {number}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(secondaryButton, page === totalPages && "pointer-events-none opacity-50")}
      >
        Next
      </Link>
    </nav>
  );
}

export function queryHref(pathname: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
