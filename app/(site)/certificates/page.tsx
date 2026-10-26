import type { Metadata } from "next";
import { CertificateCard } from "@/components/CertificateCard";
import { EmptyState, ErrorState } from "@/components/ErrorState";
import { getContentMode, listCertificates } from "@/lib/data/repository";
import { container } from "@/lib/styles";
import { loadPage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Certificates, workshops, and academic achievements that have been added to this portfolio.",
  alternates: { canonical: "/certificates" },
};

export default async function CertificatesPage() {
  const loaded = await loadPage(async () => {
    const mode = await getContentMode();
    const certificates = await listCertificates();
    return { mode, certificates };
  });
  if (!loaded.ok) return <ErrorState title="Certificates could not be loaded." />;
  const { mode, certificates } = loaded.data;
  return (
      <div className={`${container} py-14`}>
        <p className="text-sm font-medium text-primary">Records</p>
        <h1 className="mt-2 text-4xl font-semibold text-heading">Certificates and achievements</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Only documents you add belong here. The sample cards, if they are still present, are layout placeholders and are not credentials.
        </p>
        {mode === "unconfigured" ? (
          <div className="mt-8">
            <EmptyState title="Certificates will load from Supabase." body="Connect the database, then add the documents you have actually earned." />
          </div>
        ) : certificates.length === 0 ? (
          <div className="mt-8">
            <EmptyState title="No certificates yet" body="When you earn one, add the title, issuer, date, and file from the admin dashboard." />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        )}
      </div>
  );
}
