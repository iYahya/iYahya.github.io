"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { SectionAnimate } from "@/components/SectionAnimate";
import type { Messages } from "@/lib/types";

export function ProjectGrid({ projects }: { projects: Messages["projects"] }) {
  const [filter, setFilter] = useState<"all" | "mobile" | "web" | "brand">("all");

  const visible = useMemo(() => {
    if (filter === "all") return projects.items;
    return projects.items.filter((p) => p.cat === filter);
  }, [filter, projects.items]);

  return (
    <>
      <div className="project-filters" role="tablist" aria-label="Project categories">
        <button
          type="button"
          className={`project-filter${filter === "all" ? " is-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {projects.filter_all}
        </button>
        <button
          type="button"
          className={`project-filter${filter === "mobile" ? " is-active" : ""}`}
          onClick={() => setFilter("mobile")}
        >
          {projects.filter_mobile}
        </button>
        <button
          type="button"
          className={`project-filter${filter === "web" ? " is-active" : ""}`}
          onClick={() => setFilter("web")}
        >
          {projects.filter_web}
        </button>
        <button
          type="button"
          className={`project-filter${filter === "brand" ? " is-active" : ""}`}
          onClick={() => setFilter("brand")}
        >
          {projects.filter_brand}
        </button>
      </div>
      <div className="projects-grid">
        {visible.map((item, i) => (
          <SectionAnimate key={item.name} className="project-card-wrap">
            <article className="project-card" data-cat={item.cat} style={{ "--i": i } as CSSProperties}>
              <div className="project-card-inner">
                <span className="project-badge">{item.cat}</span>
                <h3>{item.name}</h3>
                <p className="project-desc">{item.desc}</p>
                <ul className="project-stack" role="list">
                  {item.stack.split(",").map((s) => {
                    const pill = s.trim();
                    return pill ? <li key={pill}>{pill}</li> : null;
                  })}
                </ul>
                <div className="project-links">
                  {item.live && item.live !== "#" ? (
                    <a className="project-link" href={item.live} target="_blank" rel="noopener noreferrer">
                      {projects.live}
                    </a>
                  ) : null}
                  {item.github ? (
                    <a
                      className="project-link project-link--ghost"
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {projects.code}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </SectionAnimate>
        ))}
      </div>
    </>
  );
}
