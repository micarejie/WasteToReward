import { CertificateForm } from "@/components/admin/CertificateForm";

export default function NewCertificatePage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">New certificate</h1>
      <CertificateForm />
    </div>
  );
}
