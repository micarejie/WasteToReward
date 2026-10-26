import type { Metadata } from "next";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { Pagination, queryHref } from "@/components/Pagination";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFilters } from "@/components/ProjectFilters";
import { getContentMode, listProjects } from "@/lib/data/repository";
import { PAGE_SIZE } from "@/lib/site";
import { container } from "@/lib/styles";
import { loadPage, matchesQuery, paginate, uniqueSorted } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Student projects with the problem, the build, and the technologies used.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tech?: string; page?: string }>;
}) {
  const params = await searchParams;
  const loaded = await loadPage(async () => {
    const mode = await getContentMode();
    const projects = await listProjects("public");
    return { mode, projects };
  });
  if (!loaded.ok) return <ErrorState title="Projects could not be loaded." />;
  const { mode, projects } = loaded.data;
  if (mode === "unconfigured") {
      return (
        <div className={`${container} py-16`}>
          <EmptyState title="Projects will load from Supabase." body="Connect the database to show published work here." />
        </div>
      );
    }
    const filtered = projects.filter((project) => {
      if (params.category && project.category !== params.category) return false;
      if (params.tech && !project.tech_stack.includes(params.tech)) return false;
      return matchesQuery(params.q, [project.title, project.description, project.category, ...project.tech_stack]);
    });
    const page = Number(params.page || "1");
    const result = paginate(filtered, Number.isFinite(page) ? page : 1, PAGE_SIZE);
    const categories = uniqueSorted(projects.map((project) => project.category));
    const technologies = uniqueSorted(projects.flatMap((project) => project.tech_stack));

    return (
      <div className={`${container} py-14`}>
        <p className="text-sm font-medium text-primary">Work</p>
        <h1 className="mt-2 text-4xl font-semibold text-heading">Projects</h1>
        <p className="mt-3 max-w-2xl text-muted">A collection of applications and exercises. Open a project for the problem, the process, and what I learned.</p>
        <div className="mt-8">
          <ProjectFilters categories={categories} technologies={technologies} values={params} />
        </div>
        {result.total === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No projects match"
              body="Try another keyword, or clear the filters to see everything that is published."
              actionHref="/projects"
              actionLabel="Clear filters"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          hrefFor={(pageNumber) => queryHref("/projects", { q: params.q, category: params.category, tech: params.tech }, pageNumber)}
        />
      </div>
    );
}
