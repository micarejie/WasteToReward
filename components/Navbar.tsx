"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { navLinks } from "@/lib/site";
import { container, iconButton, primaryButton } from "@/lib/styles";
import { cn, safeAssetUrl } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

export function Navbar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const name = profile?.full_name || "Portfolio";
  const resumeUrl = safeAssetUrl(profile?.resume_url);

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className={cn(container, "flex h-[4.5rem] items-center justify-between gap-3")}>
        <Link href="/" className="min-w-0 truncate text-lg font-semibold tracking-tight text-heading">
          {name}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition hover:text-heading",
                  active ? "font-medium text-heading" : "text-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {resumeUrl ? (
            <span className="nav-resume">
              <a className={primaryButton} href={resumeUrl} download>
                <Download className="h-4 w-4" aria-hidden="true" />
                Resume
              </a>
            </span>
          ) : null}
          <button
            type="button"
            className={cn(iconButton, "lg:hidden")}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} resumeUrl={resumeUrl} />
    </header>
  );
}
