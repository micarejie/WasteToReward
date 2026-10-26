"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { deleteMessageAction, setMessageReadAction } from "@/lib/actions/content";
import { field } from "@/lib/styles";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/types/portfolio";

export function MessagesManager({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const selected = messages.find((message) => message.id === selectedId) ?? null;

  const visible = useMemo(() => {
    return messages.filter((message) => {
      if (filter === "unread" && message.is_read) return false;
      if (filter === "read" && !message.is_read) return false;
      const haystack = `${message.name} ${message.email} ${message.subject} ${message.message}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [filter, messages, query]);

  async function toggleRead(message: ContactMessage) {
    await setMessageReadAction(message.id, !message.is_read);
    toast.success(message.is_read ? "Marked as unread." : "Marked as read.");
    router.refresh();
  }

  async function confirmDelete() {
    if (!pendingId) return;
    setDeleting(true);
    try {
      await deleteMessageAction(pendingId);
      toast.success("Message deleted.");
      setPendingId(null);
      if (selectedId === pendingId) setSelectedId(null);
      router.refresh();
    } catch {
      toast.error("The message could not be deleted.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="flex flex-wrap gap-2">
          <input className={`${field} max-w-sm`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search messages" aria-label="Search messages" />
          <select className={field} value={filter} aria-label="Filter by status" onChange={(event) => setFilter(event.target.value as typeof filter)}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        {visible.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No messages match.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
            {visible.map((message) => (
              <li key={message.id}>
                <button type="button" className="w-full px-4 py-3 text-left hover:bg-surface-muted" onClick={() => setSelectedId(message.id)}>
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-heading">{message.subject}</span>
                    <span className="text-xs text-muted">{message.is_read ? "Read" : "Unread"}</span>
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {message.name} · {formatDateTime(message.created_at)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="rounded-3xl border border-border bg-surface p-5">
        {selected ? (
          <div>
            <h2 className="text-xl font-semibold text-heading">{selected.subject}</h2>
            <p className="mt-2 text-sm text-muted">
              {selected.name} · <a className="hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>
            </p>
            <p className="mt-1 text-xs text-muted">{formatDateTime(selected.created_at)}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{selected.message}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <button type="button" className="font-medium text-heading hover:underline" onClick={() => toggleRead(selected)}>
                Mark as {selected.is_read ? "unread" : "read"}
              </button>
              <button type="button" className="text-danger hover:underline" onClick={() => setPendingId(selected.id)}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Select a message to read it. Messages are visible only in this dashboard.</p>
        )}
      </aside>
      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Delete this message?"
        body="The message will be removed and cannot be recovered from the site."
        pending={deleting}
        onClose={() => setPendingId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
