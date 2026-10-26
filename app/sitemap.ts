import type { MetadataRoute } from "next";
import { getContentMode, listPosts, listProjects } from "@/lib/data/repository";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/projects", "/about", "/blog", "/certificates", "/contact"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      changeFrequency: "weekly",
      priority: path === "" ? 1 : 0.7,
    }),
  );

  try {
    const mode = await getContentMode();
    if (mode === "unconfigured") return staticRoutes;
    const [projects, posts] = await Promise.all([listProjects("public"), listPosts("public")]);
    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${base}/projects/${project.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...posts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
