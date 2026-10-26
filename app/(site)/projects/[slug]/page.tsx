import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { ErrorState } from "@/components/ErrorState";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectBySlug, listProjects } from "@/lib/data/repository";
import { container, secondaryButton } from "@/lib/styles";
import { loadPage, relatedProjects, safeAssetUrl, safeExternalUrl } from "@/lib/utils";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: project.image_url ? { images: [project.image_url] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const loaded = await loadPage(async () => {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return null;
    const projects = await listProjects("public");
    return { project, related: relatedProjects(projects, project) };
  });
  if (!loaded.ok) return <ErrorState title="This project could not be loaded." />;
  if (!loaded.data) notFound();
  const { project, related } = loaded.data;
  const content = project.content;
  const image = safeAssetUrl(project.image_url);
  const demo = safeExternalUrl(project.demo_url);
  const github = safeExternalUrl(project.github_url);

  return (
      <article className={`${container} py-14`}>
        <p className="text-sm text-muted">
          <Link href="/projects" className="hover:text-heading">
            Projects
          </Link>{" "}
          / {project.category}
        </p>
        <h1 className="section-title mt-3 max-w-3xl">{project.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-heading">{project.status}</span>
          {project.tech_stack.map((tech) => (
            <span key={tech} className="rounded-full border border-border px-3 py-1">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {demo ? (
            <a className={secondaryButton} href={demo} target="_blank" rel="noreferrer">
              Live demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
          {github ? (
            <a className={secondaryButton} href={github} target="_blank" rel="noreferrer">
              <GithubIcon className="h-4 w-4" /> Repository
            </a>
          ) : null}
        </div>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={`${project.title} cover`} className="mt-8 aspect-[16/8] w-full rounded-3xl border border-border object-cover" />
        ) : null}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            <Section title="Overview" body={content.overview} />
            <Section title="Problem statement" body={content.problem} />
            <ListSection title="Project objectives" items={content.objectives} />
            <Section title="Target users" body={content.target_users} />
            <ListSection title="Features and functionality" items={content.features} />
            <Section title="Development process" body={content.process} />
            {content.challenges.length ? (
              <section>
                <h2 className="text-2xl font-semibold text-heading">Challenges and solutions</h2>
                <div className="mt-4 space-y-4">
                  {content.challenges.map((item) => (
                    <div key={item.challenge} className="rounded-3xl border border-border bg-surface p-5">
                      <h3 className="font-medium text-heading">{item.challenge}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.solution}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            <ListSection title="Lessons learned" items={content.lessons} />
          </div>
          <aside className="h-fit rounded-3xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-heading">Technologies used</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {project.tech_stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </aside>
        </div>
        {project.gallery.length ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-heading">Gallery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((image) => (
                <a key={image.url} href={safeAssetUrl(image.url) ?? image.url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={safeAssetUrl(image.url) ?? ""} alt={image.alt} className="aspect-video w-full rounded-3xl border border-border object-cover" />
                </a>
              ))}
            </div>
          </section>
        ) : null}
        {related.length ? (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-heading">Related projects</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="text-2xl font-semibold text-heading">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{body}</p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-2xl font-semibold text-heading">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
