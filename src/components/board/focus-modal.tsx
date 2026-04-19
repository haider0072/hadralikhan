"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export function FocusModal({
  open,
  onClose,
  children,
  projectKey,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  projectKey: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const node = (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectKey} focused view`}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-[fadeIn_250ms_ease-out]"
      />
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none",
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto relative max-w-[min(1100px,96vw)] max-h-[92vh] overflow-hidden rounded-lg shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] animate-[zoomIn_320ms_cubic-bezier(0.2,0.9,0.2,1)]"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-cream/90 border border-ink/10 hover:bg-cream flex items-center justify-center text-ink backdrop-blur transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span
            aria-hidden
            className="absolute top-4 left-4 z-20 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/70 bg-ink/40 backdrop-blur px-2.5 py-1.5 rounded-full"
          >
            Esc to close
          </span>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(node, document.body);
}
