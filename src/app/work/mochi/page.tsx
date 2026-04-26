import type { Metadata } from "next";
import Link from "next/link";
import { MochiCaseStudy } from "./client";
import { seo } from "@/data/seo";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Mochi — Case study",
  description:
    "Design-system generator. One prompt, one complete production-grade system. Coded tokens, components, and a Figma file you can actually use.",
  alternates: { canonical: "/work/mochi" },
  openGraph: {
    type: "article",
    url: `${seo.url}/work/mochi`,
    title: "Mochi — Case study",
    description:
      "Prompt → OKLCH tokens → components → Figma. The live, perceptually uniform color engine from the real codebase.",
    siteName: seo.name,
    authors: [seo.url],
  },
  twitter: {
    card: "summary_large_image",
    site: seo.twitterHandle,
    creator: seo.twitterHandle,
    title: "Mochi — Case study",
    description:
      "Prompt → OKLCH tokens → components → Figma. The live perceptually uniform color engine.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Mochi",
  headline: "Design-system generator",
  description:
    "Prompt to a complete production-grade design system. OKLCH tokens, components, and an exportable Figma file.",
  url: `${seo.url}/work/mochi`,
  inLanguage: "en",
  datePublished: "2026-01-01",
  creator: {
    "@type": "Person",
    name: seo.name,
    url: seo.url,
    sameAs: [site.socials.github, site.socials.linkedin, site.socials.twitter],
  },
  author: { "@type": "Person", name: seo.name, url: seo.url },
  keywords:
    "design system, OKLCH, color tokens, Figma plugin, AI design tools, TypeScript",
  about: ["Design Systems", "OKLCH", "Figma", "AI", "TypeScript"],
  sameAs: ["https://mochi-plum.vercel.app"],
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Portfolio", item: seo.url },
    { "@type": "ListItem", position: 2, name: "Work", item: `${seo.url}/#work` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Mochi",
      item: `${seo.url}/work/mochi`,
    },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: "#fdfbf5" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <TopBar />
      <MochiCaseStudy />
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fdfbf5]/75 border-b border-[#3d2f2315]">
      <div className="max-w-[1080px] mx-auto flex items-center justify-between px-6 h-14">
        <Link
          href="/"
          className="flex items-center gap-2 text-[12px] text-[#6b5a4a] hover:text-[#2a1f17] transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to portfolio
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-[#6b5a4a] font-mono uppercase tracking-[0.22em]">
          <span>Case study · Mochi</span>
        </div>
        <a
          href="https://mochi-plum.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-semibold text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: "#4CAF77", fontFamily: "var(--font-inter)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Try it live →
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#3d2f2315] mt-24">
      <div className="max-w-[1080px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#a89883]">
            Next up
          </p>
          <Link
            href="/"
            className="mt-1 inline-block text-[22px] font-semibold tracking-tight text-[#2a1f17] hover:text-[#4CAF77] transition-colors"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Back to the board →
          </Link>
        </div>
        <p className="text-[11px] text-[#a89883] font-mono">
          Mochi · 2026 · case study compiled from the live codebase
        </p>
      </div>
    </footer>
  );
}
