"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { iconButton } from "@/lib/styles";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">Share</span>
      <a className={iconButton} href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`} target="_blank" rel="noreferrer" aria-label="Share on X">
        <span className="text-xs font-semibold">X</span>
      </a>
      <a
        className={iconButton}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
      >
        <span className="text-xs font-semibold">in</span>
      </a>
      <button type="button" className={iconButton} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
