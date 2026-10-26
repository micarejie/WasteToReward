"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demoCredentials, demoSessionToken, isDemoMode } from "@/lib/demo/mode";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, siteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";
import { firstIssue, loginSchema, passwordResetSchema, passwordUpdateSchema } from "@/lib/validations";

export type AuthState = { error?: string; success?: string };

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "That email or password is not correct.";
  if (lower.includes("email not confirmed")) return "Confirm the email address before signing in.";
  if (lower.includes("rate")) return "Too many attempts. Wait a moment and try again.";
  return "Sign-in failed. Check the email and password, then try again.";
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const nextPath = safeNextPath(String(formData.get("next") || "/admin"));

  if (isDemoMode()) {
    const expected = demoCredentials();
    if (parsed.data.email !== expected.email || parsed.data.password !== expected.password) {
      return { error: "Those preview credentials are not correct." };
    }
    const cookieStore = await cookies();
    cookieStore.set("demo_admin", demoSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    redirect(nextPath);
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured yet. Add the environment variables from the README." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendlyAuthError(error.message) };

  const session = await getAdminSession();
  if (session.status !== "ok") {
    await supabase.auth.signOut();
    return { error: "This account can sign in, but it is not an administrator." };
  }
  redirect(nextPath);
}

export async function logoutAction() {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    cookieStore.delete("demo_admin");
    redirect("/admin/login");
  }
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (isDemoMode() || !isSupabaseConfigured()) {
    return { error: "Password reset is available after Supabase Auth is connected." };
  }
  const parsed = passwordResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/admin/update-password`,
  });
  if (error) return { error: "The reset email could not be sent. Try again in a moment." };
  return { success: "If that email belongs to an account, a reset link is on its way." };
}

export async function updatePasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Password changes require Supabase Auth." };
  }
  const parsed = passwordUpdateSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "The reset link is missing or has expired. Request a new one." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "The password could not be updated. Request a new reset link and try again." };
  redirect("/admin");
}
