import Link from "next/link";
import { primaryButton, secondaryButton } from "@/lib/styles";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-heading">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">{body}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={`${primaryButton} mt-6`}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({ title = "This page could not be loaded.", body }: { title?: string; body?: string }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 text-center">
      <h1 className="text-3xl font-semibold text-heading">{title}</h1>
      <p className="mt-3 text-muted">
        {body || "Check the connection and try again. If you are setting up the site, confirm the Supabase environment variables and migrations."}
      </p>
      <a href="" className={`${secondaryButton} mt-6`}>
        Try again
      </a>
    </div>
  );
}
