"use client";

/**
 * Official brand glyphs used in case-study sidebars + tabs.
 * Kept as simple single-path SVGs so they can take currentColor or a fill prop.
 */

type LogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
  style: { flexShrink: 0 },
});

export function V0Logo({ size = 16, className }: LogoProps) {
  // Vercel triangle mark — v0 uses the same wordmark glyph
  return (
    <svg {...base(size)} className={className} fill="currentColor">
      <path d="M12 2 22 20H2L12 2Z" />
    </svg>
  );
}

export function CursorLogo({ size = 16, className }: LogoProps) {
  // Cursor's folded-cube mark (simplified)
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M3 6.5 12 2l9 4.5v11L12 22l-9-4.5v-11Z" />
      <path d="M3 6.5 12 11l9-4.5" />
      <path d="M12 11v11" />
    </svg>
  );
}

export function ClaudeLogo({ size = 16, className }: LogoProps) {
  // Anthropic "burst" mark — four-point starburst filling the viewBox
  return (
    <svg {...base(size)} className={className} fill="currentColor">
      <path d="M12 1c.4 4.6 1.3 7.6 3 9.3s4.7 2.6 9.3 3l.7.2-.7.2c-4.6.4-7.6 1.3-9.3 3S12.4 22 12 24h-.1c-.4-4.6-1.3-7.6-3-9.3s-4.7-2.6-9.3-3L-.1 12l.7-.2c4.6-.4 7.6-1.3 9.3-3s2.6-4.7 3-9.3h.1Z" />
    </svg>
  );
}

export function FigmaLogo({ size = 16, className }: LogoProps) {
  // Figma's multi-circle/square F mark
  return (
    <svg {...base(size)} className={className} fill="none">
      <path d="M8.5 2h3.5v6H8.5a3 3 0 1 1 0-6Z" fill="#F24E1E" />
      <path d="M12 2h3.5a3 3 0 1 1 0 6H12V2Z" fill="#FF7262" />
      <path d="M12 8h3.5a3 3 0 1 1 0 6H12V8Z" fill="#A259FF" />
      <path d="M8.5 8H12v6H8.5a3 3 0 1 1 0-6Z" fill="#1ABCFE" />
      <path d="M8.5 14H12v3a3 3 0 1 1-3.5-3Z" fill="#0ACF83" />
    </svg>
  );
}

export function GithubLogo({ size = 16, className }: LogoProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.9.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.52 9.52 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function YoutubeLogo({ size = 16, className }: LogoProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M23 7.2s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.2-1C17 3.6 12 3.6 12 3.6s-5 0-8 .3c-.4 0-1.3 0-2.2 1C1 5.6.9 7.2.9 7.2S.7 9 .7 10.9v1.7C.7 14.4.9 16.2.9 16.2s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.7.3 7.7.3s5 0 8-.3c.5 0 1.4-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.6v-1.7c0-1.9-.2-3.7-.2-3.7Z" fill="#FF0000" />
      <path d="M9.7 14.5V7.9l6.4 3.3-6.4 3.3Z" fill="#fff" />
    </svg>
  );
}

export function SpotifyLogo({ size = 16, className }: LogoProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path
        d="M16.9 16.2c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1a.7.7 0 1 1-.3-1.4c4-.9 7.4-.5 10.2 1.2.3.2.4.6.3 1ZM18.2 13.3c-.3.4-.8.5-1.1.3-2.9-1.8-7.2-2.3-10.6-1.3a.8.8 0 1 1-.5-1.6c3.8-1.2 8.6-.6 11.9 1.5.4.2.5.7.3 1.1ZM18.3 10.2c-3.4-2-9.1-2.2-12.4-1.2a1 1 0 1 1-.6-2c3.8-1.2 10-.9 13.9 1.4a1 1 0 1 1-1 1.8Z"
        fill="#000"
      />
    </svg>
  );
}

export function VercelLogo({ size = 16, className }: LogoProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor">
      <path d="M12 2 22 20H2L12 2Z" />
    </svg>
  );
}

export function NextLogo({ size = 16, className }: LogoProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor">
      <path d="M12 2a10 10 0 1 0 5.7 18.2L8 8v8H6.5V6.5h1.8l8.7 12A10 10 0 0 0 12 2Zm4 13.7V6.5h1.5V14l-1.5 1.7Z" />
    </svg>
  );
}
