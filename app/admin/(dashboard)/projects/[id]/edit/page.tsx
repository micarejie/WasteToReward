import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/data/repository";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const project = await getProjectById(id);
  if (!project) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">Edit project</h1>
      <ProjectForm project={project} justSaved={query.saved === "1"} />
    </div>
  );
}
