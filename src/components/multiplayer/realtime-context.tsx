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
  if (!ctx) {
    return EMPTY;
  }
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

const CURSOR_THROTTLE_MS = 80;

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

  const channelRef = useRef<RealtimeChannel | null>(null);
  const cursorRef = useRef<PresenceData["cursor"]>(null);
  const lastSentRef = useRef(0);
  const pendingFlushRef = useRef<number | null>(null);
  const reactionListenersRef = useRef<Set<(e: ReactionEvent) => void>>(new Set());

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

    const syncOthers = () => {
      const state = channel.presenceState<PresenceData & { _id: string }>();
      const list: OtherUser[] = [];
      for (const key of Object.keys(state)) {
        if (key === clientId) continue;
        const entry = state[key]?.[0];
        if (!entry) continue;
        list.push({
          id: key,
          data: { country: entry.country ?? null, cursor: entry.cursor ?? null },
        });
      }
      setOthers(list);
    };

    channel.on("presence", { event: "sync" }, syncOthers);
    channel.on("presence", { event: "join" }, syncOthers);
    channel.on("presence", { event: "leave" }, syncOthers);
    channel.on("broadcast", { event: "reaction" }, ({ payload }) => {
      const e = payload as ReactionEvent;
      for (const cb of reactionListenersRef.current) cb(e);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ country, cursor: null } satisfies PresenceData);
        setReady(true);
      }
    });

    return () => {
      setReady(false);
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [supabase, clientId, country]);

  // Re-track when country resolves later
  useEffect(() => {
    if (!ready || !channelRef.current) return;
    channelRef.current.track({
      country,
      cursor: cursorRef.current,
    } satisfies PresenceData);
  }, [country, ready]);

  const flushCursor = useCallback(() => {
    pendingFlushRef.current = null;
    const ch = channelRef.current;
    if (!ch) return;
    lastSentRef.current = performance.now();
    ch.track({ country, cursor: cursorRef.current } satisfies PresenceData);
  }, [country]);

  const updateCursor = useCallback(
    (cursor: { worldX: number; worldY: number } | null) => {
      cursorRef.current = cursor;
      if (!ready || !channelRef.current) return;
      const now = performance.now();
      const since = now - lastSentRef.current;
      if (since >= CURSOR_THROTTLE_MS) {
        flushCursor();
      } else if (pendingFlushRef.current == null) {
        pendingFlushRef.current = window.setTimeout(
          flushCursor,
          CURSOR_THROTTLE_MS - since,
        );
      }
    },
    [ready, flushCursor],
  );

  const broadcastReaction = useCallback(
    (emoji: string, worldX: number, worldY: number) => {
      const ch = channelRef.current;
      const event: ReactionEvent = { emoji, worldX, worldY, from: clientId };
      // Always notify local listeners so the sender sees their own reaction
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
