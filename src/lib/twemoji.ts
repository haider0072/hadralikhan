/* Country code → twemoji flag SVG URL.
   Uses jdecked/twemoji fork via jsDelivr — fixes Windows/Chrome broken
   regional indicator rendering. */

const TWEMOJI_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg";

const GLOBE_CODEPOINT = "1f30d";

export function flagUrl(country: string | null | undefined): string {
  if (!country || country.length !== 2) {
    return `${TWEMOJI_BASE}/${GLOBE_CODEPOINT}.svg`;
  }
  const upper = country.toUpperCase();
  const code = [...upper]
    .map((ch) => (0x1f1e6 + (ch.charCodeAt(0) - 65)).toString(16))
    .join("-");
  return `${TWEMOJI_BASE}/${code}.svg`;
}

export function emojiUrl(emoji: string): string {
  const code = [...emoji]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((c) => c !== "fe0f")
    .join("-");
  return `${TWEMOJI_BASE}/${code}.svg`;
}
