"use client";

import { Search } from "lucide-react";
import { field, secondaryButton } from "@/lib/styles";

export function ProjectFilters({
  categories,
  technologies,
  values,
}: {
  categories: string[];
  technologies: string[];
  values: { q?: string; category?: string; tech?: string };
}) {
  return (
    <form action="/projects" method="get" className="grid gap-3 rounded-3xl border border-border bg-surface p-4 md:grid-cols-[1fr_12rem_12rem_auto]">
      <label className="relative block">
        <span className="sr-only">Search by title or description</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input className={`${field} pl-11`} name="q" defaultValue={values.q ?? ""} placeholder="Search projects" />
      </label>
      <label>
        <span className="sr-only">Filter by category</span>
        <select className={field} name="category" defaultValue={values.category ?? ""}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Filter by technology</span>
        <select className={field} name="tech" defaultValue={values.tech ?? ""}>
          <option value="">All technologies</option>
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </label>
      <button className={secondaryButton} type="submit">
        Apply
      </button>
    </form>
  );
}

export function BlogFilters({
  categories,
  values,
}: {
  categories: string[];
  values: { q?: string; category?: string };
}) {
  return (
    <form action="/blog" method="get" className="grid gap-3 rounded-3xl border border-border bg-surface p-4 md:grid-cols-[1fr_12rem_auto]">
      <label className="relative block">
        <span className="sr-only">Search articles</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input className={`${field} pl-11`} name="q" defaultValue={values.q ?? ""} placeholder="Search articles" />
      </label>
      <label>
        <span className="sr-only">Filter by category</span>
        <select className={field} name="category" defaultValue={values.category ?? ""}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <button className={secondaryButton} type="submit">
        Apply
      </button>
    </form>
  );
}
