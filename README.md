# hadralikhan

Personal portfolio of **Haider Ali Khan** — Product Designer, PM, and Developer from Karachi.

A drag-to-explore, FigJam-style infinite pinboard with scattered polaroids, project cards, sticky notes, and a warm vintage-modern aesthetic. Built as a single-page spatial experience rather than a scroll.

→ [hadralikhan.vercel.app](https://hadralikhan.vercel.app)

## Highlights

- Infinite canvas (~4800 × 3200 world) with dot-grid background
- Drag to pan · scroll-wheel to zoom · double-click any card to focus
- Every card is individually pickable and draggable (positions persist in `localStorage`)
- Live minimap with viewport rectangle — click to jump anywhere
- Custom cursor with contextual labels (drag / panning / open)
- Warm light palette · serif display · handwritten accents
- Classic scrolling portfolio fallback at `/classic`

## Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Animation** — GSAP + Lenis (scroll version), pointer-event engine (board)
- **3D** — React Three Fiber (scroll version hero)
- **Content** — MDX-ready
- **Fonts** — Fraunces, Inter, JetBrains Mono, Caveat
- **Deploy** — Vercel

## Local

```bash
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

## Structure

```
src/
├─ app/
│  ├─ page.tsx            → / (board — the pinboard)
│  ├─ classic/page.tsx    → /classic (traditional scroll version)
│  └─ layout.tsx
├─ components/
│  ├─ board/              → infinite-canvas engine, cards, minimap, cursor
│  └─ sections/           → scroll-version sections (classic)
└─ data/
   ├─ site.ts
   ├─ experience.ts
   ├─ projects.ts
   └─ skills.ts
```

## License

[MIT](LICENSE) — code is open, content is mine.
