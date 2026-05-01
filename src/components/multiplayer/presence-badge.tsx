"use client";

import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";
import { useRealtime } from "./realtime-context";

const MAX_FLAGS = 3;

export function PresenceBadge() {
  const { ready, self, others } = useRealtime();

  if (!ready) return null;

  const total = 1 + others.length;
  const flags: string[] = [];
  const seen = new Set<string>();

  const selfCountry = self.country;
  flags.push(selfCountry ?? "ZZ");
  if (selfCountry) seen.add(selfCountry);

  for (const other of others) {
    if (flags.length >= MAX_FLAGS) break;
    const c = other.data.country;
    const key = c ?? `anon-${other.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    flags.push(c ?? "ZZ");
  }

  const overflow = total - flags.length;

  return (
    <div
      data-no-drag
      className="fixed top-[68px] right-5 z-40 flex items-center gap-2 bg-paper/90 backdrop-blur border border-ink/10 rounded-full px-3 py-1.5"
      title={`${total} ${total === 1 ? "person" : "people"} viewing`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
      </span>
      <div className="flex -space-x-1.5">
        {flags.map((code, i) => (
          <Image
            key={`${code}-${i}`}
            src={flagUrl(code === "ZZ" ? null : code)}
            alt=""
            width={18}
            height={18}
            unoptimized
            className="rounded-sm ring-2 ring-paper"
            aria-hidden
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        {overflow > 0 ? `+${overflow}` : total === 1 ? "you" : `${total} live`}
      </span>
    </div>
  );
}
