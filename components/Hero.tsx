import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { NameMark } from "@/components/NameMark";
import { container, iconButton, primaryButton, secondaryButton } from "@/lib/styles";
import { safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

export function Hero({ profile }: { profile: Profile }) {
  const resume = safeAssetUrl(profile.resume_url);
  const github = safeExternalUrl(profile.github_url);
  const linkedin = safeExternalUrl(profile.linkedin_url);

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
        <NameMark name={profile.full_name} className="aspect-square" />
        {profile.motto ? (
          <p className="absolute -bottom-2 right-2 max-w-40 text-right font-script text-2xl leading-tight text-heading sm:text-3xl">
            {profile.motto}
          </p>
        ) : null}
      </div>
    </section>
  );
}
