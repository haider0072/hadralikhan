"use client";

import { cn } from "@/lib/cn";
import { GithubLogo } from "./tool-logos";

export type ProjectLink = {
  kind: "live" | "github" | "playstore" | "appstore";
  href: string;
  label?: string;
};

export function ProjectLinks({
  links,
  dark = true,
  className,
  accent,
}: {
  links: ProjectLink[];
  dark?: boolean;
  className?: string;
  accent?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {links.map((l) => (
        <LinkButton key={l.kind + l.href} link={l} dark={dark} accent={accent} />
      ))}
    </div>
  );
}

function LinkButton({
  link,
  dark,
  accent,
}: {
  link: ProjectLink;
  dark: boolean;
  accent?: string;
}) {
  const meta = META[link.kind];
  const label = link.label ?? meta.defaultLabel;
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer"
      title={label}
      aria-label={label}
      className={cn(
        "group inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
        dark
          ? "border-white/15 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30"
          : "border-black/10 text-black/60 hover:text-black hover:bg-black/5 hover:border-black/20",
      )}
      style={accent ? ({ ["--accent" as string]: accent } as React.CSSProperties) : undefined}
    >
      <meta.Icon size={14} />
    </a>
  );
}

const META: Record<
  ProjectLink["kind"],
  {
    defaultLabel: string;
    Icon: React.ComponentType<{ size?: number }>;
  }
> = {
  live: {
    defaultLabel: "Open live app",
    Icon: ExternalArrow,
  },
  github: {
    defaultLabel: "View on GitHub",
    Icon: ({ size = 14 }) => <GithubLogo size={size} />,
  },
  playstore: {
    defaultLabel: "Get on Google Play",
    Icon: PlayStoreIcon,
  },
  appstore: {
    defaultLabel: "Download on the App Store",
    Icon: AppStoreIcon,
  },
};

function ExternalArrow({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function PlayStoreIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3.609 1.814L13.792 12 3.61 22.186c-.35-.2-.609-.57-.609-1.077V2.891c0-.507.259-.877.609-1.077z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M17.36 15.568l-2.36-2.36L4.63 23.59c.39.22.89.23 1.32-.01l11.41-8.012z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M20.16 10.38l-3.45-1.995-2.59 2.59 2.6 2.6 3.45-1.995c1.055-.61 1.055-2.59-.01-3.2z"
        fill="currentColor"
      />
      <path
        d="M17.36 8.432L5.95.42C5.52.18 5.02.19 4.63.41l10.37 10.37 2.36-2.35z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function AppStoreIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 12.53a4.47 4.47 0 0 1 2.13-3.75 4.58 4.58 0 0 0-3.6-1.95c-1.51-.16-2.96.89-3.72.89-.77 0-1.95-.87-3.21-.85a4.8 4.8 0 0 0-4.04 2.46c-1.73 3-.44 7.4 1.23 9.82.82 1.18 1.78 2.5 3.04 2.45 1.23-.05 1.69-.79 3.17-.79 1.48 0 1.9.79 3.2.77 1.32-.02 2.15-1.18 2.96-2.37a10.4 10.4 0 0 0 1.35-2.77 4.34 4.34 0 0 1-2.5-3.91zM14.66 5.07a4.4 4.4 0 0 0 1-3.15 4.5 4.5 0 0 0-2.9 1.5 4.17 4.17 0 0 0-1.03 3.04 3.72 3.72 0 0 0 2.93-1.39z" />
    </svg>
  );
}
