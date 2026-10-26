import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { navLinks } from "@/lib/site";
import { safeExternalUrl } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile | null }) {
  const name = profile?.full_name || "Portfolio";
  const github = safeExternalUrl(profile?.github_url);
  const linkedin = safeExternalUrl(profile?.linkedin_url);
  const email = profile?.email;

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className={cnGrid}>
        <div>
          <p className="text-lg font-semibold text-heading">{name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-foreground">
            {profile?.tagline || "Building meaningful digital experiences through technology."}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            {profile?.bio ||
              "Interested in web development, databases, and interface design while studying information technology."}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-heading">Quick links</h2>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition hover:text-heading">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-heading">Connect</h2>
          <ul className="mt-3 space-y-2">
            {github ? (
              <li>
                <a href={github} className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading" target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              </li>
            ) : null}
            {linkedin ? (
              <li>
                <a href={linkedin} className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading" target="_blank" rel="noreferrer">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <Year /> {name}. All rights reserved.
          </p>
          <p>Built with Next.js, Tailwind CSS, and Supabase.</p>
        </div>
      </div>
    </footer>
  );
}

const cnGrid = "mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-3 lg:px-8";

function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
