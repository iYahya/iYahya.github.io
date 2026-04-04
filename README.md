# Portfolio — Yahia

Static personal portfolio for **Yahia** (React Native & front-end developer). Target: **GitHub Pages** at `https://<username>.github.io/`. Layout and tone reference: [mohammedbasha.github.io](https://mohammedbasha.github.io/).

## What this repo is

- **Fully static** — no backend.
- **Bilingual** — English and Arabic with RTL.
- **Theming** — system preference plus manual light/dark toggle, persisted in `localStorage`.

## Stack

| Area | Choice | Why |
|------|--------|-----|
| Markup / behavior | HTML, CSS, vanilla JS | No build step; works on GitHub Pages |
| Styling | Custom CSS + variables | Full control, small footprint |
| Copy | `translations/en.json`, `translations/ar.json` | No i18n library |
| Theme | `data-theme` on `<html>` + CSS variables | Predictable, easy to persist |
| RTL | `dir` / `lang` on `<html>` + `[dir="rtl"]` overrides | Scoped layout fixes |
| Fonts (EN) | Syne, DM Sans (Google Fonts) | Distinctive display + body |
| Fonts (AR) | Cairo | Arabic + RTL |
| Icons | Inline SVG | No icon font/CDN dependency |
| Motion | CSS keyframes + `IntersectionObserver` | No animation framework |

## Repo layout

```
/
├── index.html
├── style.css
├── script.js
├── translations/
│   ├── en.json
│   └── ar.json
├── assets/
│   ├── profile.jpg      # your photo
│   ├── cv-yahia.pdf     # your CV
│   └── og-image.png     # 1200×630 Open Graph image
└── README.md
```

Use **relative** asset paths (e.g. `./assets/cv-yahia.pdf`) so GitHub Pages resolves them correctly.

**Local preview:** Serve the project over HTTP (for example `npx --yes serve .` from the repo root) so the browser can load `translations/*.json` via `fetch`; opening `index.html` as a `file://` URL will not load translations in most browsers.

## Implementation phases

1. **Setup** — Folders, fonts, CSS variables for both themes, anti-flash theme script in `<head>`, translation files, meta/OG tags, favicon (`YH`).
2. **Global systems** — Theme toggle, language toggle, RTL, navbar control order: logo, nav links, EN|AR, sun/moon, Download CV.
3. **Sections** (build in order): nav → hero → about → skills → experience → projects → education → contact → footer.
4. **Polish** — Scroll animations, reduced-motion support, hover states.
5. **Responsive** — Breakpoints: &lt;480px, 480–768px, 768–1024px, &gt;1024px; `clamp` for hero type; grids as in plan.
6. **Deploy** — Push to `main`, enable Pages from repo root, smoke-test toggles and links.
7. **QA** — Checklist: i18n/RTL, theme persistence, no theme flash, nav scroll spy, CV link, filters, mobile menu.

## Design tokens (dark default)

Dark and light themes map to the same variable names; light overrides live under `[data-theme="light"]`. Core tokens include `--bg-primary`, `--bg-secondary`, `--bg-card`, `--border`, `--accent`, `--accent-secondary`, `--text-primary`, `--text-secondary`, `--text-muted`, `--shadow`, `--nav-bg`.

Anti-flash: run a small inline script in `<head>` **before** the stylesheet — read `localStorage('theme')`, else `prefers-color-scheme`, then set `data-theme` on `<documentElement>`.

## Section content (summary)

- **Hero** — Greeting, name, title, stats line, primary/secondary CTAs, mesh-style background, scroll cue.
- **About** — Two columns (flip in RTL), bio (EN/AR), stat cards: apps, years, companies.
- **Skills** — Categories: Mobile, Frontend, State & data, Backend & cloud, DevOps & tools, Security — with badges and scroll-in animation.
- **Experience** — Timeline: Inspire Studio (React Native), Alyomhost (front-end/mobile); current roles in Mansoura.
- **Projects** — Filter tabs (All / Mobile / Web / Brand); cards with stack pills and links where available.
- **Education** — MIS (Delta Academy), Information Security diploma (Mansoura University).
- **Contact** — Headline + subtext; email, LinkedIn, GitHub, location; links open in a new tab; no form.

## Translation keys (groups)

Structure your JSON under namespaces such as: `nav`, `hero`, `about`, `skills`, `experience`, `projects`, `education`, `contact`, `footer`, `controls` (theme, language, download CV). Keep HTML free of user-visible hardcoded strings; load strings from the active locale file.

## Before going live

Replace placeholders:

- Email, LinkedIn, GitHub URLs  
- `assets/profile.jpg`, `assets/cv-yahia.pdf`, `assets/og-image.png`  
- App Store / Play links for shipped apps; live URLs where applicable  
- `<username>` in deploy URL with your GitHub username  

## License / credits

Designed and built by Yahia · Mansoura, Egypt.
