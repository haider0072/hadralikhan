const USERNAME = "haider0072";
const REVALIDATE_FAST = 60 * 30; // 30 min for activity
const REVALIDATE_SLOW = 60 * 60 * 6; // 6h for profile/repos
const REVALIDATE_LANG = 60 * 60 * 24; // 24h — expensive

type GhUser = {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
};

type GhRepo = {
  name: string;
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  description: string | null;
};

type GhEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[];
    ref?: string;
    ref_type?: string;
    action?: string;
  };
};

type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GithubStats = {
  user: Pick<GhUser, "login" | "name" | "avatar_url" | "html_url" | "public_repos" | "followers" | "following"> | null;
  totalStars: number;
  topRepos: Array<{ name: string; stars: number; url: string; language: string | null; description: string | null; pushed_at: string }>;
  languages: Array<{ name: string; count: number; pct: number }>;
  activity: Array<{ type: string; repo: string; message: string; when: string }>;
  calendar: {
    total: number;
    weeks: Array<{ days: ContribDay[] }>;
    streak: number;
  } | null;
};

function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "hadralikhan-portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch<T>(
  url: string,
  revalidate: number,
): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: ghHeaders(),
      next: { revalidate },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchUser(): Promise<GhUser | null> {
  return ghFetch<GhUser>(
    `https://api.github.com/users/${USERNAME}`,
    REVALIDATE_SLOW,
  );
}

async function fetchRepos(): Promise<GhRepo[]> {
  const out: GhRepo[] = [];
  for (let page = 1; page <= 3; page++) {
    const repos = await ghFetch<GhRepo[]>(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed&page=${page}`,
      REVALIDATE_SLOW,
    );
    if (!repos || repos.length === 0) break;
    out.push(...repos);
    if (repos.length < 100) break;
  }
  return out;
}

async function fetchEvents(): Promise<GhEvent[]> {
  return (
    (await ghFetch<GhEvent[]>(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
      REVALIDATE_FAST,
    )) ?? []
  );
}

async function fetchCalendar(): Promise<GithubStats["calendar"]> {
  // Public proxy — no auth required, returns normalized contribution data.
  type Resp = {
    total: Record<string, number>;
    contributions: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }>;
  };
  const data = await ghFetch<Resp>(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
    REVALIDATE_LANG,
  );
  if (!data) return null;
  const lastYearTotal = Object.values(data.total).reduce((a, b) => a + b, 0);
  // Bucket into weeks (sunday-start)
  const weeks: Array<{ days: ContribDay[] }> = [];
  let currentWeek: ContribDay[] = [];
  data.contributions.forEach((d) => {
    const dow = new Date(d.date).getUTCDay();
    if (dow === 0 && currentWeek.length) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
    currentWeek.push(d);
  });
  if (currentWeek.length) weeks.push({ days: currentWeek });

  // Current streak — walk backwards from last non-zero
  let streak = 0;
  for (let i = data.contributions.length - 1; i >= 0; i--) {
    if (data.contributions[i].count > 0) streak++;
    else if (streak > 0) break;
  }
  return { total: lastYearTotal, weeks, streak };
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

function summarizeEvent(e: GhEvent): {
  type: string;
  repo: string;
  message: string;
  when: string;
} | null {
  const repo = e.repo.name.replace(`${USERNAME}/`, "");
  const when = formatRelativeTime(e.created_at);
  switch (e.type) {
    case "PushEvent": {
      const msg = e.payload.commits?.[0]?.message?.split("\n")[0];
      if (!msg) return null;
      return { type: "push", repo, message: msg, when };
    }
    case "CreateEvent": {
      if (e.payload.ref_type === "repository")
        return { type: "create", repo, message: "new repository", when };
      if (e.payload.ref_type === "branch")
        return { type: "branch", repo, message: `branch ${e.payload.ref}`, when };
      return null;
    }
    case "PullRequestEvent":
      return { type: "pr", repo, message: `${e.payload.action} pull request`, when };
    case "IssuesEvent":
      return { type: "issue", repo, message: `${e.payload.action} issue`, when };
    case "ReleaseEvent":
      return { type: "release", repo, message: "released", when };
    case "WatchEvent":
      return { type: "star", repo, message: "starred", when };
    case "ForkEvent":
      return { type: "fork", repo, message: "forked", when };
    default:
      return null;
  }
}

export async function getGithubStats(): Promise<GithubStats> {
  const [user, repos, events, calendar] = await Promise.all([
    fetchUser(),
    fetchRepos(),
    fetchEvents(),
    fetchCalendar(),
  ]);

  const nonForks = repos.filter((r) => !r.fork && !r.archived);

  const totalStars = nonForks.reduce(
    (sum, r) => sum + (r.stargazers_count || 0),
    0,
  );

  const topRepos = [...nonForks]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      url: r.html_url,
      language: r.language,
      description: r.description,
      pushed_at: r.pushed_at,
    }));

  // Languages — count by primary language per non-fork repo
  const langCount = new Map<string, number>();
  nonForks.forEach((r) => {
    if (!r.language) return;
    langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  });
  const totalLang = Array.from(langCount.values()).reduce((a, b) => a + b, 0);
  const languages = Array.from(langCount.entries())
    .map(([name, count]) => ({
      name,
      count,
      pct: totalLang > 0 ? Math.round((count / totalLang) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const activity = events
    .map(summarizeEvent)
    .filter((e): e is NonNullable<ReturnType<typeof summarizeEvent>> => !!e)
    .slice(0, 4);

  return {
    user: user
      ? {
          login: user.login,
          name: user.name,
          avatar_url: user.avatar_url,
          html_url: user.html_url,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
        }
      : null,
    totalStars,
    topRepos,
    languages,
    activity,
    calendar,
  };
}
