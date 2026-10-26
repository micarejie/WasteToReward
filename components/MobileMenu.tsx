"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { primaryButton } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function MobileMenu({
  open,
  onClose,
  resumeUrl,
}: {
  open: boolean;
  onClose: () => void;
  resumeUrl?: string | null;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" className="absolute inset-0 bg-heading/30" aria-label="Close menu" onClick={onClose} />
      <div
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 right-0 flex h-full w-full flex-col gap-6 bg-surface p-6 shadow-card sm:w-80"
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-2xl px-4 py-3 text-base",
                  active ? "bg-primary-soft font-medium text-heading" : "text-foreground hover:bg-surface-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {resumeUrl ? (
          <a className={primaryButton} href={resumeUrl} download>
            Resume
          </a>
        ) : null}
      </div>
    </div>
  );
}
