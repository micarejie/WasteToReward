"use client";

import { useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { field, labelClass, primaryButton } from "@/lib/styles";

const initial: ContactState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="relative rounded-3xl border border-border bg-surface p-6 shadow-card" noValidate>
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Company</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input
        type="hidden"
        name="started_at"
        ref={(node) => {
          if (node && !node.value) node.value = String(Date.now());
        }}
      />
      <div className="grid gap-4">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input className={field} name="name" autoComplete="name" required maxLength={80} />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input className={field} name="email" type="email" autoComplete="email" required maxLength={120} />
        </label>
        <label className="block">
          <span className={labelClass}>Subject</span>
          <input className={field} name="subject" required maxLength={140} />
        </label>
        <label className="block">
          <span className={labelClass}>Message</span>
          <textarea className={`${field} min-h-36 resize-y`} name="message" required minLength={10} maxLength={4000} />
        </label>
      </div>
      <button className={`${primaryButton} mt-5`} type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-sm" role="status" aria-live="polite">
        {state.error ? <span className="text-danger">{state.error}</span> : null}
        {state.success ? <span className="text-heading">{state.success}</span> : null}
      </p>
    </form>
  );
}
