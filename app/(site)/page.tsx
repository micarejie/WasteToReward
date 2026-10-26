import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { CertificateCard } from "@/components/CertificateCard";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Skills } from "@/components/Skills";
import { getContentMode, getProfile, listCertificates, listPosts, listProjects } from "@/lib/data/repository";
import { container, secondaryButton } from "@/lib/styles";
import { loadPage, safeExternalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const loaded = await loadPage(async () => {
    const mode = await getContentMode();
    const [profile, projects, certificates, posts] = await Promise.all([
      getProfile(),
      listProjects("public"),
      listCertificates(),
      listPosts("public"),
    ]);
    return { mode, profile, projects, certificates, posts };
  });
  if (!loaded.ok) return <ErrorState title="The homepage could not be loaded." />;
  const { mode, profile, projects, certificates, posts } = loaded.data;

  if (mode === "unconfigured" || !profile) {
      return (
        <div className={`${container} py-20`}>
          <EmptyState
            title="Connect the database to publish this portfolio."
            body="Add your Supabase URL and key, run the migration, then seed or enter your own profile. The README lists each step."
          />
        </div>
      );
    }

    const featured = projects.filter((project) => project.featured).slice(0, 3);
    const featuredCertificates = certificates.filter((certificate) => certificate.featured).slice(0, 3);
    const latestPost = posts[0];
    const email = profile.email;
    const github = safeExternalUrl(profile.github_url);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.full_name,
      description: profile.bio,
      email: profile.email,
      jobTitle: profile.headline,
      address: profile.location ? { "@type": "PostalAddress", addressCountry: profile.location } : undefined,
      sameAs: [github, safeExternalUrl(profile.linkedin_url)].filter(Boolean),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Hero profile={profile} />
        <section className={`${container} pb-16`}>
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Selected work</p>
                <h2 className="mt-2 text-3xl font-semibold text-heading">Featured projects</h2>
              </div>
              <Link href="/projects" className="text-sm font-medium text-heading hover:underline">
                All projects
              </Link>
            </div>
            {featured.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState title="No featured projects yet" body="Mark a published project as featured and it will show up here." actionHref="/projects" actionLabel="Browse projects" />
            )}
          </Reveal>
        </section>
        <section className="bg-surface py-16">
          <div className={`${container} grid gap-10 lg:grid-cols-[1.1fr_0.9fr]`}>
            <Reveal>
              <p className="text-sm font-medium text-primary">About</p>
              <h2 className="mt-2 text-3xl font-semibold text-heading">A short introduction</h2>
              <p className="mt-4 max-w-xl leading-7 text-muted">{profile.bio}</p>
              {profile.location ? <p className="mt-4 text-sm text-foreground">Based in {profile.location}</p> : null}
              <Link href="/about" className={`${secondaryButton} mt-6`}>
                More about me <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
            <Reveal>
              <h2 className="text-xl font-semibold text-heading">Skills and technologies</h2>
              <div className="mt-4">
                <Skills skills={profile.skills} compact />
              </div>
            </Reveal>
          </div>
        </section>
        <section className={`${container} py-16`}>
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-primary">Recognition</p>
                <h2 className="mt-2 text-3xl font-semibold text-heading">Selected certificates</h2>
              </div>
              <Link href="/certificates" className="text-sm font-medium text-heading hover:underline">
                View all
              </Link>
            </div>
            {featuredCertificates.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredCertificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No certificates are featured yet"
                body="Add a certificate you earned, then mark it as featured. Sample placeholders stay off this section until you do."
                actionHref="/certificates"
                actionLabel="Open certificates"
              />
            )}
          </Reveal>
        </section>
        {latestPost ? (
          <section className={`${container} pb-16`}>
            <Reveal>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">Journal</p>
                  <h2 className="mt-2 text-3xl font-semibold text-heading">Latest note</h2>
                </div>
                <Link href="/blog" className="text-sm font-medium text-heading hover:underline">
                  All articles
                </Link>
              </div>
              <div className="max-w-xl">
                <BlogCard post={latestPost} />
              </div>
            </Reveal>
          </section>
        ) : null}
        <section className="pb-20">
          <div className={`${container}`}>
            <Reveal>
              <div className="rounded-3xl bg-heading px-6 py-10 text-white sm:px-10">
                <h2 className="text-3xl font-semibold">Let&apos;s build something useful.</h2>
                <p className="mt-3 max-w-xl text-white/80">
                  I&apos;m open to class collaborations, internship conversations, and questions about the projects on this site.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-heading">
                    <Mail className="h-4 w-4" aria-hidden="true" /> Contact me
                  </Link>
                  {email ? (
                    <a href={`mailto:${email}`} className="inline-flex items-center rounded-full border border-white/30 px-5 py-2.5 text-sm">
                      {email}
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
}
