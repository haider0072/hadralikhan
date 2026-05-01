"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (client) return client;
  client = createClient(url, anon, {
    realtime: { params: { eventsPerSecond: 30 } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const REALTIME_ROOM = "portfolio-main";
export const REACTIONS = ["❤️", "🔥", "👏", "😂", "🤔"] as const;
export type ReactionEmoji = (typeof REACTIONS)[number];
