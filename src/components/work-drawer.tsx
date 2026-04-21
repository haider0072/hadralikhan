"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { projects } from "@/data/projects";
import { cn } from "@/lib/cn";

const accentMap: Record<string, string> = {
  terracotta: "bg-terracotta",
  ochre: "bg-ochre",
  sage: "bg-sage",
};

export function WorkDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop — cream wash with blur over board */}
          <motion.button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-cream/60 backdrop-blur-[10px]"
            variants={{
              closed: { opacity: 0 },
              open: { opacity: 1 },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Drawer sheet */}
          <motion.div
            className="absolute inset-x-0 bottom-0 top-[7vh] bg-paper border-t border-ink/10 rounded-t-[28px] shadow-[0_-30px_80px_rgba(42,31,23,0.18)] overflow-hidden"
            variants={{
              closed: { y: "100%" },
              open: { y: 0 },
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1 w-10 rounded-full bg-ink/15" />
            </div>

            {/* Header */}
            <div className="px-8 md:px-14 pt-4 pb-6 flex items-end justify-between gap-6 border-b border-ink/5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-muted mb-2">
                  {projects.length} projects · 2023 — now
                </p>
                <h2 className="font-serif italic text-4xl md:text-5xl tracking-tight leading-[0.95]">
                  Selected <span className="text-terracotta">work</span>
                </h2>
                <p className="mt-3 font-serif text-sm md:text-base text-ink-muted max-w-xl">
                  A quiet shelf. Products shipped, weekend experiments, and things
                  I built because the idea wouldn&apos;t leave me alone.
                </p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 h-10 w-10 rounded-full border border-ink/15 hover:bg-ink hover:text-cream text-ink-muted flex items-center justify-center transition-colors"
                aria-label="Close work drawer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* List */}
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ maxHeight: "calc(93vh - 160px)" }}
            >
              <ul className="px-4 md:px-10 pb-32">
                {projects.map((p, i) => {
                  const external = !!p.href && /^https?:\/\//.test(p.href);
                  const href = external ? p.href! : `/work/${p.slug}`;
                  const LinkCmp = external ? "a" : Link;
                  const linkProps = external
                    ? { href, target: "_blank", rel: "noopener noreferrer" }
                    : { href };
                  return (
                    <motion.li
                      key={p.slug}
                      variants={{
                        closed: { opacity: 0, y: 24 },
                        open: { opacity: 1, y: 0 },
                      }}
                      transition={{
                        delay: 0.22 + i * 0.035,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <LinkCmp
                        {...(linkProps as { href: string })}
                        className="group relative block py-7 md:py-8 px-4 md:px-6 border-b border-ink/8"
                      >
                        <div className="flex items-baseline gap-6 md:gap-10">
                          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted w-14 shrink-0">
                            {p.year}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-4 flex-wrap">
                              <h3 className="font-serif text-3xl md:text-5xl italic tracking-tight leading-[1.05] text-ink group-hover:text-terracotta transition-colors duration-500">
                                {p.title}
                              </h3>
                              {p.accent && (
                                <span
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    accentMap[p.accent],
                                  )}
                                />
                              )}
                            </div>
                            <p className="mt-2 font-serif text-base md:text-lg text-ink-muted max-w-2xl">
                              {p.tagline}
                            </p>
                            <div className="mt-3 flex items-center gap-3 flex-wrap font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                              <span>{p.role}</span>
                              <span className="text-ink/20">·</span>
                              <span className="text-ink-muted">
                                {p.stack.join(" / ")}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 self-center text-ink-muted group-hover:text-terracotta transition-all duration-500 group-hover:translate-x-1">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M5 12h14M13 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </LinkCmp>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
