"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { LocaleRoot } from "@/components/LocaleRoot";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SectionAnimate } from "@/components/SectionAnimate";
import { ContributedReposSection } from "@/components/ContributedReposSection";
import { SkillsSection } from "@/components/SkillsSection";
import type { ContributedRepo, Locale, Messages } from "@/lib/types";

const THEME_KEY = "theme";

/** Nav omits Skills/Education links; highlight About while user is in those sections. */
const NAV_CORE = [
  ["#hero", "home"],
  ["#about", "about"],
  ["#experience", "experience"],
  ["#projects", "projects"],
] as const;

const ABOUT_SECTION_GROUP = new Set<string>(["about", "skills", "education"]);

function isNavLinkActive(activeId: string, linkSectionId: string) {
  if (linkSectionId === "hero") return activeId === "hero";
  if (linkSectionId === "about") return ABOUT_SECTION_GROUP.has(activeId);
  return activeId === linkSectionId;
}

function cvRequestMailtoHref(emailHref: string, subject: string) {
  const addr = emailHref.replace(/^mailto:/i, "").trim();
  return `mailto:${addr}?subject=${encodeURIComponent(subject)}`;
}

export function Portfolio({
  locale,
  messages,
  contributedRepos = [],
}: {
  locale: Locale;
  messages: Messages;
  contributedRepos?: ContributedRepo[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [photoFallback, setPhotoFallback] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");
  const navSpyObserver = useRef<IntersectionObserver | null>(null);
  const scrollHandler = useRef<(() => void) | null>(null);

  const cvMailtoHref = useMemo(
    () =>
      cvRequestMailtoHref(
        messages.contact.email_href,
        locale === "ar" ? "طلب السيرة الذاتية" : "CV request"
      ),
    [locale, messages.contact.email_href]
  );

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const ids =
      contributedRepos.length > 0
        ? ["hero", "about", "skills", "experience", "projects", "contributions", "education", "contact"]
        : ["hero", "about", "skills", "experience", "projects", "education", "contact"];
    const sections: HTMLElement[] = ids.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const setActive = (id: string) => setActiveId(id);

    navSpyObserver.current?.disconnect();
    navSpyObserver.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => navSpyObserver.current?.observe(s));

    const sync = () => {
      const mid = window.innerHeight * 0.35;
      let bestId: string | null = null;
      let bestDist = Infinity;
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.bottom < 64 || r.top > window.innerHeight) continue;
        const center = r.top + r.height / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          bestId = sec.id;
        }
      }
      if (bestId) setActive(bestId);
    };

    if (scrollHandler.current) window.removeEventListener("scroll", scrollHandler.current);
    scrollHandler.current = sync;
    sync();
    window.addEventListener("scroll", scrollHandler.current, { passive: true });

    return () => {
      navSpyObserver.current?.disconnect();
      if (scrollHandler.current) window.removeEventListener("scroll", scrollHandler.current);
    };
  }, [locale, messages, contributedRepos.length]);

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  }

  return (
    <LocaleRoot locale={locale}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`site-header${headerScrolled ? " is-scrolled" : ""}`} id="site-header">
        <nav className="nav" aria-label="Primary">
          <a className="nav-logo" href="#hero" aria-label="Home">
            {"{ YH }"}
          </a>
          <ul className={`nav-links${mobileOpen ? " is-open" : ""}`} id="nav-links">
            {[
              ...NAV_CORE,
              ...(contributedRepos.length > 0 ? ([["#contributions", "contributions"]] as const) : []),
              ["#contact", "contact"] as const,
            ].map(([href, navKey]) => {
              const id = href.slice(1);
              const label = messages.nav[navKey] ?? navKey;
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={isNavLinkActive(activeId, id) ? "is-active" : undefined}
                    onClick={() => setMobileOpen(false)}
                    dangerouslySetInnerHTML={{ __html: label }}
                  />
                </li>
              );
            })}
          </ul>
          <div className="nav-controls">
            <div className="lang-toggle" role="group" aria-label="Language">
              <Link href="/" className="lang-btn" aria-pressed={locale === "en" ? true : false} scroll={false}>
                EN
              </Link>
              <Link href="/ar" className="lang-btn" aria-pressed={locale === "ar" ? true : false} scroll={false}>
                AR
              </Link>
            </div>
            <button type="button" className="theme-toggle" aria-label="Toggle theme" title="Toggle theme" onClick={toggleTheme}>
              <span className="theme-icon theme-icon--sun" aria-hidden>
                ☀
              </span>
              <span className="theme-icon theme-icon--moon" aria-hidden>
                ☽
              </span>
            </button>
            <a className="btn btn-ghost nav-cv" href={cvMailtoHref} dangerouslySetInnerHTML={{ __html: messages.controls.download_cv }} />
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={mobileOpen}
            aria-controls="nav-links"
            aria-label={mobileOpen ? messages.nav.menu_close : messages.nav.menu_open}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>

      <main id="main">
        <section id="hero" className="section hero">
          <div className="hero-inner">
            <p className="hero-greeting hero-reveal" style={{ "--d": "0ms" } as CSSProperties} dangerouslySetInnerHTML={{ __html: messages.hero.greeting }} />
            <h1 className="hero-name hero-reveal" style={{ "--d": "80ms" } as CSSProperties}>
              <span dangerouslySetInnerHTML={{ __html: messages.hero.name }} />
            </h1>
            <p className="hero-title hero-reveal" style={{ "--d": "160ms" } as CSSProperties} dangerouslySetInnerHTML={{ __html: messages.hero.title }} />
            <p className="hero-subtitle hero-reveal" style={{ "--d": "240ms" } as CSSProperties} dangerouslySetInnerHTML={{ __html: messages.hero.subtitle }} />
            <div className="hero-cta hero-reveal" style={{ "--d": "320ms" } as CSSProperties}>
              <a className="btn btn-primary" href="#projects" dangerouslySetInnerHTML={{ __html: messages.hero.cta_primary }} />
              <a className="btn btn-outline" href={cvMailtoHref} dangerouslySetInnerHTML={{ __html: messages.hero.cta_secondary }} />
            </div>
          </div>
          <a className="hero-scroll" href="#about" aria-label={messages.hero.scroll_aria}>
            <span className="hero-scroll-icon" aria-hidden />
          </a>
        </section>

        <section id="about" className="section" aria-labelledby="about-title">
          <SectionAnimate>
            <h2 id="about-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.about.section_title }} />
            <div className="about-grid">
              <div className={`about-visual${photoFallback ? " is-fallback" : ""}`}>
                {!photoFallback ? (
                  <Image
                    className="about-photo"
                    src="/assets/profile.png"
                    alt={messages.about.photo_alt}
                    width={320}
                    height={320}
                    loading="lazy"
                    onError={() => setPhotoFallback(true)}
                  />
                ) : null}
                <div className="about-avatar" aria-hidden>
                  <span>YH</span>
                </div>
              </div>
              <div className="about-copy">
                <p className="about-bio" dangerouslySetInnerHTML={{ __html: messages.about.bio }} />
                <ul className="about-stats" role="list">
                  <li className="about-stat">
                    <span className="about-stat-value">30+</span>
                    <span className="about-stat-label" dangerouslySetInnerHTML={{ __html: messages.about.stat_apps }} />
                  </li>
                  <li className="about-stat">
                    <span className="about-stat-value">8+</span>
                    <span className="about-stat-label" dangerouslySetInnerHTML={{ __html: messages.about.stat_years }} />
                  </li>
                  <li className="about-stat">
                    <span className="about-stat-value">2</span>
                    <span className="about-stat-label" dangerouslySetInnerHTML={{ __html: messages.about.stat_companies }} />
                  </li>
                </ul>
              </div>
            </div>
          </SectionAnimate>
        </section>

        <section id="skills" className="section" aria-labelledby="skills-title">
          <h2 id="skills-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.skills.section_title }} />
          <SkillsSection skills={messages.skills} />
        </section>

        <section id="experience" className="section" aria-labelledby="experience-title">
          <h2 id="experience-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.experience.section_title }} />
          <ExperienceTimeline experience={messages.experience} />
        </section>

        <section id="projects" className="section" aria-labelledby="projects-title">
          <h2 id="projects-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.projects.section_title }} />
          <ProjectGrid projects={messages.projects} />
        </section>

        <ContributedReposSection messages={messages.contributed} repos={contributedRepos} />

        <section id="education" className="section" aria-labelledby="education-title">
          <h2 id="education-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.education.section_title }} />
          <div className="education-grid">
            {messages.education.degrees.map((d) => (
              <SectionAnimate key={d.title}>
                <article className="education-card">
                  <h3>{d.title}</h3>
                  <p className="education-school">{d.school}</p>
                </article>
              </SectionAnimate>
            ))}
          </div>
        </section>

        <section id="contact" className="section" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title section-accent" dangerouslySetInnerHTML={{ __html: messages.contact.section_title }} />
          <p className="contact-lead" dangerouslySetInnerHTML={{ __html: messages.contact.subtitle }} />
          <div className="contact-grid">
            <a className="contact-card" href={messages.contact.email_href}>
              <span className="contact-card-label">{messages.contact.email_label}</span>
              <span className="contact-card-value">{messages.contact.email_text}</span>
            </a>
            <a className="contact-card" href={messages.contact.phone_href}>
              <span className="contact-card-label">{messages.contact.phone_label}</span>
              <span className="contact-card-value">{messages.contact.phone_text}</span>
            </a>
            <a className="contact-card" href={messages.contact.linkedin_href} target="_blank" rel="noopener noreferrer">
              <span className="contact-card-label">{messages.contact.linkedin_label}</span>
              <span className="contact-card-value">{messages.contact.linkedin_href}</span>
            </a>
            <a className="contact-card" href={messages.contact.github_href} target="_blank" rel="noopener noreferrer">
              <span className="contact-card-label">{messages.contact.github_label}</span>
              <span className="contact-card-value">{messages.contact.github_href}</span>
            </a>
            <div className="contact-card contact-card--static">
              <span className="contact-card-label">{messages.contact.location_label}</span>
              <span className="contact-card-value">{messages.contact.location}</span>
              <span className="contact-card-note">{messages.contact.open_to}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p className="footer-line">
          <span dangerouslySetInnerHTML={{ __html: messages.footer.built_by }} /> · 2026
        </p>
        <div className="footer-links">
          <a href={messages.contact.github_href} target="_blank" rel="noopener noreferrer">
            {messages.footer.github}
          </a>
          <a href={messages.contact.linkedin_href} target="_blank" rel="noopener noreferrer">
            {messages.footer.linkedin}
          </a>
          <a href={messages.contact.email_href}>{messages.footer.email}</a>
        </div>
      </footer>
    </LocaleRoot>
  );
}
