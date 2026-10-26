"use client";

import { useEffect, useRef } from "react";
import { secondaryButton } from "@/lib/styles";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  pending = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="w-[min(100%,28rem)] rounded-3xl border border-border bg-surface p-6 text-foreground shadow-card backdrop:bg-heading/40"
    >
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className={secondaryButton} onClick={onClose} disabled={pending}>
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-danger px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
