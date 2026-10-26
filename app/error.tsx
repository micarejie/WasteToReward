"use client";

import { useEffect } from "react";
import { secondaryButton } from "@/lib/styles";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
      <h1 className="text-3xl font-semibold text-heading">Something went wrong.</h1>
      <p className="mt-3 text-muted">The page could not be displayed. You can try loading it again.</p>
      <button type="button" className={`${secondaryButton} mt-6`} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
