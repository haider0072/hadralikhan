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
      kind: "menu" | "comment";
      screenX: number;
      screenY: number;
      worldX: number;
      worldY: number;
    };

const MAX_LEN = 200;

export function SlashMenu({ viewportRef, containerRef }: Props) {
  const { ready, broadcastReaction, broadcastComment } = useRealtime();
  const [state, setState] = useState<State>({ kind: "closed" });
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // Track latest pointer position so '/' keypress knows where to anchor.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const openMenu = useCallback(() => {
    const v = viewportRef.current;
    const p = lastPointerRef.current;
    if (!v || !p) return;
    const worldX = (p.x - v.x) / v.scale;
    const worldY = (p.y - v.y) / v.scale;
    setState({
      kind: "menu",
      screenX: p.x,
      screenY: p.y,
      worldX,
      worldY,
    });
    setText("");
  }, [viewportRef]);

  // Global keydown — '/' opens menu, Esc closes
  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "/" && !isEditable && state.kind === "closed") {
        e.preventDefault();
        openMenu();
      } else if (e.key === "Escape" && state.kind !== "closed") {
        e.preventDefault();
        setState({ kind: "closed" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, state.kind, openMenu]);

  // Close on outside click / pointerdown on the canvas
  useEffect(() => {
    if (state.kind === "closed") return;
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-slash-menu]")) return;
      setState({ kind: "closed" });
    };
    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, [state.kind, containerRef]);

  // Focus input when entering comment mode
  useEffect(() => {
    if (state.kind === "comment") {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [state.kind]);

  if (!ready || state.kind === "closed") return null;

  // Clamp menu to viewport so it never escapes
  const MENU_W = state.kind === "comment" ? 280 : 240;
  const MENU_H = 44;
  const margin = 12;
  const left = Math.min(
    Math.max(state.screenX + 14, margin),
    window.innerWidth - MENU_W - margin,
  );
  const top = Math.min(
    Math.max(state.screenY + 14, margin),
    window.innerHeight - MENU_H - margin,
  );
  const baseStyle: CSSProperties = { left, top };

  if (state.kind === "menu") {
    return (
      <div
        data-slash-menu
        data-no-drag
        className="fixed z-50 flex items-center gap-1 bg-paper/95 backdrop-blur-md border border-ink/10 rounded-full px-2 py-1.5 shadow-[0_8px_24px_rgba(42,31,23,0.16)]"
        style={baseStyle}
      >
        <button
          onClick={() =>
            setState({
              kind: "comment",
              screenX: state.screenX,
              screenY: state.screenY,
              worldX: state.worldX,
              worldY: state.worldY,
            })
          }
          className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-ink hover:bg-ink/5 active:scale-95 transition-transform"
          aria-label="Add comment"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Comment</span>
        </button>
        <span className="h-5 w-px bg-ink/10" aria-hidden />
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              broadcastReaction(emoji, state.worldX, state.worldY);
              setState({ kind: "closed" });
            }}
            className="flex items-center justify-center h-8 w-8 rounded-full text-base hover:bg-ink/5 active:scale-90 transition-transform"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  }

  // Comment mode
  return (
    <div
      data-slash-menu
      data-no-drag
      className="fixed z-50 bg-paper/95 backdrop-blur-md border border-ink/10 rounded-2xl px-3 py-2 shadow-[0_8px_24px_rgba(42,31,23,0.16)]"
      style={{ ...baseStyle, width: 280 }}
    >
      <div className="flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-terracotta shrink-0"
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
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              broadcastComment(text.trim(), state.worldX, state.worldY);
              setState({ kind: "closed" });
              setText("");
            }
          }}
          placeholder="leave a comment…"
          className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink/40"
          maxLength={MAX_LEN}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-ink/5 text-[9px] font-mono uppercase tracking-[0.18em] text-ink/40">
        <span>enter to send · esc to cancel</span>
        <span>{text.length}/{MAX_LEN}</span>
      </div>
    </div>
  );
}
