import { skillCategories } from "@/types/portfolio";
import type { Skill } from "@/types/portfolio";
import { skillGroups } from "@/lib/utils";

export function Skills({ skills, compact = false }: { skills: Skill[]; compact?: boolean }) {
  const groups = skillGroups(skills);
  const categories = skillCategories.filter((category) => groups.has(category));
  if (!categories.length) {
    return <p className="text-sm text-muted">Skills you add to the profile will appear here.</p>;
  }

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-4 sm:grid-cols-2"}>
      {compact
        ? skills.slice(0, 10).map((skill) => (
            <span key={`${skill.category}-${skill.name}`} className="rounded-full bg-primary-soft px-3 py-1.5 text-sm text-heading">
              {skill.name}
            </span>
          ))
        : categories.map((category) => (
            <section key={category} className="rounded-3xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-heading">{category}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {groups.get(category)?.map((skill) => (
                  <li key={skill.name} className="rounded-full border border-border px-3 py-1.5 text-sm">
                    <span className="text-foreground">{skill.name}</span>
                    {skill.level ? <span className="text-muted"> · {skill.level}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
    </div>
  );
}
