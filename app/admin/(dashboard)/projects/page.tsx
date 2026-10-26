import { ProjectsManager } from "@/components/admin/ContentManager";
import { listProjects } from "@/lib/data/repository";

export default async function AdminProjectsPage() {
  const projects = await listProjects("admin");
  return (
    <div>
      <h1 className="text-3xl font-semibold text-heading">Projects</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Drafts stay hidden on the public site until you publish them.</p>
      <ProjectsManager projects={projects} />
    </div>
  );
}
