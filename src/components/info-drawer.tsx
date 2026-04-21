"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

type Kind = "about" | "now" | "contact";

const content: Record<
  Kind,
  { eyebrow: string; title: string; accent: string }
> = {
  about: {
    eyebrow: "The story",
    title: "A few things, kept close.",
    accent: "text-terracotta",
  },
  now: {
    eyebrow: "Currently",
    title: "What I&rsquo;m up to this week.",
    accent: "text-sage",
  },
  contact: {
    eyebrow: "Say hello",
    title: "Drop a line, I read everything.",
    accent: "text-ochre",
  },
};

export function InfoDrawer({
  kind,
  onClose,
}: {
  kind: Kind | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind, onClose]);

  const meta = kind ? content[kind] : null;

  return (
    <AnimatePresence>
      {kind && meta && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-cream/55 backdrop-blur-[10px]"
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.aside
            className="absolute top-0 right-0 bottom-0 w-full sm:w-[520px] bg-paper border-l border-ink/10 shadow-[-30px_0_80px_rgba(42,31,23,0.18)] overflow-hidden flex flex-col"
            variants={{
              closed: { x: "100%" },
              open: { x: 0 },
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted mb-3">
                  {meta.eyebrow}
                </p>
                <h2
                  className={cn(
                    "font-serif italic text-3xl md:text-4xl tracking-tight leading-[1]",
                  )}
                  dangerouslySetInnerHTML={{
                    __html: meta.title.replace(
                      /(\w+\.?)$/,
                      `<span class="${meta.accent}">$1</span>`,
                    ),
                  }}
                />
              </div>
              <button
                onClick={onClose}
                className="shrink-0 h-9 w-9 rounded-full border border-ink/15 hover:bg-ink hover:text-cream text-ink-muted flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-16 space-y-6 font-serif text-[17px] leading-[1.6] text-ink-soft">
              {kind === "about" && (
                <>
                  {site.about.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </>
              )}

              {kind === "now" && (
                <div className="space-y-5">
                  <Row
                    label="Building"
                    value="DigitalHire backend v2. Migrating the old Kotlin microservices into a single NestJS monolith."
                  />
                  <Row
                    label="Shipping"
                    value="Chat v2 is live. Next up: rewriting the hiring flow on the new service."
                  />
                  <Row
                    label="Designing"
                    value="Flutter mobile app for DigitalHire. Polishing Rive micro-animations."
                  />
                  <Row
                    label="Tinkering"
                    value="Mochi (design system generator). Quiet weekend hours only."
                  />
                  <Row
                    label="Reading"
                    value="In Praise of Shadows, Tanizaki. Always going back to it."
                  />
                  <Row
                    label="Listening"
                    value="City pop, Ghibli OSTs, and the hum of the window AC."
                  />
                </div>
              )}

              {kind === "contact" && (
                <div className="space-y-4">
                  <p>
                    Best way to reach me is email. I open DMs on Twitter and
                    LinkedIn too, but email is where I actually reply.
                  </p>
                  <ul className="pt-2 space-y-3 font-sans text-[15px]">
                    <ContactLink
                      label="Email"
                      value={site.email}
                      href={site.socials.email}
                    />
                    <ContactLink
                      label="GitHub"
                      value="haider0072"
                      href={site.socials.github}
                    />
                    <ContactLink
                      label="LinkedIn"
                      value="hadralikhan"
                      href={site.socials.linkedin}
                    />
                    <ContactLink
                      label="Twitter"
                      value="@hadralikhan"
                      href={site.socials.twitter}
                    />
                  </ul>
                  <p className="pt-4 text-ink-muted text-[15px]">
                    Based in Karachi, available worldwide. Open to remote roles,
                    consulting, and interesting experiments.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-5">
      <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted pt-1.5">
        {label}
      </span>
      <p className="flex-1">{value}</p>
    </div>
  );
}

function ContactLink({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li className="flex items-center gap-5 group">
      <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink group-hover:text-terracotta transition-colors underline decoration-ink/20 underline-offset-4 decoration-1"
      >
        {value}
      </a>
    </li>
  );
}
