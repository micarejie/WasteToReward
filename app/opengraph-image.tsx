import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#f4f7f5",
          color: "#1d4a38",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 1 }}>IT STUDENT PORTFOLIO</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 650, lineHeight: 1.05 }}>Mica Dames</div>
          <div style={{ marginTop: 18, fontSize: 32, maxWidth: 800 }}>
            Building meaningful digital experiences through technology.
          </div>
        </div>
        <div style={{ fontSize: 24 }}>Next.js · Tailwind CSS · Supabase</div>
      </div>
    ),
    size,
  );
}
