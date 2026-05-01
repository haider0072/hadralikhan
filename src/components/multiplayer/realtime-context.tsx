"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabase, REALTIME_ROOM } from "@/lib/supabase";

export type PresenceData = {
  country: string | null;
  cursor: { worldX: number; worldY: number } | null;
};

export type OtherUser = { id: string; data: PresenceData };

export type ReactionEvent = {
  emoji: string;
  worldX: number;
  worldY: number;
  from: string;
};

type RealtimeContextValue = {
  ready: boolean;
  self: PresenceData;
  others: OtherUser[];
  updateCursor: (cursor: { worldX: number; worldY: number } | null) => void;
  broadcastReaction: (emoji: string, worldX: number, worldY: number) => void;
  onReaction: (cb: (e: ReactionEvent) => void) => () => void;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function useRealtime(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) return EMPTY;
  return ctx;
}

const EMPTY: RealtimeContextValue = {
  ready: false,
  self: { country: null, cursor: null },
  others: [],
  updateCursor: () => {},
  broadcastReaction: () => {},
  onReaction: () => () => {},
};

const CURSOR_SEND_MS = 60;
const CURSOR_STALE_MS = 4000;

type CursorBroadcast = {
  from: string;
  worldX: number | null;
  worldY: number | null;
};

function makeClientId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "haider.rt.client_id.v1";
  try {
    const existing = sessionStorage.getItem(KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabase(), []);
  const clientId = useMemo(() => makeClientId(), []);

  const [country, setCountry] = useState<string | null>(null);
  const [others, setOthers] = useState<OtherUser[]>([]);
  const [ready, setReady] = useState(false);
  const [reconnectKey, setReconnectKey] = useState(0);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const cursorRef = useRef<PresenceData["cursor"]>(null);
  const countryRef = useRef<string | null>(null);
  const lastSentRef = useRef(0);
  const pendingFlushRef = useRef<number | null>(null);
  const reactionListenersRef = useRef<Set<(e: ReactionEvent) => void>>(new Set());
  const reconnectTimerRef = useRef<number | null>(null);

  // Per-client cursor map (id -> latest cursor + timestamp). Stays in a ref so
  // rapid-fire broadcast events don't churn React state — we mirror it into
  // `others` via a single throttled update.
  const cursorMapRef = useRef<
    Map<string, { x: number | null; y: number | null; ts: number }>
  >(new Map());
  // Per-client country (set on presence join/sync)
  const countryMapRef = useRef<Map<string, string | null>>(new Map());

  const recomputeOthers = useCallback(() => {
    const list: OtherUser[] = [];
    const now = performance.now();
    for (const [id, country] of countryMapRef.current.entries()) {
      if (id === clientId) continue;
      const cur = cursorMapRef.current.get(id);
      const fresh = cur && now - cur.ts < CURSOR_STALE_MS;
      const cursor =
        fresh && cur && cur.x != null && cur.y != null
          ? { worldX: cur.x, worldY: cur.y }
          : null;
      list.push({ id, data: { country, cursor } });
    }
    setOthers(list);
  }, [clientId]);

  // Fetch country once
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { country: string | null }) => {
        if (!cancelled) setCountry(d.country);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Channel lifecycle
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel(REALTIME_ROOM, {
      config: {
        presence: { key: clientId },
        broadcast: { self: false, ack: false },
      },
    });
    channelRef.current = channel;

    const syncPresence = () => {
      const state = channel.presenceState<{ country: string | null }>();
      const next = new Map<string, string | null>();
      for (const key of Object.keys(state)) {
        const entry = state[key]?.[0];
        next.set(key, entry?.country ?? null);
      }
      countryMapRef.current = next;
      // Drop cursor entries for users no longer present
      for (const id of Array.from(cursorMapRef.current.keys())) {
        if (!next.has(id)) cursorMapRef.current.delete(id);
      }
      recomputeOthers();
    };

    channel.on("presence", { event: "sync" }, syncPresence);
    channel.on("presence", { event: "join" }, syncPresence);
    channel.on("presence", { event: "leave" }, syncPresence);

    channel.on("broadcast", { event: "cursor" }, ({ payload }) => {
      const p = payload as CursorBroadcast;
      if (!p?.from || p.from === clientId) return;
      cursorMapRef.current.set(p.from, {
        x: p.worldX,
        y: p.worldY,
        ts: performance.now(),
      });
      recomputeOthers();
    });

    channel.on("broadcast", { event: "reaction" }, ({ payload }) => {
      const e = payload as ReactionEvent;
      for (const cb of reactionListenersRef.current) cb(e);
    });

    const scheduleReconnect = () => {
      if (reconnectTimerRef.current != null) return;
      reconnectTimerRef.current = window.setTimeout(() => {
        reconnectTimerRef.current = null;
        setReconnectKey((k) => k + 1);
      }, 2000);
    };

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Track presence ONCE — country only. Cursor moves over broadcast.
        await channel.track({ country: countryRef.current });
        setReady(true);
      } else if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        setReady(false);
        setOthers([]);
        cursorMapRef.current.clear();
        countryMapRef.current.clear();
        scheduleReconnect();
      }
    });

    // Periodically prune stale cursors
    const pruneInterval = window.setInterval(() => {
      const now = performance.now();
      let changed = false;
      for (const [id, cur] of cursorMapRef.current.entries()) {
        if (now - cur.ts > CURSOR_STALE_MS) {
          cursorMapRef.current.delete(id);
          changed = true;
        }
      }
      if (changed) recomputeOthers();
    }, 1500);

    return () => {
      setReady(false);
      channelRef.current = null;
      window.clearInterval(pruneInterval);
      if (reconnectTimerRef.current != null) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [supabase, clientId, reconnectKey, recomputeOthers]);

  // Reconnect when tab becomes visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && !ready) {
        setReconnectKey((k) => k + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [ready]);

  // Re-track when country resolves later (presence track, infrequent)
  useEffect(() => {
    countryRef.current = country;
    if (!ready || !channelRef.current) return;
    channelRef.current.track({ country });
  }, [country, ready]);

  const flushCursor = useCallback(() => {
    pendingFlushRef.current = null;
    const ch = channelRef.current;
    if (!ch) return;
    lastSentRef.current = performance.now();
    const cur = cursorRef.current;
    ch.send({
      type: "broadcast",
      event: "cursor",
      payload: {
        from: clientId,
        worldX: cur?.worldX ?? null,
        worldY: cur?.worldY ?? null,
      } satisfies CursorBroadcast,
    });
  }, [clientId]);

  const updateCursor = useCallback(
    (cursor: { worldX: number; worldY: number } | null) => {
      cursorRef.current = cursor;
      if (!ready || !channelRef.current) return;
      const now = performance.now();
      const since = now - lastSentRef.current;
      if (since >= CURSOR_SEND_MS) {
        flushCursor();
      } else if (pendingFlushRef.current == null) {
        pendingFlushRef.current = window.setTimeout(
          flushCursor,
          CURSOR_SEND_MS - since,
        );
      }
    },
    [ready, flushCursor],
  );

  const broadcastReaction = useCallback(
    (emoji: string, worldX: number, worldY: number) => {
      const ch = channelRef.current;
      const event: ReactionEvent = { emoji, worldX, worldY, from: clientId };
      for (const cb of reactionListenersRef.current) cb(event);
      if (!ch) return;
      ch.send({ type: "broadcast", event: "reaction", payload: event });
    },
    [clientId],
  );

  const onReaction = useCallback((cb: (e: ReactionEvent) => void) => {
    reactionListenersRef.current.add(cb);
    return () => {
      reactionListenersRef.current.delete(cb);
    };
  }, []);

  const value = useMemo<RealtimeContextValue>(
    () => ({
      ready,
      self: { country, cursor: null },
      others,
      updateCursor,
      broadcastReaction,
      onReaction,
    }),
    [ready, country, others, updateCursor, broadcastReaction, onReaction],
  );

  return (
    <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
  );
}
