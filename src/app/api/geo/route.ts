import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { country } = geolocation(req);
  return Response.json({ country: country ?? null });
}
