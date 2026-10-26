"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  deleteCertificate,
  deleteMessage,
  deletePost,
  deleteProject,
  saveCertificate,
  savePost,
  saveProfile,
  saveProject,
  setMessageRead,
} from "@/lib/data/repository";
import { linesToGallery, slugify, splitList } from "@/lib/utils";
import { blogSchema, certificateSchema, firstIssue, profileSchema, projectSchema } from "@/lib/validations";

export type ActionState = { error?: string; success?: string };

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readChallenges(value: string) {
  return splitLines(value)
    .map((line) => {
      const [challenge, ...rest] = line.split("|");
      return { challenge: challenge.trim(), solution: rest.join("|").trim() };
    })
    .filter((item) => item.challenge || item.solution);
}

function readJsonArray(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/certificates");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

function messageFrom(error: unknown) {
  if (error instanceof Error && error.message && !error.message.startsWith("NEXT_REDIRECT")) {
    return error.message;
  }
  return "The change could not be saved.";
}

export async function saveProjectAction(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "");
  const parsed = projectSchema.safeParse({
    title,
    slug: String(formData.get("slug") ?? "") || slugify(title),
    description: formData.get("description"),
    category: formData.get("category"),
    status: formData.get("status"),
    tech_stack: splitList(String(formData.get("tech_stack") ?? "")),
    image_url: formData.get("image_url"),
    gallery: linesToGallery(String(formData.get("gallery") ?? "")),
    demo_url: formData.get("demo_url"),
    github_url: formData.get("github_url"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    overview: formData.get("overview"),
    problem: formData.get("problem"),
    objectives: splitLines(String(formData.get("objectives") ?? "")),
    target_users: formData.get("target_users"),
    features: splitLines(String(formData.get("features") ?? "")),
    process: formData.get("process"),
    challenges: readChallenges(String(formData.get("challenges") ?? "")),
    lessons: splitLines(String(formData.get("lessons") ?? "")),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  try {
    const saved = await saveProject(parsed.data, id ?? undefined);
    revalidatePublic();
    revalidatePath(`/projects/${saved.slug}`);
    revalidatePath("/admin/projects");
    if (!id) redirect(`/admin/projects/${saved.id}/edit?saved=1`);
    return { success: "Project saved." };
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: messageFrom(error) };
  }
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePublic();
  revalidatePath("/admin/projects");
}

export async function savePostAction(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const title = String(formData.get("title") ?? "");
  const parsed = blogSchema.safeParse({
    title,
    slug: String(formData.get("slug") ?? "") || slugify(title),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image_url: formData.get("cover_image_url"),
    category: formData.get("category"),
    tags: splitList(String(formData.get("tags") ?? "")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  try {
    const saved = await savePost(parsed.data, id ?? undefined);
    revalidatePublic();
    revalidatePath(`/blog/${saved.slug}`);
    revalidatePath("/admin/blog");
    if (!id) redirect(`/admin/blog/${saved.id}/edit?saved=1`);
    return { success: "Article saved." };
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    return { error: messageFrom(error) };
  }
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await deletePost(id);
  revalidatePublic();
  revalidatePath("/admin/blog");
}

export async function saveCertificateAction(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = certificateSchema.safeParse({
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    description: formData.get("description"),
    date_earned: formData.get("date_earned"),
    image_url: formData.get("image_url"),
    credential_url: formData.get("credential_url"),
    featured: formData.get("featured") === "on",
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  try {
    const saved = await saveCertificate(parsed.data, id ?? undefined);
    revalidatePublic();
    revalidatePath("/admin/certificates");
    if (!id) redirect(`/admin/certificates/${saved.id}/edit?saved=1`);
    return { success: "Certificate saved." };
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    return { error: messageFrom(error) };
  }
}

export async function deleteCertificateAction(id: string) {
  await requireAdmin();
  await deleteCertificate(id);
  revalidatePublic();
  revalidatePath("/admin/certificates");
}

export async function saveProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    headline: formData.get("headline"),
    tagline: formData.get("tagline"),
    motto: formData.get("motto"),
    bio: formData.get("bio"),
    email: formData.get("email"),
    avatar_url: formData.get("avatar_url"),
    resume_url: formData.get("resume_url"),
    github_url: formData.get("github_url"),
    linkedin_url: formData.get("linkedin_url"),
    location: formData.get("location"),
    interests: splitLines(String(formData.get("interests") ?? "")),
    strengths: splitLines(String(formData.get("strengths") ?? "")),
    career_goals: formData.get("career_goals"),
    skills: readJsonArray(formData.get("skills_json")),
    education: readJsonArray(formData.get("education_json")),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  try {
    await saveProfile(parsed.data);
    revalidatePublic();
    revalidatePath("/admin/profile");
    return { success: "Profile saved." };
  } catch (error) {
    return { error: messageFrom(error) };
  }
}

export async function setMessageReadAction(id: string, isRead: boolean) {
  await requireAdmin();
  await setMessageRead(id, isRead);
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await deleteMessage(id);
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}
