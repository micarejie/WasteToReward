"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { UploadField } from "@/components/admin/UploadField";
import { saveProjectAction, type ActionState } from "@/lib/actions/content";
import { field, labelClass, primaryButton } from "@/lib/styles";
import { galleryToLines } from "@/lib/utils";
import { projectStatuses } from "@/types/portfolio";
import type { Project } from "@/types/portfolio";

const initial: ActionState = {};

export function ProjectForm({ project, justSaved = false }: { project?: Project; justSaved?: boolean }) {
  const action = saveProjectAction.bind(null, project?.id ?? null);
  const [state, formAction, pending] = useActionState(action, initial);

  useEffect(() => {
    if (justSaved) toast.success("Project created.");
  }, [justSaved]);
  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>Title</span>
          <input className={field} name="title" defaultValue={project?.title} required />
        </label>
        <label>
          <span className={labelClass}>Slug</span>
          <input className={field} name="slug" defaultValue={project?.slug} placeholder="generated from the title if empty" />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Short description</span>
          <textarea className={field} name="description" defaultValue={project?.description} required />
        </label>
        <label>
          <span className={labelClass}>Category</span>
          <input className={field} name="category" defaultValue={project?.category} required />
        </label>
        <label>
          <span className={labelClass}>Status</span>
          <select className={field} name="status" defaultValue={project?.status ?? "In progress"}>
            {projectStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Technologies, separated by commas</span>
          <input className={field} name="tech_stack" defaultValue={project?.tech_stack.join(", ")} />
        </label>
      </div>
      <UploadField label="Cover image" name="image_url" bucket="projects" defaultValue={project?.image_url} accept="image/jpeg,image/png,image/webp,image/gif" />
      <label>
        <span className={labelClass}>Gallery, one image per line as URL | alt text</span>
        <textarea className={`${field} min-h-24`} name="gallery" defaultValue={project ? galleryToLines(project.gallery) : ""} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className={labelClass}>Live demo URL</span>
          <input className={field} name="demo_url" defaultValue={project?.demo_url ?? ""} />
        </label>
        <label>
          <span className={labelClass}>GitHub URL</span>
          <input className={field} name="github_url" defaultValue={project?.github_url ?? ""} />
        </label>
      </div>
      <label>
        <span className={labelClass}>Overview</span>
        <textarea className={`${field} min-h-28`} name="overview" defaultValue={project?.content.overview} />
      </label>
      <label>
        <span className={labelClass}>Problem statement</span>
        <textarea className={`${field} min-h-28`} name="problem" defaultValue={project?.content.problem} />
      </label>
      <label>
        <span className={labelClass}>Objectives, one per line</span>
        <textarea className={field} name="objectives" defaultValue={project?.content.objectives.join("\n")} />
      </label>
      <label>
        <span className={labelClass}>Target users</span>
        <textarea className={field} name="target_users" defaultValue={project?.content.target_users} />
      </label>
      <label>
        <span className={labelClass}>Features, one per line</span>
        <textarea className={field} name="features" defaultValue={project?.content.features.join("\n")} />
      </label>
      <label>
        <span className={labelClass}>Development process</span>
        <textarea className={`${field} min-h-28`} name="process" defaultValue={project?.content.process} />
      </label>
      <label>
        <span className={labelClass}>Challenges, one per line as challenge | solution</span>
        <textarea
          className={`${field} min-h-28`}
          name="challenges"
          defaultValue={project?.content.challenges.map((item) => `${item.challenge} | ${item.solution}`).join("\n")}
        />
      </label>
      <label>
        <span className={labelClass}>Lessons learned, one per line</span>
        <textarea className={field} name="lessons" defaultValue={project?.content.lessons.join("\n")} />
      </label>
      <div className="flex gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} /> Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={project?.published} /> Published
        </label>
      </div>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-heading">{state.success}</p> : null}
      <button className={primaryButton} type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save project"}
      </button>
    </form>
  );
}
