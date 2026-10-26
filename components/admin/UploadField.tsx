"use client";

import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { uploadAsset } from "@/lib/actions/upload";
import type { StorageBucket } from "@/lib/site";
import { field, labelClass } from "@/lib/styles";

export function UploadField({
  label,
  name,
  bucket,
  defaultValue,
  accept,
}: {
  label: string;
  name: string;
  bucket: StorageBucket;
  defaultValue?: string;
  accept: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState("");

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");
    const body = new FormData();
    body.set("bucket", bucket);
    body.set("file", file);
    const result = await uploadAsset(body);
    if (result.error) {
      setStatus(result.error);
      toast.error(result.error);
      return;
    }
    setUrl(result.url ?? "");
    setStatus("Uploaded.");
    toast.success("File uploaded.");
  }

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input className={field} name={name} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https:// or /images/..." />
      <input className="mt-2 block text-sm" type="file" accept={accept} onChange={onFile} />
      {status ? <span className="mt-1 block text-xs text-muted">{status}</span> : null}
      {url && !url.toLowerCase().endsWith(".pdf") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-3 h-28 w-full rounded-2xl object-cover" />
      ) : null}
    </label>
  );
}
