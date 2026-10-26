"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { UploadField } from "@/components/admin/UploadField";
import { savePostAction, type ActionState } from "@/lib/actions/content";
import { field, labelClass, primaryButton } from "@/lib/styles";
import type { BlogPost } from "@/types/portfolio";

const initial: ActionState = {};

export function PostForm({ post, justSaved = false }: { post?: BlogPost; justSaved?: boolean }) {
  const action = savePostAction.bind(null, post?.id ?? null);
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => {
    if (justSaved) toast.success("Article created.");
  }, [justSaved]);
  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>Title</span>
          <input className={field} name="title" defaultValue={post?.title} required />
        </label>
        <label>
          <span className={labelClass}>Slug</span>
          <input className={field} name="slug" defaultValue={post?.slug} />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Excerpt</span>
          <textarea className={field} name="excerpt" defaultValue={post?.excerpt} required />
        </label>
        <label>
          <span className={labelClass}>Category</span>
          <input className={field} name="category" defaultValue={post?.category} required />
        </label>
        <label>
          <span className={labelClass}>Tags, separated by commas</span>
          <input className={field} name="tags" defaultValue={post?.tags.join(", ")} />
        </label>
      </div>
      <UploadField label="Cover image" name="cover_image_url" bucket="blog" defaultValue={post?.cover_image_url} accept="image/jpeg,image/png,image/webp,image/gif" />
      <label>
        <span className={labelClass}>Article, in Markdown</span>
        <textarea className={`${field} min-h-72 font-mono`} name="content" defaultValue={post?.content} required />
      </label>
      <p className="text-xs text-muted">Supported formatting: headings, lists, bold, italic, links, and code. Raw HTML is not rendered.</p>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} /> Published
      </label>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-heading">{state.success}</p> : null}
      <button className={primaryButton} disabled={pending} type="submit">
        {pending ? "Saving…" : "Save article"}
      </button>
    </form>
  );
}
