"use client";

import { useEffect, useRef, useState } from "react";

export type CardActivity = "idle" | "active";

/**
 * A card's interactive prototype runs only when the card is both:
 *  - visible in the viewport (IntersectionObserver)
 *  - rendered at a large-enough scale to be readable
 *
 * This keeps 7+ prototypes from trampling the frame budget when zoomed out.
 */
export function useCardActivity(
  scale: number,
  threshold = 0.5,
): {
  activity: CardActivity;
  ref: (el: HTMLElement | null) => void;
} {
  const [inView, setInView] = useState(false);
  const obs = useRef<IntersectionObserver | null>(null);

  const ref = (el: HTMLElement | null) => {
    if (obs.current) obs.current.disconnect();
    if (!el) return;
    obs.current = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: "200px", threshold: 0 },
    );
    obs.current.observe(el);
  };

  useEffect(() => () => obs.current?.disconnect(), []);

  return {
    ref,
    activity: inView && scale >= threshold ? "active" : "idle",
  };
}
