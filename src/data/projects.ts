export type Project = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  stack: string[];
  href?: string;
  role: string;
  featured?: boolean;
  accent?: "terracotta" | "ochre" | "sage";
};

export const projects: Project[] = [
  {
    slug: "digitalhire",
    title: "DigitalHire",
    tagline:
      "3.5 years of one role turning into three. Designer, then PM, then development too.",
    year: "2022 — now",
    stack: ["Flutter", "Next.js", "NestJS", "TypeORM", "MySQL", "OpenAI"],
    role: "Design · Product · Engineering",
    featured: true,
    accent: "terracotta",
    href: "https://digitalhire.com",
  },
  {
    slug: "mochi",
    title: "Mochi",
    tagline: "Design-system generator. Prompt → code → Figma.",
    year: "2026",
    stack: ["TypeScript", "AI", "Figma API"],
    role: "Design & Engineering",
    featured: true,
    accent: "terracotta",
    href: "https://github.com/haider0072",
  },
  {
    slug: "audora",
    title: "Audora",
    tagline:
      "Professional music player. FLAC, MP3, WAV, YouTube, equalizer, cloud sync.",
    year: "2025",
    stack: ["Next.js", "Web Audio", "Cloud"],
    role: "Design & Engineering",
    featured: true,
    accent: "ochre",
  },
  {
    slug: "flowcraft",
    title: "FlowCraft",
    tagline:
      "AI creative platform. Sprite sheets, node-based workflows, video gen.",
    year: "2026",
    stack: ["Next.js", "React Flow", "OpenRouter", "Supabase"],
    role: "Design & Engineering",
    featured: true,
    accent: "sage",
    href: "https://flowcraft-mu.vercel.app/",
  },
  {
    slug: "ember",
    title: "Ember",
    tagline:
      "Torrent player. HTTP + torrent downloads, VLC streaming while downloading.",
    year: "2024",
    stack: ["Flutter", "Dart", "libtorrent"],
    role: "Design & Engineering",
    featured: true,
    accent: "terracotta",
  },
  {
    slug: "trading-bot",
    title: "Trading Bot",
    tagline: "Automated crypto trading with ML-driven prediction on Binance.",
    year: "2024",
    stack: ["Python", "ML", "Binance API"],
    role: "Engineering",
    featured: true,
    accent: "ochre",
  },
  {
    slug: "wisesend",
    title: "WiseSend",
    tagline: "File transfer app, live on Play Store.",
    year: "2023",
    stack: ["Flutter"],
    role: "Design & Engineering",
  },
  {
    slug: "stripes-generator",
    title: "Stripes Generator",
    tagline: "AI sprite-sheet generator for game-dev workflows.",
    year: "2024",
    stack: ["JavaScript", "AI"],
    role: "Engineering",
  },
  {
    slug: "framer-components",
    title: "Framer Components",
    tagline: "Custom Framer components for rapid product prototyping.",
    year: "2024",
    stack: ["Framer", "React"],
    role: "Design",
  },
  {
    slug: "job-post-generator",
    title: "Job-Post Generator",
    tagline: "AI job-post generator for recruiters.",
    year: "2025",
    stack: ["AI", "Next.js"],
    role: "Engineering",
  },
  {
    slug: "horizon-expander",
    title: "Horizon Expander",
    tagline: "Portrait to desktop wallpaper converter.",
    year: "2024",
    stack: ["AI", "Image"],
    role: "Engineering",
  },
  {
    slug: "localcast",
    title: "LocalCast",
    tagline: "Local network streaming, no cloud in the middle.",
    year: "2023",
    stack: ["Networking"],
    role: "Engineering",
  },
  {
    slug: "weddingdressai",
    title: "WeddingDressAI",
    tagline: "AI wedding dress color and style generation.",
    year: "2024",
    stack: ["AI", "Image"],
    role: "Engineering",
  },
  {
    slug: "real-time-translated-subtitles",
    title: "Live Subtitles",
    tagline: "Real-time translated subtitles for any audio source.",
    year: "2024",
    stack: ["Python", "AI"],
    role: "Engineering",
  },
  {
    slug: "product-deduplication",
    title: "Product Deduplication",
    tagline: "ML-based product deduplication across large catalogs.",
    year: "2024",
    stack: ["Python", "ML"],
    role: "Engineering",
  },
];

export const featured = projects.filter((p) => p.featured);
export const other = projects.filter((p) => !p.featured);
