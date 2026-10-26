"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo/mode";
import { isSupabaseConfigured, type StorageBucket, storageBuckets } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadAsset(formData: FormData): Promise<{ url?: string; error?: string }> {
  const session = await requireAdmin();
  const bucket = String(formData.get("bucket") ?? "");
  const file = formData.get("file");
  if (!storageBuckets.includes(bucket as StorageBucket)) return { error: "Choose a valid upload folder." };
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload." };

  const extension = extensions[file.type];
  if (!extension) return { error: "Upload a JPG, PNG, WEBP, GIF, or PDF file." };
  const isPdf = file.type === "application/pdf";
  const allowsPdf = bucket === "resumes" || bucket === "certificates";
  if (isPdf && !allowsPdf) return { error: "This folder accepts images only." };
  if (!isPdf && !imageTypes.has(file.type)) return { error: "This file type is not allowed." };
  if (bucket === "resumes" && !isPdf) return { error: "The resume folder accepts a PDF." };

  const limit = isPdf ? 8 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > limit) return { error: isPdf ? "PDF files must be 8 MB or smaller." : "Images must be 5 MB or smaller." };

  const filename = `${randomUUID()}.${extension}`;

  if (isSupabaseConfigured() && !isDemoMode()) {
    const supabase = await createClient();
    const objectPath = `${session.userId}/${filename}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { error: "The file could not be uploaded. Check that you are an administrator and the storage bucket exists." };
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return { url: data.publicUrl };
  }

  const directory = path.join(process.cwd(), "public", "uploads", bucket);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${bucket}/${filename}` };
}
