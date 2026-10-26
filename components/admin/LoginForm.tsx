"use client";

import { useActionState, useState } from "react";
import { loginAction, requestPasswordReset, type AuthState } from "@/lib/actions/auth";
import { field, labelClass, primaryButton, secondaryButton } from "@/lib/styles";

const initial: AuthState = {};

export function LoginForm({
  mode,
  errorCode,
  nextPath,
}: {
  mode: "demo" | "supabase" | "unconfigured";
  errorCode?: string;
  nextPath: string;
}) {
  const [state, action, pending] = useActionState(loginAction, initial);
  const [resetState, resetAction, resetPending] = useActionState(requestPasswordReset, initial);
  const [showReset, setShowReset] = useState(false);
  const banner =
    errorCode === "unauthorized"
      ? "That account does not have administrator access."
      : errorCode === "auth"
        ? "The sign-in link expired or could not be verified."
        : errorCode === "unconfigured"
          ? "Supabase is not configured for this deployment."
          : "";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
      <p className="text-sm font-medium text-primary">Administrator</p>
      <h1 className="mt-2 text-3xl font-semibold text-heading">Sign in</h1>
      <p className="mt-2 text-sm text-muted">This page is the only way into the dashboard. There is no public registration form.</p>
      {mode === "demo" ? (
        <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-heading">
          Local preview is active. Sign in with the preview account from the README: admin@localhost and the development password preview-only, unless you set different values.
        </p>
      ) : null}
      {mode === "unconfigured" ? (
        <p className="mt-4 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger">
          Add Supabase keys or run the site in development to use the local preview.
        </p>
      ) : null}
      {banner ? <p className="mt-4 text-sm text-danger">{banner}</p> : null}
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={nextPath} />
        <label className="block">
          <span className={labelClass}>Email</span>
          <input className={field} name="email" type="email" autoComplete="username" required />
        </label>
        <label className="block">
          <span className={labelClass}>Password</span>
          <input className={field} name="password" type="password" autoComplete="current-password" required />
        </label>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <button className={primaryButton} type="submit" disabled={pending || mode === "unconfigured"}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <button type="button" className="mt-4 text-left text-sm text-heading hover:underline" onClick={() => setShowReset((value) => !value)}>
        Forgot password
      </button>
      {showReset ? (
        <form action={resetAction} className="mt-3 space-y-3 rounded-3xl border border-border bg-surface p-4">
          <label className="block">
            <span className={labelClass}>Account email</span>
            <input className={field} name="email" type="email" required />
          </label>
          {resetState.error ? <p className="text-sm text-danger">{resetState.error}</p> : null}
          {resetState.success ? <p className="text-sm text-heading">{resetState.success}</p> : null}
          <button className={secondaryButton} type="submit" disabled={resetPending}>
            {resetPending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
