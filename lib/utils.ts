import type { BlogPost, Project, ProjectContent, Skill } from "@/types/portfolio";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(value: string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "Date not set";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
    ...options,
  }).format(date);
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(date);
}

export function safeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function safeAssetUrl(value: string | null | undefined) {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.includes("..")) {
    return value;
  }
  return safeExternalUrl(value);
}

export function safeNextPath(value: string | null | undefined, fallback = "/admin") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    total,
    totalPages,
  };
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function matchesQuery(query: string | undefined, parts: Array<string | null | undefined>) {
  const needle = query?.trim().toLowerCase();
  if (!needle) return true;
  return parts.some((part) => part?.toLowerCase().includes(needle));
}

export function emptyProjectContent(): ProjectContent {
  return {
    overview: "",
    problem: "",
    objectives: [],
    target_users: "",
    features: [],
    process: "",
    challenges: [],
    lessons: [],
  };
}

export function normalizeProjectContent(value: unknown): ProjectContent {
  const source = value && typeof value === "object" ? (value as Partial<ProjectContent>) : {};
  const challenges = Array.isArray(source.challenges) ? source.challenges : [];
  return {
    overview: typeof source.overview === "string" ? source.overview : "",
    problem: typeof source.problem === "string" ? source.problem : "",
    objectives: stringList(source.objectives),
    target_users: typeof source.target_users === "string" ? source.target_users : "",
    features: stringList(source.features),
    process: typeof source.process === "string" ? source.process : "",
    challenges: challenges
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const challenge = "challenge" in item && typeof item.challenge === "string" ? item.challenge : "";
        const solution = "solution" in item && typeof item.solution === "string" ? item.solution : "";
        if (!challenge && !solution) return null;
        return { challenge, solution };
      })
      .filter((item): item is { challenge: string; solution: string } => Boolean(item)),
    lessons: stringList(source.lessons),
  };
}

export function stringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function linesToGallery(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, ...alt] = line.split("|");
      return { url: url.trim(), alt: alt.join("|").trim() || "Project image" };
    })
    .filter((image) => safeAssetUrl(image.url));
}

export function galleryToLines(images: { url: string; alt: string }[]) {
  return images.map((image) => (image.alt ? `${image.url} | ${image.alt}` : image.url)).join("\n");
}

export function skillGroups(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return groups;
}

export function relatedProjects(projects: Project[], current: Project, limit = 2) {
  const sameCategory = projects.filter((project) => project.id !== current.id && project.category === current.category);
  const others = projects.filter((project) => project.id !== current.id && project.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function relatedPosts(posts: BlogPost[], current: BlogPost, limit = 3) {
  const sameCategory = posts.filter((post) => post.id !== current.id && post.category === current.category);
  const others = posts.filter((post) => post.id !== current.id && post.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function rethrowNavigation(error: unknown): void {
  if (error && typeof error === "object" && "digest" in error) {
    const digest = String((error as { digest?: unknown }).digest ?? "");
    if (digest.includes("NEXT_")) throw error;
  }
}

export async function loadPage<T>(loader: () => Promise<T>): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    return { ok: true, data: await loader() };
  } catch (error) {
    rethrowNavigation(error);
    console.error(error);
    return { ok: false };
  }
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "MD";
}
