import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { container, iconButton, primaryButton, secondaryButton } from "@/lib/styles";
import { safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

export function Hero({ profile }: { profile: Profile }) {
  const resume = safeAssetUrl(profile.resume_url);
  const github = safeExternalUrl(profile.github_url);
  const linkedin = safeExternalUrl(profile.linkedin_url);
  const portrait = safeAssetUrl(profile.avatar_url);

  return (
    <section className={container + " grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24"}>
      <div>
        {profile.headline ? <p className="text-sm font-medium text-primary">{profile.headline}</p> : null}
        <p className="mt-4 text-lg text-muted">Hi, I&apos;m</p>
        <p className="mt-1 text-5xl font-semibold tracking-tight text-heading sm:text-6xl">{profile.full_name}</p>
        <h1 className="mt-5 max-w-xl text-2xl font-medium leading-snug text-heading sm:text-3xl">{profile.tagline}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">{profile.bio}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/projects" className={primaryButton}>
            View My Projects
          </Link>
          <Link href="/contact" className={secondaryButton}>
            Get in Touch
          </Link>
          {resume ? (
            <a href={resume} className={secondaryButton} download>
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
          ) : null}
        </div>
        <div className="mt-6 flex gap-2">
          {github ? (
            <a href={github} className={iconButton} aria-label="GitHub" target="_blank" rel="noreferrer">
              <GithubIcon className="h-4 w-4" />
            </a>
          ) : null}
          {linkedin ? (
            <a href={linkedin} className={iconButton} aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <LinkedinIcon className="h-4 w-4" />
            </a>
          ) : null}
          {profile.email ? (
            <a href={`mailto:${profile.email}`} className={iconButton} aria-label="Email">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute inset-6 rounded-full bg-primary-soft blur-2xl" aria-hidden="true" />
        <div className="relative aspect-square overflow-hidden rounded-full border-8 border-surface shadow-card">
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portrait} alt={`Portrait of ${profile.full_name}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-soft text-4xl font-semibold text-heading">
              {profile.full_name.slice(0, 1)}
            </div>
          )}
        </div>
        {profile.motto ? (
          <p className="absolute -bottom-2 right-2 max-w-40 text-right font-script text-2xl leading-tight text-heading sm:text-3xl">
            {profile.motto}
          </p>
        ) : null}
      </div>
    </section>
  );
}
