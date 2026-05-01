"use client";

import { useEffect, useState, type RefObject } from "react";

/* Returns whether `ref` is currently intersecting the viewport. Uses a single
   shared IntersectionObserver per (root, rootMargin) pair so dozens of cards
   don't each spin up their own observer. */

type Key = string;

const observers = new Map<
  Key,
  {
    io: IntersectionObserver;
    targets: Map<Element, Set<(visible: boolean) => void>>;
  }
>();

function getObserver(rootMargin: string) {
  const key = `m:${rootMargin}`;
  let entry = observers.get(key);
  if (entry) return entry;

  const targets = new Map<Element, Set<(visible: boolean) => void>>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const cbs = targets.get(e.target);
        if (!cbs) continue;
        for (const cb of cbs) cb(e.isIntersecting);
      }
    },
    { rootMargin },
  );
  entry = { io, targets };
  observers.set(key, entry);
  return entry;
}

export function useInViewport(
  ref: RefObject<Element | null>,
  rootMargin = "200px",
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const { io, targets } = getObserver(rootMargin);
    let set = targets.get(el);
    if (!set) {
      set = new Set();
      targets.set(el, set);
      io.observe(el);
    }
    const cb = (v: boolean) => setVisible(v);
    set.add(cb);
    return () => {
      set!.delete(cb);
      if (set!.size === 0) {
        io.unobserve(el);
        targets.delete(el);
      }
    };
  }, [ref, rootMargin]);

  return visible;
}
