import { formatDate, safeAssetUrl, safeExternalUrl } from "@/lib/utils";
import type { Certificate } from "@/types/portfolio";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const image = safeAssetUrl(certificate.image_url);
  const credential = safeExternalUrl(certificate.credential_url);
  const sample = certificate.title.toLowerCase().includes("sample");

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
      <div className="aspect-[16/10] bg-primary-soft">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={`${certificate.title} document`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">No document image</div>
        )}
      </div>
      <div className="p-5">
        {sample ? <p className="text-xs font-medium uppercase tracking-wide text-primary">Sample entry</p> : null}
        <h3 className="mt-1 text-lg font-semibold text-heading">{certificate.title}</h3>
        <p className="mt-1 text-sm text-foreground">{certificate.issuer}</p>
        <p className="mt-1 text-xs text-muted">{certificate.date_earned ? formatDate(certificate.date_earned) : "Date not listed"}</p>
        {certificate.description ? <p className="mt-3 text-sm leading-6 text-muted">{certificate.description}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {image ? (
            <a href={image} className="font-medium text-heading hover:underline" target="_blank" rel="noreferrer">
              View image
            </a>
          ) : null}
          {credential ? (
            <a href={credential} className="font-medium text-heading hover:underline" target="_blank" rel="noreferrer">
              Open verification link
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
