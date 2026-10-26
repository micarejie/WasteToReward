import type { Metadata } from "next";
import Link from "next/link";
import { Download, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { EducationTimeline } from "@/components/EducationTimeline";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { Skills } from "@/components/Skills";
import { getContentMode, getProfile } from "@/lib/data/repository";
import { container, secondaryButton } from "@/lib/styles";
import { loadPage, safeAssetUrl, safeExternalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "Academic background, skills, interests, and goals.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const loaded = await loadPage(async () => {
    const mode = await getContentMode();
    const profile = await getProfile();
    return { mode, profile };
  });
  if (!loaded.ok) return <ErrorState title="The about page could not be loaded." />;
  const { mode, profile } = loaded.data;
  if (mode === "unconfigured" || !profile) {
      return (
        <div className={`${container} py-16`}>
          <EmptyState title="The profile is not available yet." body="Connect Supabase and add your profile to fill this page." />
        </div>
      );
    }
    const resume = safeAssetUrl(profile.resume_url);
    const github = safeExternalUrl(profile.github_url);
    const linkedin = safeExternalUrl(profile.linkedin_url);
    const portrait = safeAssetUrl(profile.avatar_url);

    return (
      <div className={`${container} py-14`}>
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={portrait} alt={`Portrait of ${profile.full_name}`} className="aspect-square w-full max-w-sm rounded-[2rem] object-cover" />
            ) : null}
          </div>
          <div>
            <p className="text-sm font-medium text-primary">About</p>
            <h1 className="section-title mt-2">About me</h1>
            <p className="mt-2 text-lg text-foreground">{profile.headline}</p>
            <p className="mt-4 max-w-2xl leading-7 text-muted">{profile.bio}</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground">
              {profile.location ? (
                <li className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" /> {profile.location}
                </li>
              ) : null}
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {resume ? (
                <a className={secondaryButton} href={resume} download>
                  <Download className="h-4 w-4" aria-hidden="true" /> Download resume
                </a>
              ) : null}
              {github ? (
                <a className={secondaryButton} href={github} target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              ) : null}
              {linkedin ? (
                <a className={secondaryButton} href={linkedin} target="_blank" rel="noreferrer">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-heading">Education</h2>
          <div className="mt-6 max-w-3xl">
            <EducationTimeline items={profile.education} />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-heading">Technical skills</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Levels describe current practice, not a finished rating. Learning means I am actively using it. Familiar means I have used it in class or a small project. Comfortable means I can build with it and look up the details I forget.
          </p>
          <div className="mt-6">
            <Skills skills={profile.skills} />
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <InfoCard title="Interests in IT" items={profile.interests} />
          <InfoCard title="Personal strengths" items={profile.strengths} />
          <div className="rounded-3xl border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold text-heading">Career goals</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{profile.career_goals || "Add your goals from the profile dashboard."}</p>
            <Link href="/contact" className="mt-4 inline-block text-sm font-medium text-heading hover:underline">
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <h2 className="text-lg font-semibold text-heading">{title}</h2>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">Nothing is listed here yet.</p>
      )}
    </section>
  );
}
