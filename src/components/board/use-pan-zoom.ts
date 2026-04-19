"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Viewport } from "./types";

type Options = {
  world: { w: number; h: number; padding: number };
  minScale?: number;
  maxScale?: number;
  initial?: Partial<Viewport>;
};

export function usePanZoom({
  world,
  minScale = 0.25,
  maxScale = 2,
  initial,
}: Options) {
  const [viewport, setViewport] = useState<Viewport>(() => ({
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
    scale: initial?.scale ?? 1,
  }));
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number | null;
    lastX: number;
    lastY: number;
    active: boolean;
  }>({ pointerId: null, lastX: 0, lastY: 0, active: false });

  const [isDragging, setIsDragging] = useState(false);

  const clampViewport = useCallback(
    (v: Viewport, w: number, h: number): Viewport => {
      // Limit how far you can drag away from content
      const scaledW = world.w * v.scale;
      const scaledH = world.h * v.scale;
      const minX = Math.min(0, w - scaledW) - world.padding;
      const maxX = world.padding;
      const minY = Math.min(0, h - scaledH) - world.padding;
      const maxY = world.padding;
      return {
        x: Math.min(maxX, Math.max(minX, v.x)),
        y: Math.min(maxY, Math.max(minY, v.y)),
        scale: v.scale,
      };
    },
    [world],
  );

  const centerOn = useCallback(
    (wx: number, wy: number, scale?: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = scale ?? viewportRef.current.scale;
      const next: Viewport = {
        x: rect.width / 2 - wx * s,
        y: rect.height / 2 - wy * s,
        scale: s,
      };
      setViewport(clampViewport(next, rect.width, rect.height));
    },
    [clampViewport],
  );

  const fit = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = Math.min(rect.width / world.w, rect.height / world.h) * 0.95;
    const next: Viewport = {
      x: (rect.width - world.w * s) / 2,
      y: (rect.height - world.h * s) / 2,
      scale: Math.max(minScale, Math.min(maxScale, s)),
    };
    setViewport(clampViewport(next, rect.width, rect.height));
  }, [world, minScale, maxScale, clampViewport]);

  const zoomAt = useCallback(
    (screenX: number, screenY: number, factor: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setViewport((prev) => {
        const targetScale = Math.min(
          maxScale,
          Math.max(minScale, prev.scale * factor),
        );
        const actualFactor = targetScale / prev.scale;
        const sx = screenX - rect.left;
        const sy = screenY - rect.top;
        const nx = sx - (sx - prev.x) * actualFactor;
        const ny = sy - (sy - prev.y) * actualFactor;
        return clampViewport(
          { x: nx, y: ny, scale: targetScale },
          rect.width,
          rect.height,
        );
      });
    },
    [minScale, maxScale, clampViewport],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-no-drag]")) return;
      dragRef.current.active = true;
      dragRef.current.pointerId = e.pointerId;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      setIsDragging(true);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId)
        return;
      const dx = e.clientX - dragRef.current.lastX;
      const dy = e.clientY - dragRef.current.lastY;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      const rect = el.getBoundingClientRect();
      setViewport((prev) =>
        clampViewport(
          { x: prev.x + dx, y: prev.y + dy, scale: prev.scale },
          rect.width,
          rect.height,
        ),
      );
    };
    const onPointerUp = (e: PointerEvent) => {
      if (dragRef.current.pointerId === e.pointerId) {
        dragRef.current.active = false;
        dragRef.current.pointerId = null;
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {}
        setIsDragging(false);
      }
    };
    const onWheel = (e: WheelEvent) => {
      // Only zoom on ctrl/meta OR trackpad pinch — and always zoom for scroll wheel inside canvas
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX, e.clientY, factor);
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [zoomAt, clampViewport]);

  // Initial centering — fit the world to viewport, centered
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    const id = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      didInit.current = true;
      const s = Math.min(
        (rect.width * 0.92) / world.w,
        (rect.height * 0.92) / world.h,
      );
      const clampedS = Math.max(minScale, Math.min(maxScale, s));
      setViewport(
        clampViewport(
          {
            x: (rect.width - world.w * clampedS) / 2,
            y: (rect.height - world.h * clampedS) / 2,
            scale: clampedS,
          },
          rect.width,
          rect.height,
        ),
      );
    });
    return () => cancelAnimationFrame(id);
  }, [world.w, world.h, clampViewport, minScale, maxScale]);

  return {
    containerRef,
    viewport,
    setViewport,
    isDragging,
    centerOn,
    fit,
    zoomAt,
  };
}
