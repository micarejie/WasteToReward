import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demoCredentials, demoSessionToken, isDemoMode, tokensMatch } from "@/lib/demo/mode";
import { isSupabaseConfigured } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  email: string;
  userId: string;
};

export async function getAdminSession(): Promise<
  { status: "ok"; session: AdminSession } | { status: "anonymous" } | { status: "forbidden" }
> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    const token = cookieStore.get("demo_admin")?.value ?? "";
    if (!token || !tokensMatch(token, demoSessionToken())) return { status: "anonymous" };
    return { status: "ok", session: { email: demoCredentials().email, userId: "demo-admin" } };
  }

  if (!isSupabaseConfigured()) return { status: "anonymous" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return { status: "anonymous" };
  const email = typeof data.claims.email === "string" ? data.claims.email : "";
  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (adminError) throw new Error(adminError.message);
  if (!admin) return { status: "forbidden" };
  return { status: "ok", session: { email, userId } };
}

export async function requireAdmin() {
  const result = await getAdminSession();
  if (result.status === "forbidden") {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
    redirect("/admin/login?error=unauthorized");
  }
  if (result.status !== "ok") redirect("/admin/login");
  return result.session;
}
