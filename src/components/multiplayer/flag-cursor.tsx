"use client";

import Image from "next/image";
import { flagUrl } from "@/lib/twemoji";

type Props = {
  country: string | null;
  screenX: number;
  screenY: number;
};

export function FlagCursor({ country, screenX, screenY }: Props) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 will-change-transform"
      style={{
        transform: `translate3d(${screenX}px, ${screenY}px, 0)`,
        transition: "transform 90ms linear",
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="absolute h-1.5 w-1.5 rounded-full bg-ink/70 shadow-[0_0_0_2px_rgba(244,236,224,0.85)]" />
        <Image
          src={flagUrl(country)}
          alt=""
          width={28}
          height={28}
          unoptimized
          className="absolute translate-x-3 translate-y-3 drop-shadow-[0_2px_6px_rgba(42,31,23,0.25)]"
          aria-hidden
        />
      </div>
    </div>
  );
}
