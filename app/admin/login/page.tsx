import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo/mode";
import { isSupabaseConfigured } from "@/lib/site";
import { safeNextPath } from "@/lib/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const session = await getAdminSession();
  if (session.status === "ok") redirect(safeNextPath(params.next));
  const mode = isSupabaseConfigured() ? "supabase" : isDemoMode() ? "demo" : "unconfigured";
  return <LoginForm mode={mode} errorCode={params.error} nextPath={safeNextPath(params.next)} />;
}
