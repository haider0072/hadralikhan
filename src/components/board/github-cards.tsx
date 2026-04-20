import type { GithubStats } from "@/lib/github";

const GH_URL = "https://github.com/haider0072";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Kotlin: "#7F52FF",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Java: "#e07b2c",
  HTML: "#e34f26",
  CSS: "#1572b6",
  SCSS: "#cf649a",
  Shell: "#89e051",
  Vue: "#41b883",
  Ruby: "#CC342D",
  "C++": "#00599c",
  C: "#555555",
};

function LangMark({ name, size = 18 }: { name: string; size?: number }) {
  const bg = langColors[name] ?? "#6b5a4a";
  const commonRect = (fill: string) => (
    <rect width="32" height="32" rx="6" fill={fill} />
  );
  const label = (
    text: string,
    fg: string,
    opts: { size?: number; y?: number } = {},
  ) => (
    <text
      x="16"
      y={opts.y ?? 22}
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="900"
      fontSize={opts.size ?? 13}
      fill={fg}
      letterSpacing="-0.5"
    >
      {text}
    </text>
  );

  const mark = (() => {
    switch (name) {
      case "TypeScript":
        return (
          <>
            {commonRect("#3178c6")}
            {label("TS", "#fff")}
          </>
        );
      case "JavaScript":
        return (
          <>
            {commonRect("#f7df1e")}
            {label("JS", "#000")}
          </>
        );
      case "HTML":
        return (
          <>
            {commonRect("#e34f26")}
            {label("H5", "#fff", { size: 12 })}
          </>
        );
      case "CSS":
        return (
          <>
            {commonRect("#1572b6")}
            {label("C3", "#fff", { size: 12 })}
          </>
        );
      case "SCSS":
        return (
          <>
            {commonRect("#cf649a")}
            {label("S", "#fff")}
          </>
        );
      case "Python":
        return (
          <>
            <defs>
              <linearGradient id="py-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3776ab" />
                <stop offset="100%" stopColor="#ffd343" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="6" fill="url(#py-g)" />
            {label("Py", "#fff", { size: 12 })}
          </>
        );
      case "Dart":
        return (
          <>
            {commonRect("#00B4AB")}
            {label("D", "#fff")}
          </>
        );
      case "Kotlin":
        return (
          <>
            <defs>
              <linearGradient id="kt-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c757bc" />
                <stop offset="50%" stopColor="#d47f42" />
                <stop offset="100%" stopColor="#f6ba1f" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="6" fill="url(#kt-g)" />
            {label("K", "#fff")}
          </>
        );
      case "Go":
        return (
          <>
            {commonRect("#00ADD8")}
            {label("Go", "#fff", { size: 11 })}
          </>
        );
      case "Rust":
        return (
          <>
            {commonRect("#dea584")}
            {label("Rs", "#2b1b12", { size: 11 })}
          </>
        );
      case "Swift":
        return (
          <>
            {commonRect("#F05138")}
            {label("Sw", "#fff", { size: 11 })}
          </>
        );
      case "Java":
        return (
          <>
            {commonRect("#e07b2c")}
            {label("Jv", "#fff", { size: 11 })}
          </>
        );
      case "Vue":
        return (
          <>
            {commonRect("#41b883")}
            {label("V", "#fff")}
          </>
        );
      case "Shell":
        return (
          <>
            {commonRect("#89e051")}
            {label(">_", "#000", { size: 10 })}
          </>
        );
      case "C++":
        return (
          <>
            {commonRect("#00599c")}
            {label("C++", "#fff", { size: 9 })}
          </>
        );
      case "C":
        return (
          <>
            {commonRect("#555555")}
            {label("C", "#fff")}
          </>
        );
      case "Ruby":
        return (
          <>
            {commonRect("#CC342D")}
            {label("Rb", "#fff", { size: 11 })}
          </>
        );
      default:
        return (
          <>
            {commonRect(bg)}
            {label(name.slice(0, 1).toUpperCase(), "#fff")}
          </>
        );
    }
  })();

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
    >
      {mark}
    </svg>
  );
}

export function ContributionCalendarCard({
  data,
}: {
  data: GithubStats["calendar"];
}) {
  if (!data) return <CalendarPlaceholder />;
  const levelBg: Record<number, string> = {
    0: "#ecdfca",
    1: "#e4c29a",
    2: "#d4955f",
    3: "#b8763e",
    4: "#8a4e28",
  };
  return (
    <a
      href={GH_URL}
      target="_blank"
      rel="noreferrer"
      data-no-drag
      data-cursor-text="GitHub"
      className="block bg-paper border border-ink/10 rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.3)] p-5 w-[520px] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(42,31,23,0.4)] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            GitHub · contributions
          </p>
          <p className="mt-1 font-serif text-xl tracking-tight">
            <span className="font-medium">{data.total.toLocaleString()}</span>
            <span className="text-ink-muted text-sm ml-2">past year</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
            streak
          </p>
          <p className="mt-1 font-serif text-xl tracking-tight text-terracotta">
            {data.streak} <span className="text-sm">days</span>
          </p>
        </div>
      </div>
      <div className="flex gap-[3px]">
        {data.weeks.slice(-52).map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const d = w.days[di];
              if (!d) {
                return (
                  <div
                    key={di}
                    className="w-[9px] h-[9px] rounded-[2px] bg-transparent"
                  />
                );
              }
              return (
                <div
                  key={di}
                  title={`${d.date}: ${d.count} contribution${d.count !== 1 ? "s" : ""}`}
                  className="w-[9px] h-[9px] rounded-[2px]"
                  style={{ background: levelBg[d.level] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
        <span>@haider0072</span>
        <div className="flex items-center gap-2">
          <span>less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className="w-[9px] h-[9px] rounded-[2px]"
              style={{ background: levelBg[l] }}
            />
          ))}
          <span>more</span>
        </div>
      </div>
    </a>
  );
}

function CalendarPlaceholder() {
  return (
    <div
      data-no-drag
      className="bg-paper border border-ink/10 rounded-sm p-5 w-[520px] font-mono text-[11px] text-ink-muted"
    >
      GitHub contributions · unavailable
    </div>
  );
}

export function StatsSummaryCard({ data }: { data: GithubStats }) {
  const stats = [
    { label: "Public repos", value: data.user?.public_repos ?? 0 },
    { label: "Total stars", value: data.totalStars },
    { label: "Followers", value: data.user?.followers ?? 0 },
    { label: "Following", value: data.user?.following ?? 0 },
  ];
  return (
    <a
      href="https://github.com/haider0072"
      target="_blank"
      rel="noreferrer"
      data-no-drag
      data-cursor-text="GitHub"
      className="block bg-paper border border-ink/10 rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.3)] p-5 w-[300px] hover:-translate-y-1 transition-transform"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
          GitHub · @haider0072
        </p>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.3-5.23-1.28-5.23-5.67 0-1.25.44-2.27 1.17-3.07-.12-.3-.5-1.45.11-3.02 0 0 .96-.3 3.15 1.17a10.95 10.95 0 0 1 5.74 0c2.2-1.47 3.15-1.17 3.15-1.17.62 1.57.23 2.72.1 3.02.74.8 1.17 1.82 1.17 3.07 0 4.4-2.68 5.36-5.24 5.65.42.36.77 1.06.77 2.13v3.16c0 .3.2.66.79.54A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-serif text-3xl leading-none tracking-tight">
              {s.value}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </a>
  );
}

export function ActivityFeedCard({ data }: { data: GithubStats["activity"] }) {
  return (
    <a
      href={GH_URL}
      target="_blank"
      rel="noreferrer"
      data-no-drag
      data-cursor-text="GitHub"
      className="block bg-[#18120c] text-[#f4ece0] rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.45)] p-5 w-[360px] font-mono text-[11px] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(42,31,23,0.55)] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#f4ece0]/50 uppercase tracking-[0.22em] text-[10px]">
          haider@karachi · activity
        </span>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#c4623d]" />
          <span className="h-2 w-2 rounded-full bg-[#b88a3e]" />
          <span className="h-2 w-2 rounded-full bg-[#7a8268]" />
        </div>
      </div>
      {data.length === 0 ? (
        <p className="text-[#f4ece0]/50">$ gh events · quiet right now</p>
      ) : (
        <ul className="space-y-2.5">
          {data.slice(0, 4).map((a, i) => (
            <li key={i} className="flex gap-2 leading-snug">
              <span className="text-[#c4623d] shrink-0">›</span>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[#b88a3e] truncate">{a.repo}</span>
                  <span className="text-[#f4ece0]/40 text-[10px] shrink-0 whitespace-nowrap">
                    {a.when}
                  </span>
                </div>
                <p className="text-[#f4ece0]/85 truncate">
                  <span className="text-[#7a8268]">{a.type}</span>
                  {a.message ? <span> · {a.message}</span> : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}

export function LanguagesCard({
  data,
}: {
  data: GithubStats["languages"];
}) {
  const total = data.reduce((s, l) => s + l.count, 0) || 1;
  // Donut segments
  let offset = 0;
  const circumference = 2 * Math.PI * 36;

  return (
    <a
      href={GH_URL}
      target="_blank"
      rel="noreferrer"
      data-no-drag
      data-cursor-text="GitHub"
      className="block bg-paper border border-ink/10 rounded-sm shadow-[0_14px_30px_-10px_rgba(42,31,23,0.3)] p-5 w-[300px] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(42,31,23,0.4)] transition-all"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
        Top languages
      </p>
      <div className="mt-4 flex items-center gap-5">
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#e7d9c1"
            strokeWidth="10"
          />
          {data.map((l) => {
            const pct = l.count / total;
            const seg = circumference * pct;
            const el = (
              <circle
                key={l.name}
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke={langColors[l.name] ?? "#6b5a4a"}
                strokeWidth="10"
                strokeDasharray={`${seg} ${circumference - seg}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
                strokeLinecap="butt"
              />
            );
            offset += seg;
            return el;
          })}
        </svg>
        <ul className="flex-1 space-y-2 text-xs">
          {data.slice(0, 5).map((l) => (
            <li key={l.name} className="flex items-center gap-2">
              <LangMark name={l.name} size={18} />
              <span className="flex-1 text-ink truncate">{l.name}</span>
              <span className="font-mono text-[10px] text-ink-muted">
                {l.pct}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}
