import { requireAdmin } from "@/lib/auth";
import { DashboardShell } from "@/components/admin/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <DashboardShell email={session.email}>{children}</DashboardShell>;
}
