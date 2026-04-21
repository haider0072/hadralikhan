import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkFallbackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-cream text-ink px-6 md:px-10 py-16 md:py-24">
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
      </div>
    </main>
  );
}
