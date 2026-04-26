import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { seo } from "@/data/seo";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} — ${project.tagline}`;
  const description = `${project.title} (${project.year}) by ${seo.name}. ${project.tagline} Built with ${project.stack.join(", ")}. Role: ${project.role}.`;
  const canonical = `/work/${project.slug}`;

  return {
    title: `${project.title} · ${project.year} · ${seo.name}`,
    description,
    keywords: [
      project.title,
      `${project.title} case study`,
      `${seo.name} ${project.title}`,
      ...project.stack,
      project.role,
      "portfolio",
      "case study",
      seo.name,
    ],
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: `${seo.url}${canonical}`,
      title: `${project.title} — ${project.tagline}`,
      description,
      siteName: seo.name,
      authors: [seo.url],
      tags: project.stack,
      publishedTime: `${project.year}-01-01`,
    },
    twitter: {
      card: "summary_large_image",
      site: seo.twitterHandle,
      creator: seo.twitterHandle,
      title: `${project.title} — ${project.tagline}`,
      description,
    },
  };
}

export default async function WorkFallbackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 4);
  const canonical = `${seo.url}/work/${project.slug}`;

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.tagline,
    url: canonical,
    inLanguage: "en",
    dateCreated: `${project.year}-01-01`,
    datePublished: `${project.year}-01-01`,
    creator: {
      "@type": "Person",
      name: seo.name,
      url: seo.url,
      sameAs: [
        site.socials.github,
        site.socials.linkedin,
        site.socials.twitter,
      ],
    },
    author: { "@type": "Person", name: seo.name, url: seo.url },
    keywords: project.stack.join(", "),
    about: project.stack,
    ...(project.href ? { sameAs: [project.href] } : {}),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portfolio", item: seo.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${seo.url}/#work`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: canonical },
    ],
  };

  return (
    <main className="min-h-screen bg-cream text-ink px-6 md:px-10 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted hover:text-ink transition-colors"
        >
          <span>←</span>
          <span>Back to board</span>
        </Link>

        <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
          {project.year} · {project.role}
        </p>
        <h1 className="mt-4 font-serif italic text-5xl md:text-7xl tracking-tight leading-[0.95]">
          {project.title}
          <span className="text-terracotta">.</span>
        </h1>
        <p className="mt-6 font-serif text-xl md:text-2xl text-ink-soft leading-snug max-w-xl">
          {project.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted border border-ink/15 rounded-full px-3 py-1.5"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-16 border-t border-ink/10 pt-8 space-y-4 text-ink-muted font-serif text-[17px] leading-[1.7]">
          <p>
            A longer case study is being written. For now, this is the short
            version.
          </p>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink hover:text-terracotta transition-colors underline decoration-ink/20 underline-offset-4 decoration-1"
            >
              Visit the live project
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        <nav
          aria-label="More work"
          className="mt-20 border-t border-ink/10 pt-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
            More work
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex items-baseline justify-between gap-3 py-1.5 border-b border-ink/5 hover:border-ink/20 transition-colors"
                >
                  <span className="font-serif text-[18px] text-ink group-hover:text-terracotta transition-colors">
                    {p.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    {p.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
