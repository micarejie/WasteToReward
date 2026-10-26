import type { EducationItem } from "@/types/portfolio";

export function EducationTimeline({ items }: { items: EducationItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted">Add your education from the profile dashboard.</p>;
  }

  return (
    <ol className="space-y-6 border-l border-border pl-6">
      {items.map((item) => (
        <li key={`${item.credential}-${item.school}`} className="relative">
          <span className="absolute -left-[1.7rem] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-surface" aria-hidden="true" />
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{item.status}</p>
          <h3 className="mt-1 text-lg font-semibold text-heading">{item.credential}</h3>
          <p className="text-sm text-foreground">{item.school}</p>
          <p className="mt-1 text-sm text-muted">
            {item.period}
            {item.location ? ` · ${item.location}` : ""}
          </p>
          {item.details ? <p className="mt-2 text-sm leading-6 text-muted">{item.details}</p> : null}
        </li>
      ))}
    </ol>
  );
}
