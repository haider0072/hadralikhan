import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-cream-deep/60 mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Elsewhere
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-serif text-2xl md:text-3xl">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-8 hover:text-terracotta hover:underline"
            >
              GitHub
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-8 hover:text-terracotta hover:underline"
            >
              LinkedIn
            </a>
            <a
              href={site.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-8 hover:text-terracotta hover:underline"
            >
              Twitter
            </a>
            <a
              href={site.socials.email}
              className="underline-offset-8 hover:text-terracotta hover:underline"
            >
              Email
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Location
          </p>
          <p className="mt-4 font-serif text-xl">{site.location}</p>
          <p className="text-sm text-ink-muted mt-1">UTC+05:00 · PKT</p>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Currently
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Building AI agents at DigitalHire. Open to select collaborations
            and unreasonable ideas.
          </p>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          <span>© {new Date().getFullYear()} Haider Ali Khan</span>
          <span>Hand-built · Karachi</span>
        </div>
      </div>
    </footer>
  );
}
