"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { UploadField } from "@/components/admin/UploadField";
import { saveCertificateAction, type ActionState } from "@/lib/actions/content";
import { field, labelClass, primaryButton } from "@/lib/styles";
import type { Certificate } from "@/types/portfolio";

const initial: ActionState = {};

export function CertificateForm({ certificate, justSaved = false }: { certificate?: Certificate; justSaved?: boolean }) {
  const action = saveCertificateAction.bind(null, certificate?.id ?? null);
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => {
    if (justSaved) toast.success("Certificate created.");
  }, [justSaved]);
  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      <label>
        <span className={labelClass}>Title</span>
        <input className={field} name="title" defaultValue={certificate?.title} required />
      </label>
      <label>
        <span className={labelClass}>Issuing organization</span>
        <input className={field} name="issuer" defaultValue={certificate?.issuer} required />
      </label>
      <label>
        <span className={labelClass}>Description</span>
        <textarea className={field} name="description" defaultValue={certificate?.description} />
      </label>
      <label>
        <span className={labelClass}>Date earned</span>
        <input className={field} type="date" name="date_earned" defaultValue={certificate?.date_earned ?? ""} />
      </label>
      <UploadField
        label="Certificate image or PDF"
        name="image_url"
        bucket="certificates"
        defaultValue={certificate?.image_url}
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
      />
      <label>
        <span className={labelClass}>Credential URL</span>
        <input className={field} name="credential_url" defaultValue={certificate?.credential_url ?? ""} placeholder="https://" />
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={certificate?.featured} /> Feature on the homepage
      </label>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-heading">{state.success}</p> : null}
      <button className={primaryButton} type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save certificate"}
      </button>
    </form>
  );
}
