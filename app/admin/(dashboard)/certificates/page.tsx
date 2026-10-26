import { CertificatesManager } from "@/components/admin/ContentManager";
import { listCertificates } from "@/lib/data/repository";

export default async function AdminCertificatesPage() {
  const certificates = await listCertificates();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-heading">Certificates</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Add only certificates and achievements you actually earned. Delete the sample placeholders.</p>
      <CertificatesManager certificates={certificates} />
    </div>
  );
}
