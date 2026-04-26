import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { seo } from "@/data/seo";

export const alt = `${seo.name} · case study`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const ACCENTS: Record<string, { dot: string; tint: string }> = {
  terracotta: { dot: "#c4623d", tint: "rgba(196, 98, 61, 0.18)" },
  ochre: { dot: "#b88a3e", tint: "rgba(184, 138, 62, 0.18)" },
  sage: { dot: "#8a9a72", tint: "rgba(138, 154, 114, 0.20)" },
};

export default async function ProjectOG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return new ImageResponse(<div>Not found</div>, { ...size });
  }

  const accent = ACCENTS[project.accent ?? "terracotta"] ?? ACCENTS.terracotta;

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
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: accent.tint,
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
            background: "rgba(184, 138, 62, 0.12)",
            filter: "blur(60px)",
          }}
        />

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
                background: accent.dot,
              }}
            />
            <span>Case study · {project.year}</span>
          </div>
          <span>hadralikhan.vercel.app</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 132,
              color: "#2a1f17",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              fontFamily: "serif",
              display: "flex",
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#3d2f23",
              lineHeight: 1.25,
              maxWidth: 980,
              fontFamily: "serif",
              display: "flex",
            }}
          >
            {project.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              fontSize: 18,
              color: "#6b5a4a",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              flexWrap: "wrap",
              maxWidth: 800,
            }}
          >
            {project.stack.slice(0, 5).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(42,31,23,0.15)",
                  background: "rgba(249,243,232,0.6)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              fontSize: 20,
              color: "#6b5a4a",
            }}
          >
            <span
              style={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontSize: 28,
                color: "#2a1f17",
              }}
            >
              Haider Ali Khan
            </span>
            <span
              style={{
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize: 16,
              }}
            >
              {project.role}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
