const words = [
  "Minimal",
  "Vintage",
  "Modern",
  "Wabi-sabi",
  "Cinematic",
  "Handcrafted",
  "Intentional",
  "Warm",
];

export function Marquee() {
  const content = [...words, ...words, ...words];
  return (
    <section aria-hidden className="py-10 border-y border-rule bg-paper/40">
      <div className="marquee-mask overflow-hidden">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {content.map((w, i) => (
            <span
              key={i}
              className="font-serif italic text-5xl md:text-7xl text-ink/80 tracking-tight"
            >
              {w}
              <span className="text-terracotta"> ·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
