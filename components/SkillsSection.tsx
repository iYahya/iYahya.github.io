"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

import { SectionAnimate } from "@/components/SectionAnimate";
import type { Messages } from "@/lib/types";

const INITIAL_VISIBLE_CATEGORIES = 3;

export function SkillsSection({ skills }: { skills: Messages["skills"] }) {
  const [expanded, setExpanded] = useState(false);
  const categories = skills.categories;
  const hasMore = categories.length > INITIAL_VISIBLE_CATEGORIES;
  const visible = expanded ? categories : categories.slice(0, INITIAL_VISIBLE_CATEGORIES);

  return (
    <>
      <div className="skills-root" aria-live="polite">
        {visible.map((cat, ci) => (
          <SectionAnimate key={cat.title} className="skill-category-wrap">
            <div className="skill-category" style={{ "--cat": ci } as CSSProperties}>
              <h3 className="skill-category-title">{cat.title}</h3>
              <ul className="skill-badges" role="list">
                {cat.items.map((item, ii) => (
                  <li key={item} className="skill-badge" style={{ "--i": ii } as CSSProperties}>
                    <span className="skill-badge-inner">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionAnimate>
        ))}
      </div>
      {hasMore ? (
        <button
          type="button"
          className="btn btn-outline skills-expand-btn"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? skills.show_less : skills.show_more}
        </button>
      ) : null}
    </>
  );
}
