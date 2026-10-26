"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0, minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Something went wrong.</h1>
          <button type="button" onClick={reset} style={{ marginTop: "1rem" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
