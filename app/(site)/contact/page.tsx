import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { ContactForm } from "@/components/ContactForm";
import { ErrorState } from "@/components/ErrorState";
import { getProfile } from "@/lib/data/repository";
import { container } from "@/lib/styles";
import { loadPage, safeExternalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message about a project, class collaboration, or internship.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const loaded = await loadPage(() => getProfile());
  if (!loaded.ok) return <ErrorState title="The contact page could not be loaded." />;
  const profile = loaded.data;
  const github = safeExternalUrl(profile?.github_url);
  const linkedin = safeExternalUrl(profile?.linkedin_url);
  return (
      <div className={`${container} grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr]`}>
        <div>
          <p className="text-sm font-medium text-primary">Hello</p>
          <h1 className="mt-2 text-4xl font-semibold text-heading">Contact me</h1>
          <p className="mt-4 max-w-md leading-7 text-muted">
            Send a note about a project, a class question, or an internship. Messages are saved privately for the site administrator. They are not shown on the public site.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {profile?.email ? (
              <li>
                <a className="inline-flex items-center gap-2 text-foreground hover:text-heading" href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> {profile.email}
                </a>
              </li>
            ) : null}
            {github ? (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-heading" href={github} target="_blank" rel="noreferrer">
                  <GithubIcon className="h-4 w-4 text-primary" /> GitHub
                </a>
              </li>
            ) : null}
            {linkedin ? (
              <li>
                <a className="inline-flex items-center gap-2 hover:text-heading" href={linkedin} target="_blank" rel="noreferrer">
                  <LinkedinIcon className="h-4 w-4 text-primary" /> LinkedIn
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <ContactForm />
      </div>
  );
}
