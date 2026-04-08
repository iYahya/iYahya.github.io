"use client";

/**
 * Renders the “GitHub repositories” block (#contributions) when `repos` is non-empty.
 * Currently `app/page.tsx` and `app/ar/page.tsx` pass an empty array so this returns null.
 */

import { SectionAnimate } from "@/components/SectionAnimate";
import type { ContributedRepo, Messages } from "@/lib/types";

export function ContributedReposSection({
  messages,
  repos,
}: {
  messages: Messages["contributed"];
  repos: ContributedRepo[];
}) {
  if (!repos.length) return null;

  return (
    <section id="contributions" className="section" aria-labelledby="contributions-title">
      <h2 id="contributions-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.section_title }} />
      <p className="contact-lead contributions-lead" dangerouslySetInnerHTML={{ __html: messages.subtitle }} />
      <div className="repo-grid">
        {repos.map((repo) => (
          <SectionAnimate key={repo.id} className="repo-card-wrap">
            <a className="repo-card" href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <div className="repo-card-head">
                <h3 className="repo-card-name">{repo.full_name}</h3>
                {repo.fork ? <span className="repo-fork-badge">{messages.fork_badge}</span> : null}
              </div>
              {repo.description ? <p className="repo-card-desc">{repo.description}</p> : <p className="repo-card-desc repo-card-desc--muted">—</p>}
              <div className="repo-card-meta">
                {repo.language ? <span className="repo-lang">{repo.language}</span> : null}
                <span className="repo-stars" aria-label={`${messages.stars_label}: ${repo.stargazers_count}`}>
                  ★ {repo.stargazers_count}
                </span>
              </div>
            </a>
          </SectionAnimate>
        ))}
      </div>
    </section>
  );
}
