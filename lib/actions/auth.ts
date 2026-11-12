"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demoCredentials, demoSessionToken, isDemoMode } from "@/lib/demo/mode";
import { getAdminSession } from "@/lib/auth";
import { isSupabaseConfigured, siteUrl, supabaseUrlLooksLikeProjectApi } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";
import { firstIssue, loginSchema, passwordResetSchema, passwordUpdateSchema } from "@/lib/validations";

export type AuthState = { error?: string; success?: string };

function looksLikeHtmlInsteadOfJson(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("is an invalid start of a value") ||
    lower.includes("unexpected token '<'") ||
    lower.includes('unexpected token "<') ||
    lower.includes("not valid json") ||
    (lower.includes("<!doctype") && lower.includes("json")) ||
    (lower.includes("invalid character") && lower.includes("<"))
  );
}

function misconfiguredSupabaseUrlMessage() {
  return "NEXT_PUBLIC_SUPABASE_URL looks like a website address, not a Supabase project API. Use the Project URL from Supabase → Project Settings → API (usually https://xxxx.supabase.co).";
}

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (looksLikeHtmlInsteadOfJson(message)) {
    return "The auth server returned a web page instead of JSON. Check NEXT_PUBLIC_SUPABASE_URL — it must be your Supabase project URL (https://xxxx.supabase.co), not this website’s address.";
  }
  if (lower.includes("invalid login")) return "That email or password is not correct.";
  if (lower.includes("email not confirmed")) return "Confirm the email address before signing in.";
  if (lower.includes("rate")) return "Too many attempts. Wait a moment and try again.";
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your network connection.";
  }
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
  if (!supabaseUrlLooksLikeProjectApi()) {
    return { error: misconfiguredSupabaseUrlMessage() };
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
  if (!supabaseUrlLooksLikeProjectApi()) {
    return { error: misconfiguredSupabaseUrlMessage() };
  }
  const parsed = passwordResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/admin/update-password`,
  });
  if (error) {
    if (looksLikeHtmlInsteadOfJson(error.message)) return { error: friendlyAuthError(error.message) };
    return { error: "The reset email could not be sent. Try again in a moment." };
  }
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
