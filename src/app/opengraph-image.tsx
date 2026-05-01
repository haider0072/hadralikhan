import { ImageResponse } from "next/og";
import { seo } from "@/data/seo";

export const runtime = "edge";
export const alt = `${seo.name} · ${seo.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#f4ece0",
          backgroundImage:
            "radial-gradient(circle, rgba(42,31,23,0.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          position: "relative",
        }}
      >
        {/* Warm glows */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(196, 98, 61, 0.15)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(184, 138, 62, 0.18)",
            filter: "blur(60px)",
          }}
        />

        {/* Top row — brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6b5a4a",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 10,
                background: "#c4623d",
              }}
            />
            <span>Portfolio · Board</span>
          </div>
          <span>itshaider.work</span>
        </div>

        {/* Center — name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 128,
              color: "#2a1f17",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              fontFamily: "serif",
              display: "flex",
            }}
          >
            Haider Ali Khan
          </div>
          <div
            style={{
              fontSize: 44,
              color: "#c4623d",
              lineHeight: 1.1,
              fontStyle: "italic",
              letterSpacing: "-0.01em",
              fontFamily: "serif",
              display: "flex",
            }}
          >
            Designer · PM · Developer
          </div>
        </div>

        {/* Bottom — tagline + tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#3d2f23",
              lineHeight: 1.35,
              maxWidth: 900,
              display: "flex",
            }}
          >
            Designs products, ships systems, occasionally a little magic. Available
            for remote work, worldwide.
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 20,
              color: "#6b5a4a",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {["Product Design", "AI Agents", "Next.js", "Flutter", "Remote"].map(
              (t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid rgba(42,31,23,0.15)",
                    background: "rgba(249,243,232,0.6)",
                  }}
                >
                  {t}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
