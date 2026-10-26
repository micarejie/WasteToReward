"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadField } from "@/components/admin/UploadField";
import { saveProfileAction, type ActionState } from "@/lib/actions/content";
import { field, labelClass, primaryButton, secondaryButton } from "@/lib/styles";
import { skillCategories, skillLevels, type EducationItem, type Profile, type Skill } from "@/types/portfolio";

const initial: ActionState = {};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initial);
  const [skills, setSkills] = useState<Skill[]>(profile.skills);
  const [education, setEducation] = useState<EducationItem[]>(profile.education);

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  function updateSkill(index: number, patch: Partial<Skill>) {
    setSkills((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function updateEducation(index: number, patch: Partial<EducationItem>) {
    setEducation((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <form action={formAction} className="grid max-w-3xl gap-5">
      <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-heading">
        Replace the sample name, photo, school, email, and links with your own before you submit or deploy this site.
      </p>
      <input type="hidden" name="skills_json" value={JSON.stringify(skills.filter((skill) => skill.name.trim()))} />
      <input
        type="hidden"
        name="education_json"
        value={JSON.stringify(education.filter((item) => item.school.trim() && item.credential.trim()))}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Text name="full_name" label="Full name" defaultValue={profile.full_name} required />
        <Text name="headline" label="Headline" defaultValue={profile.headline} />
        <label className="md:col-span-2">
          <span className={labelClass}>Rotating roles, one per line</span>
          <textarea className={field} name="roles" defaultValue={(profile.roles ?? []).join("\n")} placeholder={"an IT Student\na Web Developer"} />
        </label>
        <Text name="tagline" label="Tagline" defaultValue={profile.tagline} />
        <Text name="motto" label="Short motto" defaultValue={profile.motto} />
        <Text name="email" label="Email" defaultValue={profile.email} type="email" required />
        <Text name="location" label="Location" defaultValue={profile.location ?? ""} />
        <Text name="github_url" label="GitHub URL" defaultValue={profile.github_url} />
        <Text name="linkedin_url" label="LinkedIn URL" defaultValue={profile.linkedin_url} />
      </div>
      <label>
        <span className={labelClass}>Bio</span>
        <textarea className={`${field} min-h-32`} name="bio" defaultValue={profile.bio} />
      </label>
      <label>
        <span className={labelClass}>Career goals</span>
        <textarea className={field} name="career_goals" defaultValue={profile.career_goals} />
      </label>
      <label>
        <span className={labelClass}>Interests, one per line</span>
        <textarea className={field} name="interests" defaultValue={profile.interests.join("\n")} />
      </label>
      <label>
        <span className={labelClass}>Strengths, one per line</span>
        <textarea className={field} name="strengths" defaultValue={profile.strengths.join("\n")} />
      </label>
      <UploadField label="Profile photo" name="avatar_url" bucket="avatars" defaultValue={profile.avatar_url} accept="image/jpeg,image/png,image/webp,image/gif" />
      <UploadField label="Resume PDF" name="resume_url" bucket="resumes" defaultValue={profile.resume_url} accept="application/pdf" />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-heading">Skills</legend>
        {skills.map((skill, index) => (
          <div key={`${skill.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_1fr_10rem_auto]">
            <input className={field} value={skill.name} aria-label="Skill name" onChange={(event) => updateSkill(index, { name: event.target.value })} />
            <select className={field} value={skill.category} aria-label="Skill category" onChange={(event) => updateSkill(index, { category: event.target.value as Skill["category"] })}>
              {skillCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <select className={field} value={skill.level ?? ""} aria-label="Skill level" onChange={(event) => updateSkill(index, { level: (event.target.value || undefined) as Skill["level"] })}>
              <option value="">No level</option>
              {skillLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
            <button type="button" className={secondaryButton} onClick={() => setSkills((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className={secondaryButton}
          onClick={() => setSkills((items) => [...items, { name: "", category: "Frontend Development", level: "Learning" }])}
        >
          Add skill
        </button>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-heading">Education</legend>
        {education.map((item, index) => (
          <div key={`${item.credential}-${index}`} className="grid gap-2 rounded-3xl border border-border p-4">
            <input className={field} value={item.credential} aria-label="Credential" onChange={(event) => updateEducation(index, { credential: event.target.value })} />
            <input className={field} value={item.school} aria-label="School" onChange={(event) => updateEducation(index, { school: event.target.value })} />
            <div className="grid gap-2 md:grid-cols-3">
              <input className={field} value={item.period} aria-label="Period" onChange={(event) => updateEducation(index, { period: event.target.value })} />
              <input className={field} value={item.location ?? ""} aria-label="Location" onChange={(event) => updateEducation(index, { location: event.target.value })} />
              <select className={field} value={item.status} aria-label="Status" onChange={(event) => updateEducation(index, { status: event.target.value as EducationItem["status"] })}>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>
            <textarea className={field} value={item.details} aria-label="Details" onChange={(event) => updateEducation(index, { details: event.target.value })} />
            <button type="button" className={secondaryButton} onClick={() => setEducation((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
              Remove entry
            </button>
          </div>
        ))}
        <button
          type="button"
          className={secondaryButton}
          onClick={() =>
            setEducation((items) => [
              ...items,
              { school: "", credential: "", period: "", location: "", details: "", status: "In progress" },
            ])
          }
        >
          Add education
        </button>
      </fieldset>

      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-heading">{state.success}</p> : null}
      <button className={primaryButton} type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function Text({
  name,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      <input className={field} name={name} type={type} defaultValue={defaultValue} required={required} />
    </label>
  );
}
