"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Award, FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, Newspaper, UserRound, X } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
];

export function DashboardShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.5rem_1fr]">
      {open ? (
        <button type="button" className="fixed inset-0 z-30 bg-heading/30 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface p-5 lg:static lg:w-auto",
          open ? "flex" : "hidden lg:flex",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-heading">
            Portfolio admin
          </Link>
          <button type="button" className="lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 truncate text-xs text-muted">{email}</p>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm",
                  active ? "bg-primary-soft font-medium text-heading" : "text-muted hover:bg-surface-muted hover:text-heading",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex items-center gap-2 text-sm text-muted hover:text-heading">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
          </button>
        </form>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <button type="button" aria-label="Open dashboard menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="truncate text-sm text-muted">{email}</span>
        </header>
        <div className="px-5 py-6 sm:px-8">{children}</div>
        <p className="px-5 pb-6 text-xs text-muted sm:px-8">Changes here update the public site.</p>
      </div>
    </div>
  );
}
