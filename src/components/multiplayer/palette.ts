// Earthy palette that matches the portfolio. Each remote user gets a stable
// color derived from a hash of their client id.
const PALETTE = [
  "#c25b3a", // terracotta
  "#5a7a4f", // sage
  "#8a6b3e", // ochre
  "#3d5a6c", // dusk blue
  "#9b4a5e", // wine
  "#6b5a8a", // muted plum
  "#2a1f17", // deep ink
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function cursorColor(id: string): string {
  return PALETTE[hash(id) % PALETTE.length];
}
