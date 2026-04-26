import type { Metadata } from "next";
import Link from "next/link";
import { seo } from "@/data/seo";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Page not found",
  description: `That page doesn't exist on ${seo.name}'s portfolio. Head back to the board or browse selected work.`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <main className="min-h-screen bg-cream text-ink px-6 md:px-10 py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
          404 · Page not found
        </p>
        <h1 className="mt-4 font-serif italic text-5xl md:text-7xl tracking-tight leading-[0.95]">
          Wrong door
          <span className="text-terracotta">.</span>
        </h1>
        <p className="mt-6 font-serif text-xl text-ink-soft leading-snug max-w-xl">
          The page you were looking for isn&rsquo;t here. Try the board, or one
          of the projects below.
        </p>

        <div className="mt-12 flex flex-col gap-3">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink hover:text-terracotta transition-colors"
          >
            ← Back to the board
          </Link>
          <Link
            href="/classic"
            className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink-muted hover:text-ink transition-colors"
          >
            Classic scrolling portfolio →
          </Link>
        </div>

        <nav
          aria-label="Featured work"
          className="mt-16 border-t border-ink/10 pt-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted">
            Featured work
          </p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {featured.map((p) => (
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
