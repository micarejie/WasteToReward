import type { Metadata } from "next";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { HomeExperience } from "@/components/showcase/HomeExperience";
import { getContentMode, getProfile, listCertificates, listPosts, listProjects } from "@/lib/data/repository";
import { container } from "@/lib/styles";
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
      <HomeExperience profile={profile} projects={projects} certificates={certificates} posts={posts} />
    </>
  );
}
