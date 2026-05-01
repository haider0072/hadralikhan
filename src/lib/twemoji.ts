/* Country code → twemoji flag SVG URL.
   Uses jdecked/twemoji fork via jsDelivr — fixes Windows/Chrome broken
   regional indicator rendering. */

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg";

const GLOBE_CODEPOINT = "1f30d";

const flagUrlCache = new Map<string, string>();
const flagFullUrlCache = new Map<string, string>();

export function flagUrl(country: string | null | undefined): string {
  const key = country ?? "";
  const hit = flagUrlCache.get(key);
  if (hit) return hit;
  let url: string;
  if (!country || country.length !== 2) {
    url = `${TWEMOJI_BASE}/${GLOBE_CODEPOINT}.svg`;
  } else {
    const upper = country.toUpperCase();
    const code = [...upper]
      .map((ch) => (0x1f1e6 + (ch.charCodeAt(0) - 65)).toString(16))
      .join("-");
    url = `${TWEMOJI_BASE}/${code}.svg`;
  }
  flagUrlCache.set(key, url);
  return url;
}

/* Full-bleed rectangular flag (no padding) — for circular avatars where we
   want the flag to fill the whole circle. flagcdn.com hosts clean SVGs. */
export function flagFullUrl(country: string | null | undefined): string {
  const key = country ?? "";
  const hit = flagFullUrlCache.get(key);
  if (hit) return hit;
  const url =
    !country || country.length !== 2
      ? `${TWEMOJI_BASE}/${GLOBE_CODEPOINT}.svg`
      : `https://flagcdn.com/${country.toLowerCase()}.svg`;
  flagFullUrlCache.set(key, url);
  return url;
}

export function emojiUrl(emoji: string): string {
  const code = [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((c) => c !== "fe0f")
    .join("-");
  return `${TWEMOJI_BASE}/${code}.svg`;
}
