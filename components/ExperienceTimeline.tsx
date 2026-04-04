"use client";

import { useEffect, useRef, useState } from "react";

import { useInViewOnce } from "@/hooks/useInViewOnce";
import type { Messages } from "@/lib/types";

function TimelineItem({ job, current }: { job: Messages["experience"]["jobs"][0]; current: string }) {
  const { ref, visible } = useInViewOnce<HTMLLIElement>();
  return (
    <li ref={ref} className={`timeline-item section-animate${visible ? " is-visible" : ""}`.trim()}>
      <span className="timeline-dot" aria-hidden />
      <article className="timeline-card">
        <header className="timeline-card-head">
          <h3>{job.role}</h3>
          <p className="timeline-company">{job.company}</p>
          <p className="timeline-meta">
            {job.meta} · {current}
          </p>
        </header>
        <ul className="timeline-bullets" role="list">
          {job.bullets.map((b) => (
            <li key={b.slice(0, 48)} dangerouslySetInnerHTML={{ __html: b }} />
          ))}
        </ul>
      </article>
    </li>
  );
}

export function ExperienceTimeline({ experience }: { experience: Messages["experience"] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLineVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setLineVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`timeline${lineVisible ? " is-line-visible" : ""}`}>
      <div className="timeline-line" aria-hidden />
      <ul className="timeline-list" role="list">
        {experience.jobs.map((job) => (
          <TimelineItem key={job.company + job.role} job={job} current={experience.current} />
        ))}
      </ul>
    </div>
  );
}
