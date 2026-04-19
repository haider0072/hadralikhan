"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function Cursor({ dragging }: { dragging: boolean }) {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("drag");
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0;
    let tx = 0,
      ty = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      const t = e.target as HTMLElement;
      const clickable = t.closest("a, button, [data-cursor-text]");
      if (clickable) {
        setIsPointer(true);
        const custom = (clickable as HTMLElement).dataset.cursorText;
        setText(custom || "open");
      } else {
        setIsPointer(false);
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.15;
      ry += (ty - ry) * 0.15;
      dx += (tx - dx) * 0.4;
      dy += (ty - dy) * 0.4;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      }
      if (label.current) {
        label.current.style.transform = `translate3d(${rx + 18}px, ${ry + 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    if (dragging) setText("panning");
    else if (!isPointer) setText("drag");
  }, [dragging, isPointer]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] hidden md:block"
      aria-hidden
    >
      <div
        ref={ring}
        className={cn(
          "absolute top-0 left-0 rounded-full border border-ink/60 transition-[width,height,background-color,opacity] duration-200 ease-out",
          dragging ? "w-14 h-14 bg-terracotta/10" : "w-10 h-10",
          isPointer && !dragging ? "w-16 h-16 bg-terracotta/15 border-terracotta" : "",
        )}
      />
      <div
        ref={dot}
        className={cn(
          "absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-ink transition-opacity",
          dragging || isPointer ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        ref={label}
        className="absolute top-0 left-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ink bg-cream/85 backdrop-blur px-2 py-1 rounded-full border border-rule"
      >
        {text}
      </div>
    </div>
  );
}
