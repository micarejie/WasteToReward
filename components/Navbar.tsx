"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

const menuLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#academics", label: "Academics" },
  { href: "/#experience", label: "Experience" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const name = (profile?.full_name || "Portfolio").split(" ")[0];
  const github = safeExternalUrl(profile?.github_url);
  const linkedin = safeExternalUrl(profile?.linkedin_url);
  const resume = safeAssetUrl(profile?.resume_url);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const main = document.getElementById("content");
    const footer = document.querySelector("footer");
    document.documentElement.classList.toggle("menu-open", open);
    if (main) main.inert = open;
    if (footer instanceof HTMLElement) footer.inert = open;
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
      if (main) main.inert = false;
      if (footer instanceof HTMLElement) footer.inert = false;
    };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
        <div className="h-full bg-primary shadow-[0_0_12px_var(--primary)]" style={{ width: `${progress}%` }} />
      </div>
      <header className={open ? "sticky top-0 z-[60]" : "sticky top-0 z-40"}>
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/#home" className="text-gradient text-2xl font-bold tracking-tight">
            {name}.
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/70 text-primary shadow-[0_0_18px_rgb(139_92_246_/_0.35)]"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <aside className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex" aria-label="Social links">
        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-xs font-semibold tracking-wide text-primary hover:text-heading">
            in
          </a>
        ) : null}
        {github ? (
          <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-primary hover:text-heading">
            <GithubIcon className="h-4 w-4" />
          </a>
        ) : null}
        {profile?.email ? (
          <a href={`mailto:${profile.email}`} aria-label="Email" className="text-xs font-semibold text-primary hover:text-heading">
            @
          </a>
        ) : null}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-50 bg-background" id="site-menu" role="dialog" aria-modal="true" aria-label="Site menu">
          <nav className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-2 px-8">
            {menuLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-3xl font-semibold text-heading hover:bg-primary-soft">
                {link.label}
              </Link>
            ))}
            {resume ? (
              <a href={resume} download className="mt-4 inline-flex w-fit rounded-full bg-primary px-6 py-3 text-sm font-medium text-white">
                View resume
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}
    </>
  );
}
