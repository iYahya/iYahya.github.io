import type { ContributedRepo, ContributedExtraRepo, Messages } from "@/lib/types";

interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h) || 1;
}

function manualToRepo(e: ContributedExtraRepo, index: number): ContributedRepo {
  const name = e.full_name.includes("/") ? e.full_name.split("/")[1]! : e.full_name;
  return {
    id: hashId(`${e.full_name}-${index}`),
    full_name: e.full_name,
    name,
    html_url: e.html_url,
    description: e.description || null,
    fork: Boolean(e.fork),
    language: e.language ?? null,
    stargazers_count: e.stargazers_count ?? 0,
    pushed_at: e.pushed_at ?? new Date().toISOString(),
    source: "manual",
  };
}

/** Derive login from profile URL `https://github.com/iYahya` */
export function githubUsernameFromMessages(messages: Messages): string {
  try {
    const u = new URL(messages.contact.github_href);
    const seg = u.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
    return seg && seg.length > 0 ? seg : "iYahya";
  } catch {
    return "iYahya";
  }
}

/**
 * Loads public repos for `username` at build time and merges `extra` (e.g. org repos you contributed to).
 * Set GITHUB_TOKEN in CI for 5k/hr limit; unauthenticated is 60/hr per IP.
 */
export async function loadContributedRepos(username: string, extra: ContributedExtraRepo[]): Promise<ContributedRepo[]> {
  const manual = (extra ?? []).map((e, i) => manualToRepo(e, i));

  let apiRepos: ContributedRepo[] = [];
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&type=owner`,
      { headers }
    );

    if (res.ok) {
      const data: GitHubApiRepo[] = await res.json();
      apiRepos = data.map((r) => ({
        id: r.id,
        full_name: r.full_name,
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        fork: r.fork,
        language: r.language,
        stargazers_count: r.stargazers_count,
        pushed_at: r.pushed_at,
        source: "api",
      }));
    } else {
      console.warn(`[github-repos] API ${res.status} ${res.statusText} — public repos skipped; showing manual entries only.`);
    }
  } catch (e) {
    console.warn("[github-repos] fetch failed:", e);
  }

  const byKey = new Map<string, ContributedRepo>();
  for (const r of apiRepos) {
    byKey.set(r.full_name.toLowerCase(), r);
  }
  for (const r of manual) {
    byKey.set(r.full_name.toLowerCase(), r);
  }

  return Array.from(byKey.values())
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 48);
}
