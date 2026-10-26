"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import type { Profile } from "@/types/portfolio";

export function AppShell({
  children,
  profile,
  demo,
}: {
  children: ReactNode;
  profile: Profile | null;
  demo: boolean;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      {demo ? (
        <p className="border-b border-border bg-primary-soft px-5 py-2 text-center text-sm text-heading">
          Local sample content is showing because Supabase is not connected. Replace it from the admin dashboard after you add your project keys.
        </p>
      ) : null}
      <Navbar profile={profile} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer profile={profile} />
      <ScrollToTop />
    </div>
  );
}
