import type { Metadata } from "next";
import Link from "next/link";
import { primaryButton } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="section-title mt-2">That page is not here.</h1>
      <p className="mt-3 text-muted">The address may be mistyped, or the project or article is still a draft.</p>
      <Link href="/" className={`${primaryButton} mt-6`}>
        Back home
      </Link>
    </div>
  );
}
