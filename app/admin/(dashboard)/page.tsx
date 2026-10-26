import Link from "next/link";
import { listCertificates, listMessages, listPosts, listProjects } from "@/lib/data/repository";
import { formatDateTime } from "@/lib/utils";

export default async function AdminHomePage() {
  const [projects, posts, certificates, messages] = await Promise.all([
    listProjects("admin"),
    listPosts("admin"),
    listCertificates(),
    listMessages(),
  ]);
  const unread = messages.filter((message) => !message.is_read).length;
  const updates = [
    ...projects.map((item) => ({ label: "Project", title: item.title, href: `/admin/projects/${item.id}/edit`, at: item.updated_at })),
    ...posts.map((item) => ({ label: "Article", title: item.title, href: `/admin/blog/${item.id}/edit`, at: item.updated_at })),
    ...certificates.map((item) => ({
      label: "Certificate",
      title: item.title,
      href: `/admin/certificates/${item.id}/edit`,
      at: item.updated_at,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  const cards = [
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    { label: "Blog posts", value: posts.length, href: "/admin/blog" },
    { label: "Certificates", value: certificates.length, href: "/admin/certificates" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-heading">Overview</h1>
      <p className="mt-2 text-sm text-muted">Counts include drafts. Visitors only see published projects and articles.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-3xl border border-border bg-surface p-5 shadow-card">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-heading">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/projects/new" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          New project
        </Link>
        <Link href="/admin/blog/new" className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-heading">
          New article
        </Link>
        <Link href="/admin/certificates/new" className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-heading">
          New certificate
        </Link>
        <Link href="/admin/messages" className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-heading">
          Review messages
        </Link>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-heading">Recent messages</h2>
          {messages.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {messages.slice(0, 5).map((message) => (
                <li key={message.id} className="border-b border-border pb-3 last:border-0">
                  <p className="text-sm font-medium text-heading">
                    {message.subject} {!message.is_read ? <span className="text-primary">· unread</span> : null}
                  </p>
                  <p className="text-xs text-muted">
                    {message.name} · {formatDateTime(message.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-semibold text-heading">Recent updates</h2>
          {updates.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Content you add will be listed here.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {updates.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm font-medium text-heading hover:underline">
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {item.label} · {formatDateTime(item.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
