export const PAGE_SIZE = 6;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
] as const;

export const storageBuckets = ["avatars", "projects", "blog", "certificates", "resumes"] as const;
export type StorageBucket = (typeof storageBuckets)[number];

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return value.replace(/\/$/, "");
}

export function supabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

export function supabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
}

/** True when URL + key exist. Does not prove the URL is a live Supabase project. */
export function isSupabaseConfigured() {
  const url = supabaseUrl();
  if (!url || !supabaseKey()) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Heuristic for common misconfiguration: pointing the app at the site itself
 * (or another HTML host) instead of the Supabase API origin.
 */
export function supabaseUrlLooksLikeProjectApi() {
  const url = supabaseUrl();
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return false;
    if (host.endsWith(".supabase.co") || host.endsWith(".supabase.in")) return true;
    // Custom Supabase domains are allowed; reject only obvious website hosts.
    if (host.endsWith(".vercel.app") || host.endsWith(".netlify.app") || host.endsWith(".github.io")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
