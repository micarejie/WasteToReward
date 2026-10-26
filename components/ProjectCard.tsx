import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { Project } from "@/types/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  const image = safeAssetUrl(project.image_url);
  const demo = safeExternalUrl(project.demo_url) ?? (project.demo_url?.startsWith("/") ? project.demo_url : null);
  const github = safeExternalUrl(project.github_url);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card motion-safe:transition motion-safe:hover:-translate-y-0.5">
      <div className="relative aspect-[16/10] bg-primary-soft">
        {image ? (
          // Admin-provided files can be SVG or remote storage URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : null}
        {project.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-medium text-heading">
            Featured
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-heading">{project.category}</span>
          <span>{project.status}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-heading">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <li key={tech} className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-heading hover:underline">
            View details
          </Link>
          <div className="flex items-center gap-2">
            {demo ? (
              <a href={demo} className="text-muted hover:text-heading" target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`}>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {github ? (
              <a href={github} className="text-muted hover:text-heading" target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`}>
                <GithubIcon className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
