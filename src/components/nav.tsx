"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const t = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(`KHI · ${t}`);
    };
    fmt();
    const id = setInterval(fmt, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-6 md:px-10 transition-all duration-500",
          scrolled
            ? "max-w-5xl rounded-full border border-rule bg-cream/80 backdrop-blur-md"
            : "max-w-7xl",
          scrolled ? "py-2.5" : "py-0",
        )}
      >
        <Link
          href="/"
          className="font-serif text-lg tracking-tight leading-none"
        >
          <span className="italic">Haider</span>
          <span className="text-terracotta">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          <span>{time || "KHI"}</span>
        </div>

        <a
          href="#contact"
          className="md:hidden font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
