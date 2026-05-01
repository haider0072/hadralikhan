"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type CSSProperties,
} from "react";
import { REACTIONS } from "@/lib/supabase";
import { useRealtime } from "./realtime-context";
import type { Viewport } from "@/components/board/types";

type Props = {
  viewportRef: RefObject<Viewport>;
  containerRef: RefObject<HTMLDivElement | null>;
};

type State =
  | { kind: "closed" }
  | {
      kind: "open";
      screenX: number;
      screenY: number;
      worldX: number;
      worldY: number;
    };

const MAX_LEN = 280;
const PANEL_W = 300;
const TEXTAREA_MIN_H = 36;
const TEXTAREA_MAX_H = 140;

export function SlashMenu({ viewportRef, containerRef }: Props) {
  const { ready, broadcastReaction, broadcastComment } = useRealtime();
  const [state, setState] = useState<State>({ kind: "closed" });
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const open = useCallback(() => {
    const v = viewportRef.current;
    const p = lastPointerRef.current;
    if (!v || !p) return;
    const worldX = (p.x - v.x) / v.scale;
    const worldY = (p.y - v.y) / v.scale;
    setState({
      kind: "open",
      screenX: p.x,
      screenY: p.y,
      worldX,
      worldY,
    });
    setText("");
  }, [viewportRef]);

  const close = useCallback(() => {
    setState({ kind: "closed" });
    setText("");
  }, []);

  // Global keydown — '/' opens, Esc closes
  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const isEditable =
        t?.tagName === "INPUT" ||
        t?.tagName === "TEXTAREA" ||
        t?.isContentEditable;
      if (e.key === "/" && !isEditable && state.kind === "closed") {
        e.preventDefault();
        open();
      } else if (e.key === "Escape" && state.kind !== "closed") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, state.kind, open, close]);

  // Close on canvas pointerdown outside the menu
  useEffect(() => {
    if (state.kind === "closed") return;
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-slash-menu]")) return;
      close();
    };
    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [state.kind, containerRef, close]);

  // Focus textarea when opened
  useEffect(() => {
    if (state.kind === "open") {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [state.kind]);

  // Auto-grow textarea
  const handleInput = (value: string) => {
    setText(value.slice(0, MAX_LEN));
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(
      TEXTAREA_MAX_H,
      Math.max(TEXTAREA_MIN_H, ta.scrollHeight),
    );
    ta.style.height = `${next}px`;
  };

  if (!ready || state.kind === "closed") return null;

  const margin = 12;
  const left = Math.min(
    Math.max(state.screenX + 14, margin),
    window.innerWidth - PANEL_W - margin,
  );
  // Prefer placing the panel above the cursor when there isn't enough room
  // below — keeps the textarea close to the click without going off-screen.
  const ESTIMATED_H = 120;
  const below = state.screenY + 14;
  const top =
    below + ESTIMATED_H < window.innerHeight - margin
      ? below
      : Math.max(margin, state.screenY - ESTIMATED_H - 14);

  const style: CSSProperties = { left, top, width: PANEL_W };

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    broadcastComment(trimmed, state.worldX, state.worldY);
    close();
  };

  return (
    <div
      data-slash-menu
      data-no-drag
      className="fixed z-50 bg-paper/95 backdrop-blur-md border border-ink/10 rounded-2xl px-3 pt-2 pb-2 shadow-[0_10px_28px_rgba(42,31,23,0.18)]"
      style={style}
    >
      <div className="flex items-start gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-terracotta shrink-0 mt-1.5"
          aria-hidden
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="leave a comment…"
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm text-ink placeholder:text-ink/40 leading-snug py-1"
          style={{
            minHeight: TEXTAREA_MIN_H,
            maxHeight: TEXTAREA_MAX_H,
            height: TEXTAREA_MIN_H,
          }}
          maxLength={MAX_LEN}
        />
      </div>

      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-ink/5 gap-2">
        <div className="flex items-center gap-0.5">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                broadcastReaction(emoji, state.worldX, state.worldY);
                close();
              }}
              className="flex items-center justify-center h-8 w-8 rounded-full text-base hover:bg-ink/5 active:scale-90 transition-transform"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40 whitespace-nowrap">
          {text.length > 0 ? `${text.length}/${MAX_LEN} · ↵` : "esc"}
        </span>
      </div>
    </div>
  );
}
