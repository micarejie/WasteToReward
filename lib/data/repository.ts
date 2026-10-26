import "server-only";

import { connection } from "next/server";
import type {
  BlogPost,
  Certificate,
  ContactMessage,
  EducationItem,
  Profile,
  Project,
  ProjectStatus,
  Skill,
  SkillCategory,
  SkillLevel,
} from "@/types/portfolio";
import { projectStatuses, skillCategories, skillLevels } from "@/types/portfolio";
import { requireAdmin } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo/mode";
import { demoState, updateDemo } from "@/lib/demo/store";
import { isSupabaseConfigured } from "@/lib/site";
import { createAnonClient, createClient } from "@/lib/supabase/server";
import { normalizeProjectContent, stringList } from "@/lib/utils";
import type { z } from "zod";
import type { blogSchema, certificateSchema, profileSchema, projectSchema } from "@/lib/validations";

export type ProjectInput = z.infer<typeof projectSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

export type ContentMode = "supabase" | "demo" | "unconfigured";

export async function getContentMode(): Promise<ContentMode> {
  await connection();
  if (isSupabaseConfigured()) return "supabase";
  if (isDemoMode()) return "demo";
  return "unconfigured";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function normalizeSkills(value: unknown): Skill[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const name = asString(record.name).trim();
    const category = record.category;
    if (!name || typeof category !== "string" || !skillCategories.includes(category as SkillCategory)) return [];
    const level = skillLevels.includes(record.level as SkillLevel) ? (record.level as SkillLevel) : undefined;
    return [{ name, category: category as SkillCategory, level }];
  });
}

function normalizeEducation(value: unknown): EducationItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const school = asString(record.school).trim();
    const credential = asString(record.credential).trim();
    if (!school || !credential) return [];
    const status = record.status === "Completed" ? "Completed" : "In progress";
    return [
      {
        school,
        credential,
        period: asString(record.period, "In progress"),
        location: asNullableString(record.location) ?? undefined,
        details: asString(record.details),
        status,
      },
    ];
  });
}

function normalizeGallery(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const url = asString(record.url).trim();
    if (!url) return [];
    return [{ url, alt: asString(record.alt, "Project image") }];
  });
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: asString(row.id),
    full_name: asString(row.full_name),
    headline: asString(row.headline),
    tagline: asString(row.tagline),
    motto: asString(row.motto),
    bio: asString(row.bio),
    email: asString(row.email),
    avatar_url: asString(row.avatar_url),
    resume_url: asString(row.resume_url),
    github_url: asString(row.github_url),
    linkedin_url: asString(row.linkedin_url),
    location: asNullableString(row.location),
    interests: stringList(row.interests),
    strengths: stringList(row.strengths),
    career_goals: asString(row.career_goals),
    skills: normalizeSkills(row.skills),
    education: normalizeEducation(row.education),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function mapProject(row: Record<string, unknown>): Project {
  const status = projectStatuses.includes(row.status as ProjectStatus)
    ? (row.status as ProjectStatus)
    : "In progress";
  return {
    id: asString(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    description: asString(row.description),
    content: normalizeProjectContent(row.content),
    category: asString(row.category),
    status,
    tech_stack: stringList(row.tech_stack),
    image_url: asString(row.image_url),
    gallery: normalizeGallery(row.gallery),
    demo_url: asNullableString(row.demo_url),
    github_url: asNullableString(row.github_url),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function mapPost(row: Record<string, unknown>): BlogPost {
  return {
    id: asString(row.id),
    title: asString(row.title),
    slug: asString(row.slug),
    excerpt: asString(row.excerpt),
    content: asString(row.content),
    cover_image_url: asString(row.cover_image_url),
    category: asString(row.category),
    tags: stringList(row.tags),
    published: Boolean(row.published),
    published_at: asNullableString(row.published_at),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function mapCertificate(row: Record<string, unknown>): Certificate {
  return {
    id: asString(row.id),
    title: asString(row.title),
    issuer: asString(row.issuer),
    description: asString(row.description),
    date_earned: asNullableString(row.date_earned),
    image_url: asString(row.image_url),
    credential_url: asNullableString(row.credential_url),
    featured: Boolean(row.featured),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function mapMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: asString(row.id),
    name: asString(row.name),
    email: asString(row.email),
    subject: asString(row.subject),
    message: asString(row.message),
    is_read: Boolean(row.is_read),
    created_at: asString(row.created_at),
  };
}

async function reader(scope: "public" | "admin") {
  return scope === "admin" ? createClient() : createAnonClient();
}

export async function getProfile() {
  const mode = await getContentMode();
  if (mode === "demo") return demoState().profile;
  if (mode === "unconfigured") return null;
  const supabase = createAnonClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapProfile(data as Record<string, unknown>) : null;
}

export async function listProjects(scope: "public" | "admin" = "public") {
  if (scope === "admin") await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    const projects = demoState().projects;
    return scope === "public" ? projects.filter((project) => project.published) : projects;
  }
  if (mode === "unconfigured") return [];
  const supabase = await reader(scope);
  const base = supabase.from("projects").select("*");
  const filtered = scope === "public" ? base.eq("published", true) : base;
  const { data, error } = await filtered.order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapProject(row as Record<string, unknown>));
}

export async function getProjectBySlug(slug: string) {
  const projects = await listProjects("public");
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectById(id: string) {
  const projects = await listProjects("admin");
  return projects.find((project) => project.id === id) ?? null;
}

export async function listPosts(scope: "public" | "admin" = "public") {
  if (scope === "admin") await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    const posts = demoState().posts;
    return scope === "public" ? posts.filter((post) => post.published) : posts;
  }
  if (mode === "unconfigured") return [];
  const supabase = await reader(scope);
  const base = supabase.from("blog_posts").select("*");
  const filtered = scope === "public" ? base.eq("published", true) : base;
  const { data, error } = await filtered.order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}

export async function getPostBySlug(slug: string) {
  const posts = await listPosts("public");
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostById(id: string) {
  const posts = await listPosts("admin");
  return posts.find((post) => post.id === id) ?? null;
}

export async function listCertificates() {
  const mode = await getContentMode();
  if (mode === "demo") return demoState().certificates;
  if (mode === "unconfigured") return [];
  const supabase = createAnonClient();
  const { data, error } = await supabase.from("certificates").select("*").order("date_earned", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapCertificate(row as Record<string, unknown>));
}

export async function getCertificateById(id: string) {
  const certificates = await listCertificates();
  return certificates.find((certificate) => certificate.id === id) ?? null;
}

export async function listMessages() {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") return demoState().messages;
  if (mode === "unconfigured") return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapMessage(row as Record<string, unknown>));
}

function projectRecord(input: ProjectInput, existing?: Project): Project {
  const timestamp = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    title: input.title,
    slug: input.slug,
    description: input.description,
    category: input.category,
    status: input.status,
    tech_stack: input.tech_stack,
    image_url: input.image_url ?? "",
    gallery: input.gallery,
    demo_url: input.demo_url,
    github_url: input.github_url,
    featured: input.featured,
    published: input.published,
    content: {
      overview: input.overview,
      problem: input.problem,
      objectives: input.objectives,
      target_users: input.target_users,
      features: input.features,
      process: input.process,
      challenges: input.challenges,
      lessons: input.lessons,
    },
    created_at: existing?.created_at ?? timestamp,
    updated_at: timestamp,
  };
}

function postRecord(input: BlogInput, existing?: BlogPost): BlogPost {
  const timestamp = new Date().toISOString();
  const publishedAt = input.published ? existing?.published_at ?? timestamp : existing?.published_at ?? null;
  return {
    id: existing?.id ?? crypto.randomUUID(),
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    cover_image_url: input.cover_image_url ?? "",
    category: input.category,
    tags: input.tags,
    published: input.published,
    published_at: publishedAt,
    created_at: existing?.created_at ?? timestamp,
    updated_at: timestamp,
  };
}

function certificateRecord(input: CertificateInput, existing?: Certificate): Certificate {
  const timestamp = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    title: input.title,
    issuer: input.issuer,
    description: input.description,
    date_earned: input.date_earned,
    image_url: input.image_url ?? "",
    credential_url: input.credential_url,
    featured: input.featured,
    created_at: existing?.created_at ?? timestamp,
    updated_at: timestamp,
  };
}

function profileRecord(input: ProfileInput, existing: Profile | null): Profile {
  const timestamp = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    full_name: input.full_name,
    headline: input.headline,
    tagline: input.tagline,
    motto: input.motto,
    bio: input.bio,
    email: input.email,
    avatar_url: input.avatar_url ?? "",
    resume_url: input.resume_url ?? "",
    github_url: input.github_url ?? "",
    linkedin_url: input.linkedin_url ?? "",
    location: input.location,
    interests: input.interests,
    strengths: input.strengths,
    career_goals: input.career_goals,
    skills: input.skills,
    education: input.education,
    created_at: existing?.created_at ?? timestamp,
    updated_at: timestamp,
  };
}

async function assertUniqueSlug(kind: "project" | "post", slug: string, id?: string) {
  const rows = kind === "project" ? await listProjects("admin") : await listPosts("admin");
  if (rows.some((row) => row.slug === slug && row.id !== id)) {
    throw new Error("That slug is already in use. Choose another one.");
  }
}

export async function saveProject(input: ProjectInput, id?: string) {
  await requireAdmin();
  const existing = id ? await getProjectById(id) : null;
  if (id && !existing) throw new Error("That project could not be found.");
  await assertUniqueSlug("project", input.slug, id);
  const record = projectRecord(input, existing ?? undefined);
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      const index = state.projects.findIndex((project) => project.id === record.id);
      if (index >= 0) state.projects[index] = record;
      else state.projects.unshift(record);
    });
    return record;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").upsert(record).select("*").single();
  if (error) throw new Error(error.message);
  return mapProject(data as Record<string, unknown>);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      state.projects = state.projects.filter((project) => project.id !== id);
    });
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function savePost(input: BlogInput, id?: string) {
  await requireAdmin();
  const existing = id ? await getPostById(id) : null;
  if (id && !existing) throw new Error("That article could not be found.");
  await assertUniqueSlug("post", input.slug, id);
  const record = postRecord(input, existing ?? undefined);
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      const index = state.posts.findIndex((post) => post.id === record.id);
      if (index >= 0) state.posts[index] = record;
      else state.posts.unshift(record);
    });
    return record;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").upsert(record).select("*").single();
  if (error) throw new Error(error.message);
  return mapPost(data as Record<string, unknown>);
}

export async function deletePost(id: string) {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      state.posts = state.posts.filter((post) => post.id !== id);
    });
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function saveCertificate(input: CertificateInput, id?: string) {
  await requireAdmin();
  const existing = id ? await getCertificateById(id) : null;
  if (id && !existing) throw new Error("That certificate could not be found.");
  const record = certificateRecord(input, existing ?? undefined);
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      const index = state.certificates.findIndex((item) => item.id === record.id);
      if (index >= 0) state.certificates[index] = record;
      else state.certificates.unshift(record);
    });
    return record;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("certificates").upsert(record).select("*").single();
  if (error) throw new Error(error.message);
  return mapCertificate(data as Record<string, unknown>);
}

export async function deleteCertificate(id: string) {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      state.certificates = state.certificates.filter((item) => item.id !== id);
    });
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function saveProfile(input: ProfileInput) {
  await requireAdmin();
  const existing = await getProfile();
  const record = profileRecord(input, existing);
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      state.profile = record;
    });
    return record;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").upsert(record).select("*").single();
  if (error) throw new Error(error.message);
  return mapProfile(data as Record<string, unknown>);
}

export async function insertMessage(input: { name: string; email: string; subject: string; message: string }) {
  const mode = await getContentMode();
  const record: ContactMessage = {
    id: crypto.randomUUID(),
    ...input,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  if (mode === "demo") {
    updateDemo((state) => {
      state.messages.unshift(record);
    });
    return;
  }
  if (mode === "unconfigured") {
    throw new Error("The contact form is not connected to a database yet.");
  }
  const supabase = createAnonClient();
  const { error } = await supabase.from("messages").insert({
    name: record.name,
    email: record.email,
    subject: record.subject,
    message: record.message,
    is_read: false,
  });
  if (error) throw new Error(error.message);
}

export async function setMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      const message = state.messages.find((item) => item.id === id);
      if (message) message.is_read = isRead;
    });
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const mode = await getContentMode();
  if (mode === "demo") {
    updateDemo((state) => {
      state.messages = state.messages.filter((item) => item.id !== id);
    });
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
