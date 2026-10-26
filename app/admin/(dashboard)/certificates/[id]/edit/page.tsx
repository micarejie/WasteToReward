import { notFound } from "next/navigation";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { getCertificateById } from "@/lib/data/repository";

export default async function EditCertificatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const certificate = await getCertificateById(id);
  if (!certificate) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">Edit certificate</h1>
      <CertificateForm certificate={certificate} justSaved={query.saved === "1"} />
    </div>
  );
}
