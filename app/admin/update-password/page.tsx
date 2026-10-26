"use client";

import { useActionState } from "react";
import { updatePasswordAction, type AuthState } from "@/lib/actions/auth";
import { field, labelClass, primaryButton } from "@/lib/styles";

const initial: AuthState = {};

export default function UpdatePasswordPage() {
  const [state, action, pending] = useActionState(updatePasswordAction, initial);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl font-semibold text-heading">Choose a new password</h1>
      <p className="mt-2 text-sm text-muted">Use the link from the reset email. It expires if you wait too long.</p>
      <form action={action} className="mt-6 space-y-4">
        <label className="block">
          <span className={labelClass}>New password</span>
          <input className={field} name="password" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <label className="block">
          <span className={labelClass}>Confirm password</span>
          <input className={field} name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
        <button className={primaryButton} type="submit" disabled={pending}>
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
