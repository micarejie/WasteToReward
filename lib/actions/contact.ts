"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { insertMessage } from "@/lib/data/repository";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, firstIssue } from "@/lib/validations";

export type ContactState = { error?: string; success?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
    startedAt: formData.get("started_at") ?? "",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  if (parsed.data.website.trim()) {
    return { success: "Thanks. Your message has been sent." };
  }

  const started = Number(parsed.data.startedAt);
  if (Number.isFinite(started) && Date.now() - started < 1200) {
    return { error: "Please wait a moment, then send the message again." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "local";
  const key = createHash("sha256").update(`${ip}:${parsed.data.email.toLowerCase()}`).digest("hex");
  if (!rateLimit(key)) {
    return { error: "Too many messages were sent from this address. Try again later." };
  }

  try {
    await insertMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
  } catch (error) {
    console.error(error);
    return { error: "The message could not be saved. Please try again." };
  }

  return { success: "Thanks. Your message has been sent." };
}
