"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { ContactForm } from "@/components/ContactForm";
import { safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { BlogPost, Certificate, Profile, Project } from "@/types/portfolio";

export function HomeExperience({
  profile,
  projects,
  certificates,
  posts,
}: {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  posts: BlogPost[];
}) {
  const roles = useMemo(
    () => (profile.roles?.length ? profile.roles : ["an IT Student", "a Web Developer"]),
    [profile.roles],
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [academic, setAcademic] = useState(0);
  const [experience, setExperience] = useState(0);
  const experienceGroups = useMemo(() => {
    const groups = new Map<string, BlogPost[]>();
    for (const post of posts) {
      const category = post.category || "Notes";
      const items = groups.get(category) ?? [];
      items.push(post);
      groups.set(category, items);
    }
    return [...groups.entries()].map(([category, items]) => ({ category, items }));
  }, [posts]);
  const skills = useMemo(() => {
    const seen = new Set<string>();
    return profile.skills.filter((skill) => {
      const key = skill.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [profile.skills]);
  const [skillIndex, setSkillIndex] = useState(0);
  const portrait = safeAssetUrl(profile.avatar_url);
  const resume = safeAssetUrl(profile.resume_url);
  const github = safeExternalUrl(profile.github_url);
  const linkedin = safeExternalUrl(profile.linkedin_url);
  const [first, ...rest] = profile.full_name.split(" ");
  const last = rest.join(" ");
  const paragraphs = profile.bio.split(/(?<=\.)\s+/).filter(Boolean);

  const academics = [
    ...profile.education.map((item) => ({
      title: item.credential,
      body: [
        [item.school, item.period, item.location].filter(Boolean).join(" · "),
        item.details,
      ]
        .filter(Boolean)
        .join("\n"),
    })),
    profile.career_goals ? { title: "Career goals", body: profile.career_goals } : null,
    profile.interests.length ? { title: "Interests", body: profile.interests.join(", ") } : null,
  ].filter((item): item is { title: string; body: string } => Boolean(item));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setTyped(roles[0] ?? ""), 0);
      return () => window.clearTimeout(timer);
    }
    const word = roles[roleIndex] ?? "";
    if (typed.length < word.length) {
      const timer = window.setTimeout(() => setTyped(word.slice(0, typed.length + 1)), 90);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setTyped("");
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [roles, roleIndex, typed]);

  return (
    <div>
      <section id="home" className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-heading sm:text-6xl">
            Hi, I&apos;m <span className="text-gradient">{first}</span> {last ? <span className="text-gradient">{last}</span> : null}
          </h1>
          <p className="mt-6 min-h-10 text-2xl font-medium text-heading">
            I am <span className="text-gradient">{typed}</span>
            <span className="ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-primary" aria-hidden="true" />
          </p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">{profile.tagline || profile.headline}</p>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">{profile.motto}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgb(139_92_246_/_0.55)]">
              View My Work
            </a>
            <a href="#contact" className="rounded-full border border-primary/80 px-6 py-3 text-sm font-semibold text-heading">
              Let&apos;s Talk
            </a>
          </div>
        </div>
        {portrait ? (
          <div className="glow-frame mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt={`Portrait of ${profile.full_name}`} className="h-full w-full object-cover" />
          </div>
        ) : null}
      </section>

      <section id="about" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        {portrait ? (
          <div className="glow-frame mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div>
          <h2 className="section-title">Introduction</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-foreground/90 sm:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {profile.location ? (
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> {profile.location}
              </li>
            ) : null}
            <li>
              <a className="inline-flex items-center gap-2 hover:text-heading" href={`mailto:${profile.email}`}>
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> {profile.email}
              </a>
            </li>
          </ul>
          {resume ? (
            <a href={resume} download className="mt-6 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white">
              View CV
            </a>
          ) : null}
        </div>
      </section>

      {academics.length ? (
        <section id="academics" className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <h2 className="section-title">My Academic Achievements</h2>
          <p className="mt-3 text-muted">Educational journey and accomplishments</p>
          <div className="mt-10 space-y-3 text-left">
            {academics.map((item, index) => {
              const expanded = academic === index;
              return (
                <div key={item.title} className="rounded-2xl border border-primary/40 bg-surface">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold tracking-wide text-heading"
                    aria-expanded={expanded}
                    onClick={() => setAcademic(expanded ? -1 : index)}
                  >
                    {item.title.toUpperCase()}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded ? <p className="whitespace-pre-line px-5 pb-5 text-sm leading-7 text-muted">{item.body}</p> : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {experienceGroups.length ? (
        <section id="experience" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
          <div className="text-center">
            <h2 className="section-title">Student Experience</h2>
            <p className="mt-3 text-muted">My journey as a developer</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist">
            {experienceGroups.map((group, index) => (
              <button
                key={group.category}
                type="button"
                role="tab"
                aria-selected={experience === index}
                className={`rounded-full px-4 py-2 text-sm ${experience === index ? "bg-primary text-white" : "border border-primary/50 text-heading"}`}
                onClick={() => setExperience(index)}
              >
                {group.category}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-4" role="tabpanel">
            {experienceGroups[experience]?.items.map((post) => (
              <article key={post.id} className="rounded-[2rem] border border-primary/30 bg-surface p-6 sm:p-8">
                <h3 className="text-2xl font-semibold text-gradient">{post.title}</h3>
                <div className="my-4 h-px bg-primary/40" />
                <p className="leading-7 text-muted">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-block text-sm font-medium text-heading hover:underline">
                  Read the note
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="certificates" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="section-title">My Certificates</h2>
          <p className="mt-3 text-muted">Documents you add in the dashboard appear here. Sample cards are not credentials.</p>
        </div>
        {certificates.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => {
              const image = safeAssetUrl(certificate.image_url);
              const credential = safeExternalUrl(certificate.credential_url);
              return (
                <article key={certificate.id} className="rounded-[1.7rem] border border-primary/40 bg-surface p-4">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                  ) : null}
                  <h3 className="mt-4 text-xl font-semibold text-heading">{certificate.title}</h3>
                  <p className="mt-2 text-sm text-muted">Issued by: {certificate.issuer}</p>
                  {certificate.date_earned ? <p className="mt-1 text-sm text-muted">Date: {certificate.date_earned}</p> : null}
                  {certificate.description ? <p className="mt-3 text-sm leading-6 text-muted">{certificate.description}</p> : null}
                  <div className="mt-4 flex gap-3 text-sm">
                    {image ? (
                      <a href={image} target="_blank" rel="noreferrer" className="font-medium text-heading hover:underline">
                        View image
                      </a>
                    ) : null}
                    {credential ? (
                      <a href={credential} target="_blank" rel="noreferrer" className="font-medium text-heading hover:underline">
                        Verify
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted">No certificates yet. Add one from the admin dashboard.</p>
        )}
      </section>

      {skills.length ? (
        <section id="skills" className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8">
          <h2 className="section-title">My Skills</h2>
          <p className="mt-3 text-muted">Technologies and tools I work with</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <button
                key={`${skill.name}-${skill.category}`}
                type="button"
                onClick={() => setSkillIndex(index)}
                className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-sm font-bold text-zinc-900 shadow-card ${skillIndex === index ? "ring-4 ring-primary" : ""}`}
                aria-pressed={skillIndex === index}
              >
                {skill.name.slice(0, 4)}
              </button>
            ))}
          </div>
          <p className="mt-8 text-lg font-semibold text-heading">{skills[skillIndex]?.name}</p>
          <p className="text-sm text-muted">
            {skills[skillIndex]?.category}
            {skills[skillIndex]?.level ? ` · ${skills[skillIndex]?.level}` : ""}
          </p>
        </section>
      ) : null}

      <section id="projects" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <h2 className="section-title">Projects</h2>
          <p className="mt-3 text-muted">Things I&apos;ve built</p>
        </div>
        {projects.length ? (
        <div className="mt-12 space-y-8">
          {projects.map((project) => {
            const image = safeAssetUrl(project.image_url);
            const demo = safeExternalUrl(project.demo_url);
            const repo = safeExternalUrl(project.github_url);
            return (
              <article key={project.id} className="grid items-center gap-6 rounded-[2rem] border border-primary/35 bg-surface p-5 lg:grid-cols-2 lg:p-8">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <div className="flex gap-1.5 bg-zinc-900 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="aspect-video bg-primary-soft" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-bold text-gradient">{project.title}</h3>
                    <span className="rounded-full border border-primary/50 px-3 py-1 text-xs uppercase tracking-wide text-heading">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-4 leading-7 text-muted">
                    <span className="font-semibold text-primary">OVERVIEW: </span>
                    {project.content.overview || project.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <li key={tech} className="rounded-full bg-white/10 px-3 py-1 text-xs text-heading">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-muted">PROJECT LINKS</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {repo ? (
                      <a href={repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-primary/60 px-4 py-2 text-sm">
                        <GithubIcon className="h-4 w-4" /> GitHub
                      </a>
                    ) : null}
                    {demo ? (
                      <a href={demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-primary/60 px-4 py-2 text-sm">
                        <ArrowUpRight className="h-4 w-4" /> Live Link
                      </a>
                    ) : null}
                    <Link href={`/projects/${project.slug}`} className="inline-flex items-center rounded-2xl bg-primary px-4 py-2 text-sm text-white">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        ) : (
          <p className="mt-8 text-center text-sm text-muted">No published projects yet. Add one from the admin dashboard.</p>
        )}
      </section>

      <section id="contact" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="mt-3 text-muted">Let&apos;s work together</p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <a className="hover:text-heading" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            {profile.location ? <li>{profile.location}</li> : null}
            {github ? (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-heading" href={github} target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              </li>
            ) : null}
            {linkedin ? (
              <li>
                <a className="hover:text-heading" href={linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
