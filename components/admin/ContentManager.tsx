"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { field } from "@/lib/styles";
import type { BlogPost, Certificate, Project } from "@/types/portfolio";
import { deleteCertificateAction, deletePostAction, deleteProjectAction } from "@/lib/actions/content";

type Column<T> = {
  key: string;
  label: string;
  value: (row: T) => string;
};

export function ContentManager<T extends { id: string }>({
  rows,
  columns,
  searchText,
  editBase,
  newHref,
  newLabel,
  noun,
  onDelete,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  editBase: string;
  newHref: string;
  newLabel: string;
  noun: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? "");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle ? rows.filter((row) => searchText(row).toLowerCase().includes(needle)) : rows;
    const column = columns.find((item) => item.key === sortKey) ?? columns[0];
    return [...filtered].sort((a, b) => {
      const result = column.value(a).localeCompare(column.value(b));
      return direction === "asc" ? result : -result;
    });
  }, [columns, direction, query, rows, searchText, sortKey]);

  function toggleSort(key: string) {
    if (sortKey === key) setDirection((value) => (value === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDirection("asc");
    }
  }

  async function confirm() {
    if (!pendingId) return;
    setDeleting(true);
    try {
      await onDelete(pendingId);
      toast.success(`${noun} deleted.`);
      setPendingId(null);
      router.refresh();
    } catch {
      toast.error(`The ${noun.toLowerCase()} could not be deleted.`);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input className={`${field} max-w-sm`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${noun.toLowerCase()}s`} aria-label={`Search ${noun.toLowerCase()}s`} />
        <Link href={newHref} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          {newLabel}
        </Link>
      </div>
      {visible.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted">Nothing matches that search.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-medium">
                    <button type="button" onClick={() => toggleSort(column.key)} className="hover:text-heading">
                      {column.label}
                      {sortKey === column.key ? (direction === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-foreground">
                      {column.value(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`${editBase}/${row.id}/edit`} className="font-medium text-heading hover:underline">
                        Edit
                      </Link>
                      <button type="button" className="text-danger hover:underline" onClick={() => setPendingId(row.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pendingId)}
        title={`Delete this ${noun.toLowerCase()}?`}
        body="This removes it from the database. The public site updates after you confirm."
        pending={deleting}
        onClose={() => setPendingId(null)}
        onConfirm={confirm}
      />
    </div>
  );
}

const projectColumns = [
  { key: "title", label: "Title", value: (project: Project) => project.title },
  { key: "category", label: "Category", value: (project: Project) => project.category },
  { key: "status", label: "Status", value: (project: Project) => project.status },
  { key: "published", label: "Visibility", value: (project: Project) => (project.published ? "Published" : "Draft") },
];

export function ProjectsManager({ projects }: { projects: Project[] }) {
  return (
    <ContentManager
      rows={projects}
      noun="Project"
      newHref="/admin/projects/new"
      newLabel="New project"
      editBase="/admin/projects"
      columns={projectColumns}
      searchText={(project) => `${project.title} ${project.description} ${project.category} ${project.status}`}
      onDelete={deleteProjectAction}
    />
  );
}

const postColumns = [
  { key: "title", label: "Title", value: (post: BlogPost) => post.title },
  { key: "category", label: "Category", value: (post: BlogPost) => post.category },
  { key: "published", label: "Visibility", value: (post: BlogPost) => (post.published ? "Published" : "Draft") },
];

export function PostsManager({ posts }: { posts: BlogPost[] }) {
  return (
    <ContentManager
      rows={posts}
      noun="Article"
      newHref="/admin/blog/new"
      newLabel="New article"
      editBase="/admin/blog"
      columns={postColumns}
      searchText={(post) => `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(" ")}`}
      onDelete={deletePostAction}
    />
  );
}

const certificateColumns = [
  { key: "title", label: "Title", value: (item: Certificate) => item.title },
  { key: "issuer", label: "Issuer", value: (item: Certificate) => item.issuer },
  { key: "featured", label: "Featured", value: (item: Certificate) => (item.featured ? "Yes" : "No") },
];

export function CertificatesManager({ certificates }: { certificates: Certificate[] }) {
  return (
    <ContentManager
      rows={certificates}
      noun="Certificate"
      newHref="/admin/certificates/new"
      newLabel="New certificate"
      editBase="/admin/certificates"
      columns={certificateColumns}
      searchText={(item) => `${item.title} ${item.issuer} ${item.description}`}
      onDelete={deleteCertificateAction}
    />
  );
}
